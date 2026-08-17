// حسابات المستعملين — تخزين محلي بسيط بلا قاعدة بيانات خارجية.
// كلمات السر مُجزَّأة بـ scrypt، والجلسات كوكي موقَّع بـ HMAC.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = process.env.FAHES_DATA || path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SECRET_FILE = path.join(DATA_DIR, 'secret.key');
const SESSION_DAYS = 30;

function ensure() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
  if (!fs.existsSync(SECRET_FILE)) fs.writeFileSync(SECRET_FILE, crypto.randomBytes(32).toString('hex'), { mode: 0o600 });
}
ensure();

const SECRET = fs.readFileSync(SECRET_FILE, 'utf8').trim();

function readUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); } catch { return []; }
}
function writeUsers(users) {
  const tmp = USERS_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(users, null, 1));
  fs.renameSync(tmp, USERS_FILE);
}

/* ── كلمات السر ── */
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const dk = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${dk}`;
}
function verifyPassword(password, stored) {
  const [salt, dk] = String(stored).split(':');
  if (!salt || !dk) return false;
  const test = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(dk, 'hex'), Buffer.from(test, 'hex'));
}

/* ── الجلسات ── */
function sign(value) {
  const mac = crypto.createHmac('sha256', SECRET).update(value).digest('base64url');
  return `${value}.${mac}`;
}
function unsign(signed) {
  if (!signed || !signed.includes('.')) return null;
  const idx = signed.lastIndexOf('.');
  const value = signed.slice(0, idx);
  const expected = crypto.createHmac('sha256', SECRET).update(value).digest('base64url');
  const given = signed.slice(idx + 1);
  if (given.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected))) return null;
  return value;
}
function parseCookies(header = '') {
  const out = {};
  header.split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

/* ── واجهة الاستعمال ── */
const normEmail = (e) => String(e || '').trim().toLowerCase();

function createUser({ email, password, name, wilaya }) {
  const users = readUsers();
  const mail = normEmail(email);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(mail)) throw new Error('البريد الإلكتروني غير صالح.');
  if (String(password).length < 6) throw new Error('كلمة السر يجب أن تكون 6 أحرف على الأقل.');
  if (users.some((u) => u.email === mail)) throw new Error('هذا البريد مسجَّل بالفعل — سجّل الدخول بدله.');
  const user = {
    id: crypto.randomUUID(),
    email: mail,
    name: String(name || '').trim().slice(0, 60) || mail.split('@')[0],
    wilaya: String(wilaya || '').trim().slice(0, 40),
    pass: hashPassword(String(password)),
    created: new Date().toISOString(),
    files: [],
  };
  users.push(user);
  writeUsers(users);
  return user;
}

function authenticate(email, password) {
  const user = readUsers().find((u) => u.email === normEmail(email));
  if (!user || !verifyPassword(String(password), user.pass)) return null;
  return user;
}

function getUser(id) {
  return readUsers().find((u) => u.id === id) || null;
}

function updateUser(id, patch) {
  const users = readUsers();
  const i = users.findIndex((u) => u.id === id);
  if (i < 0) return null;
  users[i] = { ...users[i], ...patch };
  writeUsers(users);
  return users[i];
}

/** يحفظ نتيجة فحص في ملفات المستعمل (يستبدل نتيجة أقدم لنفس الخدمة). */
function saveFile(userId, file) {
  const user = getUser(userId);
  if (!user) return null;
  const files = (user.files || []).filter((f) => f.service !== file.service);
  files.unshift({ ...file, id: crypto.randomUUID(), saved: new Date().toISOString(), doneDocs: [] });
  return updateUser(userId, { files: files.slice(0, 60) });
}
function deleteFile(userId, fileId) {
  const user = getUser(userId);
  if (!user) return null;
  return updateUser(userId, { files: (user.files || []).filter((f) => f.id !== fileId) });
}
function toggleDoc(userId, fileId, doc) {
  const user = getUser(userId);
  if (!user) return null;
  const files = (user.files || []).map((f) => {
    if (f.id !== fileId) return f;
    const done = new Set(f.doneDocs || []);
    if (done.has(doc)) done.delete(doc); else done.add(doc);
    return { ...f, doneDocs: [...done] };
  });
  return updateUser(userId, { files });
}

const COOKIE = 'fahes_session';
function sessionCookie(userId) {
  const payload = sign(`${userId}|${Date.now() + SESSION_DAYS * 864e5}`);
  return `${COOKIE}=${encodeURIComponent(payload)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`;
}
const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

/** middleware: يضع req.user إن وُجدت جلسة صالحة. */
function attachUser(req, _res, next) {
  req.user = null;
  const raw = parseCookies(req.headers.cookie || '')[COOKIE];
  const value = unsign(raw);
  if (value) {
    const [id, exp] = value.split('|');
    if (Number(exp) > Date.now()) req.user = getUser(id);
  }
  next();
}
function requireUser(req, res, next) {
  if (!req.user) return res.redirect('/login?next=' + encodeURIComponent(req.originalUrl));
  next();
}

module.exports = {
  createUser, authenticate, getUser, updateUser,
  saveFile, deleteFile, toggleDoc,
  sessionCookie, clearCookie, attachUser, requireUser,
  countUsers: () => readUsers().length,
};
