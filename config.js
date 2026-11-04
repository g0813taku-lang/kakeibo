<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="山之内家計簿">
<meta name="theme-color" content="#2b4c7e">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="manifest.json">
<title>山之内家計簿</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap">
<style>
/* Layout: sticky month bar, summary strip, then breakdown + daily ledger (2 columns on wide, stacked on phone) */
:root{
  --paper:#f3f5f2; --surface:#ffffff; --ink:#1d2725; --muted:#62706b; --line:#dbe1dd; --soft:#e9eee9;
  --accent:#2b4c7e; --accent-ink:#ffffff; --expense:#1d2725; --income:#2c7a4b; --warn:#a4462f;
  --c0:#d9822b; --c1:#c9553d; --c2:#3f8fb0; --c3:#5b7bd5; --c4:#9b5fc0; --c5:#d0679a; --c6:#3fa38a; --c7:#7a8a3a; --c8:#b8944a; --c9:#7d6e63; --c10:#8a9aa0;
  --font-body:"Zen Kaku Gothic New","Hiragino Sans","Noto Sans JP",system-ui,sans-serif;
  --font-num:"DM Mono",ui-monospace,"SF Mono",Menlo,monospace;
  --r:12px;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --paper:#111615; --surface:#19201e; --ink:#e4ebe7; --muted:#97a49f; --line:#2b3532; --soft:#202926;
  --accent:#8fb0e3; --accent-ink:#0f1a2b; --expense:#e4ebe7; --income:#7cc99a; --warn:#e8907a;
  --c0:#e79a4c; --c1:#e07a63; --c2:#62acc9; --c3:#8099e6; --c4:#b585d6; --c5:#e08bb4; --c6:#5cc0a5; --c7:#a3b45a; --c8:#d2b06b; --c9:#a9978a; --c10:#9fb0b6;
  color-scheme:dark}}
:root[data-theme="dark"]{
  --paper:#111615; --surface:#19201e; --ink:#e4ebe7; --muted:#97a49f; --line:#2b3532; --soft:#202926;
  --accent:#8fb0e3; --accent-ink:#0f1a2b; --expense:#e4ebe7; --income:#7cc99a; --warn:#e8907a;
  --c0:#e79a4c; --c1:#e07a63; --c2:#62acc9; --c3:#8099e6; --c4:#b585d6; --c5:#e08bb4; --c6:#5cc0a5; --c7:#a3b45a; --c8:#d2b06b; --c9:#a9978a; --c10:#9fb0b6;
  color-scheme:dark}
*{box-sizing:border-box}
body{background:var(--paper);color:var(--ink);font-family:var(--font-body);font-size:15px;line-height:1.6;
  padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:0 calc(120px + env(safe-area-inset-bottom,0px))}
html{-webkit-text-size-adjust:100%}
body{margin:0}
.num{font-family:var(--font-num);font-variant-numeric:tabular-nums;letter-spacing:-.01em}
button,input,select{font:inherit;color:inherit}
button{cursor:pointer}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.wrap{max-width:1000px;margin:0 auto}

/* top bar */
.top{position:sticky;top:0;z-index:5;background:var(--paper);border-bottom:1px solid var(--line);
  margin:0 calc(-1 * max(16px,env(safe-area-inset-left,0px))) 0;padding:calc(10px + env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) 10px max(16px,env(safe-area-inset-left,0px))}
.top-in{max-width:1000px;margin:0 auto;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.brand{font-weight:700;font-size:16px;letter-spacing:.04em;margin-right:auto}
.month{display:flex;align-items:center;gap:4px}
.month b{font-size:17px;min-width:7.5em;text-align:center;font-weight:700}
.iconbtn{width:36px;height:36px;border-radius:50%;border:1px solid var(--line);background:var(--surface);display:grid;place-items:center;font-size:18px;line-height:1}
.btn{border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:7px 14px;font-size:14px;font-weight:500;white-space:nowrap}
.btn.primary{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
.btn.danger{color:var(--warn);border-color:color-mix(in srgb,var(--warn) 45%,var(--line))}
.btn.danger.armed{background:var(--warn);color:var(--surface);border-color:var(--warn)}
.btn:disabled{opacity:.5;cursor:default}

.notice{margin:14px 0 0;padding:10px 14px;border-radius:var(--r);background:var(--soft);color:var(--muted);font-size:13px}
.notice[hidden]{display:none}

/* summary */
.summary{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;margin-top:16px}
.summary>div{background:var(--surface);padding:14px 16px;min-width:0}
.lbl{font-size:12px;color:var(--muted);letter-spacing:.06em}
.big{font-size:28px;font-weight:500;line-height:1.25}
.mid{font-size:19px;font-weight:500;line-height:1.35}
.pos{color:var(--income)} .neg{color:var(--warn)}
.split{grid-column:1/-1;display:flex;flex-direction:column;gap:6px}
.splitbar{display:flex;height:8px;border-radius:4px;overflow:hidden;background:var(--soft)}
.splitbar i{display:block;height:100%}
.legend{display:flex;gap:16px;flex-wrap:wrap;font-size:13px;color:var(--muted)}
.legend span::before{content:"";display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:6px;background:var(--dot)}

@media (max-width:620px){
  .summary{grid-template-columns:1fr 1fr}
  .summary>.s-exp{grid-column:1/-1}
}

.grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.45fr);gap:24px;margin-top:24px;align-items:start}
@media (max-width:820px){.grid{grid-template-columns:minmax(0,1fr)}}
h2{font-size:14px;font-weight:700;letter-spacing:.08em;margin:0 0 10px;color:var(--muted)}

/* breakdown */
.cats{display:flex;flex-direction:column;gap:2px}
.cat{display:grid;grid-template-columns:7.5em 1fr auto;gap:10px;align-items:center;padding:7px 8px;border-radius:8px;border:0;background:none;text-align:left;width:100%}
.cat:hover{background:var(--soft)}
.cat.on{background:var(--soft);box-shadow:inset 0 0 0 1px var(--line)}
.cat .nm{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cat .bar{height:8px;border-radius:4px;background:var(--soft);overflow:hidden}
.cat .bar i{display:block;height:100%;border-radius:4px}
.cat .amt{font-size:14px;text-align:right;min-width:6.5em}
.cat .pct{color:var(--muted);font-size:12px;margin-left:6px}

/* list */
.filters{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.chip{border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:4px 12px;font-size:13px}
.chip[aria-pressed="true"]{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.day{margin-bottom:14px}
.dayhead{display:flex;justify-content:space-between;font-size:13px;color:var(--muted);padding:0 4px 4px;border-bottom:1px solid var(--line)}
.row{display:grid;grid-template-columns:10px minmax(0,1fr) auto;gap:12px;align-items:center;padding:10px 4px;border-bottom:1px solid var(--line);background:none;border-left:0;border-right:0;border-top:0;width:100%;text-align:left}
.row:hover{background:var(--soft)}
.dot{width:10px;height:10px;border-radius:3px}
.row .t{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.row .s{font-size:12px;color:var(--muted);display:flex;gap:8px;flex-wrap:wrap}
.tag{font-size:11px;border:1px solid var(--line);border-radius:4px;padding:0 5px;line-height:1.6}
.tag.pp{border-color:color-mix(in srgb,var(--c1) 50%,var(--line));color:var(--c1)}
.row .a{font-size:15px;text-align:right}

.empty{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:24px;display:flex;flex-direction:column;gap:14px}
.empty h3{margin:0;font-size:18px}
.empty ol{margin:0;padding-left:1.3em;color:var(--muted);font-size:14px}
.empty .acts{display:flex;gap:10px;flex-wrap:wrap}
.quiet{color:var(--muted);font-size:14px;padding:16px 4px}

.fab{position:fixed;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:6;
  background:var(--accent);color:var(--accent-ink);border:0;border-radius:999px;padding:14px 20px;font-weight:700;font-size:15px;box-shadow:0 6px 18px rgb(0 0 0 / .18)}

/* sheets */
.backdrop{position:fixed;inset:0;z-index:20;background:rgb(0 0 0 / .4);display:flex;align-items:flex-end;justify-content:center}
@media (min-width:700px){.backdrop{align-items:center}}
.sheet{background:var(--surface);width:100%;max-width:560px;max-height:92vh;overflow:auto;border-radius:16px 16px 0 0;
  padding:18px max(18px,env(safe-area-inset-left,0px)) calc(18px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:14px}
@media (min-width:700px){.sheet{border-radius:16px}}
.sheet.wide{max-width:760px}
.sheet h3{margin:0;font-size:18px}
.shead{display:flex;justify-content:space-between;align-items:center;gap:12px}
.field{display:flex;flex-direction:column;gap:4px}
.field label{font-size:12px;color:var(--muted);letter-spacing:.05em}
.field input,.field select{border:1px solid var(--line);background:var(--paper);border-radius:8px;padding:10px 12px;font-size:16px;width:100%;min-width:0}
.field input.amt{font-family:var(--font-num);font-size:22px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.seg{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--line);border-radius:8px;overflow:hidden}
.seg button{border:0;background:var(--paper);padding:9px;font-weight:500}
.seg button[aria-pressed="true"]{background:var(--ink);color:var(--paper)}
.sacts{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}
.sacts .left{margin-right:auto}
.check{display:flex;gap:8px;align-items:center;font-size:13px;color:var(--muted)}
.err{color:var(--warn);font-size:13px;min-height:1em}

.drop{border:1.5px dashed var(--line);border-radius:var(--r);padding:22px;text-align:center;color:var(--muted);display:flex;flex-direction:column;gap:10px;align-items:center}
.drop.over{border-color:var(--accent);background:var(--soft)}
.prev{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:var(--r);max-height:46vh;overflow:auto}
.prow{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:4px 12px;align-items:center;padding:9px 12px;border-bottom:1px solid var(--line)}
.prow:last-child{border-bottom:0}
.prow.off{opacity:.55}
.prow .m{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.prow .d{font-size:12px;color:var(--muted)}
.prow select{grid-column:2/4;border:1px solid var(--line);background:var(--paper);border-radius:6px;padding:4px 8px;font-size:16px;max-width:12em}
.prow input[type=checkbox]{width:18px;height:18px;grid-row:span 2}
.pstat{font-size:13px;color:var(--muted)}
.loading{color:var(--muted);padding:40px 0;text-align:center}
@media (prefers-reduced-motion:no-preference){.sheet{animation:up .18s ease-out}@keyframes up{from{transform:translateY(16px);opacity:.6}}}
.authwrap{min-height:100vh;display:grid;place-items:center;padding-block:calc(24px + env(safe-area-inset-top,0px)) 24px}
.authbox{width:100%;max-width:380px;display:flex;flex-direction:column;gap:14px}
.authbox h1{margin:0;font-size:24px;letter-spacing:.04em;display:flex;align-items:center;gap:12px}
.authbox h1 img{width:44px;height:44px;border-radius:10px}
.authbox form,.authbox .card{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:20px;display:flex;flex-direction:column;gap:14px}
.authbox .btn{padding:11px 16px;font-size:15px}
.linkbtn{background:none;border:0;color:var(--accent);font-size:14px;padding:4px;text-decoration:underline;align-self:center}
.foot{max-width:1000px;margin:32px auto 0;font-size:13px;color:var(--muted);display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.foot .linkbtn{padding:0}
</style>
</head>
<body>

<div id="auth" class="authwrap" hidden>
  <div class="authbox">
    <h1><img src="apple-touch-icon.png" alt="">山之内家計簿</h1>
    <form id="loginBox" novalidate>
      <div class="field"><label for="aEmail">メールアドレス</label><input id="aEmail" type="email" autocomplete="username" inputmode="email"></div>
      <div class="field"><label for="aPass">パスワード(6文字以上)</label><input id="aPass" type="password" autocomplete="current-password"></div>
      <p class="err" id="aErr"></p>
      <button type="submit" class="btn primary">ログイン</button>
      <button type="button" class="btn" id="aSignup">はじめての方:アカウントを作る</button>
      <button type="button" class="linkbtn" id="aReset">パスワードを忘れた</button>
    </form>
    <div class="card" id="verifyBox" hidden>
      <div><b id="vEmail"></b> に確認メールを送りました。メール内のリンクを開いてから、下のボタンを押してください。</div>
      <p class="err" id="vMsg"></p>
      <button type="button" class="btn primary" id="vDone">確認しました</button>
      <button type="button" class="btn" id="vResend">確認メールを送り直す</button>
      <button type="button" class="linkbtn" id="vOut">別のアカウントでログイン</button>
    </div>
    <div class="card" id="setupBox" hidden>
      <b>まだFirebaseの設定が済んでいません。</b>
      <div>index.html の上のほうにある firebaseConfig の部分に、Firebaseの画面でコピーした設定を貼り付けてください。</div>
    </div>
  </div>
</div>

<div id="shell" hidden>
<header class="top">
  <div class="top-in">
    <div class="brand">山之内家計簿</div>
    <div class="month">
      <button class="iconbtn" id="prevM" aria-label="前の月">‹</button>
      <b id="mLabel">—</b>
      <button class="iconbtn" id="nextM" aria-label="次の月">›</button>
    </div>
    <button class="btn" id="openImport">PayPay CSVを取り込む</button>
  </div>
</header>

<main class="wrap">
  <p class="notice" id="notice" hidden></p>
  <div id="app"><p class="loading">読み込み中…</p></div>
  <footer class="foot"><span>ログイン中:<span id="who"></span></span><button type="button" class="linkbtn" id="logout">ログアウト</button></footer>
</main>

<button class="fab" id="fab">＋ 現金を記録</button>
</div>

<!-- entry sheet -->
<div class="backdrop" id="entrySheet" hidden>
  <form class="sheet" id="entryForm" novalidate>
    <div class="shead"><h3 id="entryTitle">現金の記録</h3><button type="button" class="iconbtn" data-close aria-label="閉じる">×</button></div>
    <div class="seg" role="group" aria-label="種類">
      <button type="button" id="tExp" aria-pressed="true">支出</button>
      <button type="button" id="tInc" aria-pressed="false">収入</button>
    </div>
    <div class="field"><label for="fAmount">金額(円)</label><input id="fAmount" class="amt" inputmode="numeric" autocomplete="off" placeholder="0"></div>
    <div class="two">
      <div class="field"><label for="fDate">日付</label><input id="fDate" type="date"></div>
      <div class="field"><label for="fCat">カテゴリ</label><select id="fCat"></select></div>
    </div>
    <div class="field"><label for="fMemo">お店・内容</label><input id="fMemo" autocomplete="off" placeholder="例:八百屋、ランチ代"></div>
    <div class="field"><label for="fSource">支払い方法</label>
      <select id="fSource"><option value="cash">現金</option><option value="paypay">PayPay</option><option value="other">その他</option></select></div>
    <label class="check" id="rememberWrap" hidden><input type="checkbox" id="fRemember" checked> この取引先は次回の取り込みからこのカテゴリにする</label>
    <p class="err" id="fErr"></p>
    <div class="sacts">
      <button type="button" class="btn danger left" id="fDelete" hidden>削除</button>
      <button type="button" class="btn" data-close>キャンセル</button>
      <button type="submit" class="btn primary" id="fSave">保存</button>
    </div>
  </form>
</div>

<!-- import sheet -->
<div class="backdrop" id="importSheet" hidden>
  <div class="sheet wide">
    <div class="shead"><h3>PayPayのCSVを取り込む</h3><button type="button" class="iconbtn" data-close aria-label="閉じる">×</button></div>
    <div class="drop" id="drop">
      <div>PayPayアプリの取引履歴、またはPayPayカードの利用明細のCSVを選んでください</div>
      <label class="btn primary" for="fileIn">ファイルを選ぶ</label>
      <input type="file" id="fileIn" accept=".csv,text/csv" hidden>
      <div style="font-size:12px">PCではここにドラッグ&ドロップもできます</div>
    </div>
    <div id="prevWrap" hidden>
      <p class="pstat" id="pStat"></p>
      <div class="prev" id="prev"></div>
    </div>
    <p class="err" id="iErr"></p>
    <div class="sacts">
      <button type="button" class="btn" data-close>キャンセル</button>
      <button type="button" class="btn primary" id="doImport" disabled>取り込む</button>
    </div>
  </div>
</div>

<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
<script>
/* ===== ここをFirebaseの設定に置き換えてください ===== */
const firebaseConfig = {
  apiKey: "AIzaSyD9haLMTx0gwvT2dvEGZoZoc0slZqHrVU8",
  authDomain: "yamanouchi-kakeibo.firebaseapp.com",
  projectId: "yamanouchi-kakeibo",
  storageBucket: "yamanouchi-kakeibo.firebasestorage.app",
  messagingSenderId: "429495687807",
  appId: "1:429495687807:web:f511a10d17cb02dc62fd4a"
};
/* 家計簿の名前(変更不要) */
const HOUSEHOLD = "yamanouchi";
