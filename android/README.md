# فاحص — تطبيق أندرويد

غلاف أصلي (WebView) لتطبيق فاحص: يفتح الخدمات داخل التطبيق، ويفتح المواقع الرسمية
الخارجية في المتصفح، مع شاشة انطلاق متدرّجة، سحب للتحديث، زر رجوع داخلي، وشاشة «بلا اتصال».

- `applicationId`: `dz.fahes.app` · `versionName` 1.0 · minSdk 24 · targetSdk 34
- الرابط المحمَّل: `BASE_URL` في `app/src/main/java/dz/fahes/app/MainActivity.java`

## البناء
```bash
export JAVA_HOME=/path/jdk17 ANDROID_HOME=/path/android-sdk
export FAHES_KEYSTORE=/path/fahes-release.jks FAHES_STORE_PASS=… FAHES_KEY_PASS=… FAHES_KEY_ALIAS=fahes
gradle assembleRelease   # APK  → app/build/outputs/apk/release/app-release.apk
gradle bundleRelease     # AAB  → app/build/outputs/bundle/release/app-release.aab
```

⚠️ ملف التوقيع `fahes-release.jks` غير مرفوع إلى Git عمداً. احتفظ به: بدونه لا يمكن نشر
أي تحديث لاحق لنفس التطبيق على Google Play.
