package dz.fahes.app;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

/**
 * فاحص — غلاف أصلي لتطبيق الويب: يفتح الخدمات داخل التطبيق،
 * ويفتح المواقع الرسمية الخارجية في المتصفح، مع شاشة "بلا اتصال" وسحب للتحديث.
 */
public class MainActivity extends AppCompatActivity {

  private static final String BASE_URL = "http://185.114.48.164:8120/";
  private static final String HOST = "185.114.48.164";

  private WebView web;
  private SwipeRefreshLayout refresh;
  private View offline;
  private boolean loadFailed = false;

  @SuppressLint("SetJavaScriptEnabled")
  @Override
  protected void onCreate(Bundle state) {
    super.onCreate(state);
    setTheme(R.style.Theme_Fahes);

    web = new WebView(this);
    WebSettings s = web.getSettings();
    s.setJavaScriptEnabled(true);
    s.setDomStorageEnabled(true);
    s.setLoadWithOverviewMode(true);
    s.setUseWideViewPort(true);
    s.setCacheMode(WebSettings.LOAD_DEFAULT);
    s.setSupportZoom(false);
    web.setBackgroundColor(Color.parseColor("#FAF7F7"));
    web.setOverScrollMode(View.OVER_SCROLL_NEVER);
    CookieManager.getInstance().setAcceptCookie(true);
    CookieManager.getInstance().setAcceptThirdPartyCookies(web, false);

    web.setWebViewClient(new WebViewClient() {
      @Override
      public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        Uri uri = request.getUrl();
        if (uri.getHost() != null && uri.getHost().contains(HOST)) return false;
        startActivity(new Intent(Intent.ACTION_VIEW, uri));
        return true;
      }

      @Override
      public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
        loadFailed = false;
      }

      @Override
      public void onPageFinished(WebView view, String url) {
        refresh.setRefreshing(false);
        offline.setVisibility(loadFailed ? View.VISIBLE : View.GONE);
        web.setVisibility(loadFailed ? View.GONE : View.VISIBLE);
      }

      @Override
      public void onReceivedError(WebView view, WebResourceRequest request, android.webkit.WebResourceError error) {
        if (request.isForMainFrame()) loadFailed = true;
      }
    });

    refresh = new SwipeRefreshLayout(this);
    refresh.setColorSchemeColors(Color.parseColor("#B31C2C"));
    refresh.addView(web, new ViewGroup.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
    refresh.setOnRefreshListener(() -> load(web.getUrl() == null ? BASE_URL : web.getUrl()));

    offline = buildOffline();
    offline.setVisibility(View.GONE);

    LinearLayout root = new LinearLayout(this);
    root.setOrientation(LinearLayout.VERTICAL);
    root.addView(refresh, new LinearLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));
    root.addView(offline, new LinearLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
    setContentView(root);

    getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
      @Override
      public void handleOnBackPressed() {
        if (web.canGoBack()) web.goBack();
        else finish();
      }
    });

    load(state == null ? BASE_URL : null);
    if (state != null) web.restoreState(state);
  }

  private void load(String url) {
    if (url == null) return;
    if (!isOnline()) {
      loadFailed = true;
      offline.setVisibility(View.VISIBLE);
      web.setVisibility(View.GONE);
      refresh.setRefreshing(false);
      return;
    }
    offline.setVisibility(View.GONE);
    web.setVisibility(View.VISIBLE);
    web.loadUrl(url);
  }

  private boolean isOnline() {
    ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
    if (cm == null) return true;
    NetworkInfo info = cm.getActiveNetworkInfo();
    return info != null && info.isConnected();
  }

  private View buildOffline() {
    LinearLayout box = new LinearLayout(this);
    box.setOrientation(LinearLayout.VERTICAL);
    box.setGravity(android.view.Gravity.CENTER);
    box.setPadding(48, 48, 48, 48);
    box.setBackgroundColor(Color.parseColor("#FAF7F7"));

    TextView title = new TextView(this);
    title.setText(R.string.offline_title);
    title.setTextSize(21);
    title.setTextColor(Color.parseColor("#3F0A10"));
    title.setGravity(android.view.Gravity.CENTER);

    TextView body = new TextView(this);
    body.setText(R.string.offline_body);
    body.setTextSize(15);
    body.setTextColor(Color.parseColor("#4D3F44"));
    body.setGravity(android.view.Gravity.CENTER);
    body.setPadding(0, 18, 0, 26);

    Button retry = new Button(this);
    retry.setText(R.string.retry);
    retry.setAllCaps(false);
    retry.setTextColor(Color.WHITE);
    retry.setBackgroundColor(Color.parseColor("#B31C2C"));
    retry.setOnClickListener(v -> load(web.getUrl() == null ? BASE_URL : web.getUrl()));

    box.addView(title);
    box.addView(body);
    box.addView(retry);
    return box;
  }

  @Override
  protected void onSaveInstanceState(Bundle out) {
    super.onSaveInstanceState(out);
    web.saveState(out);
  }
}
