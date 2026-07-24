# ODDIRO ― 色当てクイズ

5×5マスの中から色の違う1マスを見つける色覚クイズゲーム。
PWA / Capacitor構成済み。あとはローカル環境でAndroid Studioを開いてビルドするだけの状態です。

## フォルダ構成

```
oddiro/
├── www/                  ← Webアプリ本体（Capacitorのwebdir）
│   ├── index.html        ← ゲーム本体（HTML/CSS/JS 単一ファイル）
│   ├── manifest.json     ← PWAマニフェスト
│   ├── sw.js              ← Service Worker（オフラインキャッシュ）
│   └── icons/             ← 各サイズのアイコン
├── android/               ← Capacitorが生成したネイティブAndroidプロジェクト
├── capacitor.config.json  ← Capacitor設定（.tsではなく.json形式）
├── package.json
└── README.md
```

## セットアップ手順（Windows環境）

### 0. 前提条件
- **プロジェクトの保存パスは必ずASCII文字のみ**にしてください（日本語・全角文字が混じるとGradleビルドが失敗します）。
  - 良い例: `C:\dev\oddiro`
  - 悪い例: `C:\Users\フィットツー\Documents\oddiro`
- Node.js（LTS版）
- JDK 17（ぐるくじと同じ理由でJDK17が必要です）
- Android Studio（最新版）

### 1. 依存関係のインストール
```powershell
cd C:\dev\oddiro
npm install
```

### 2. Android Studioで開く
```powershell
npx cap open android
```
Android StudioがGradle同期を自動で始めます。初回は少し時間がかかります。

### 3. 実機/エミュレータで動作確認
Android Studio上部の再生ボタンでそのまま実行できます。

### 4. リリースビルド（署名付きAPK / AABの作成）
ぐるくじと同じ流れです。まだキーストーンがなければ新規作成してください（**ODDIRO用に新しいキーストアを作る**か、既存の`gurukuji-release.jks`とは別の鍵を用意することを推奨します。Google Playは1つのキーストアを複数アプリで使い回すこと自体は可能ですが、アプリごとに分けておくと事故が少ないです）。

Android Studio → Build → Generate Signed Bundle / APK → Android App Bundle (AAB) を選択 → Google Play提出用は`.aab`形式を推奨。

### 5. Google Play Consoleへの登録
1. 新規アプリ作成（アプリ名: ODDIRO / パッケージ名: `com.yutaXXX.oddiro`）
2. ストアの掲載情報（アプリの説明・スクリーンショット・アイコン512×512・特徴画像）を用意
3. まずは**クローズドテスト**でアップロード → ぐるくじ・ウイスキーノートと同様、12人14日間のテスター条件を満たしてから本番公開に進める流れが安全です

## 現状の実装状況

- ✅ ゲームロジック（5×5グリッド、難易度カーブ、ステージ進行）
- ✅ ポイント / アイテムショップ（ハーフヒント・見えやすカラー・やり直しチケット・正解表示）
- ✅ チェックポイント解放機能（永続開放、ポイント消費）
- ✅ HOMEボタン（ゲーム中・ショップ画面）
- ✅ PWA化（オフラインキャッシュ、ホーム画面追加対応）
- ✅ Capacitorラップ済みAndroidプロジェクト、アイコン一式生成済み
- ✅ **AdMob広告SDK実装済み**（`@capacitor-community/admob`）
  - アダプティブバナー広告（画面下部、常時表示）
  - リワード動画広告（「見る」ボタン → 最後まで視聴すると+25pt）
  - 現在は**Googleの公式テスト広告ID**を使用中。実機ビルドではテスト広告が表示されます
  - Web/PWA版（ブラウザ）では広告SDKが存在しないため、リワード広告ボタンは900msの仮処理でフォールバックします（動作確認用）
- ⬜ iOSプロジェクト未追加（`npx cap add ios`はmacOS環境が必要です）
- ⬜ ストア掲載用のスクリーンショット・特徴画像・プライバシーポリシーページ未作成
- ⬜ 実機での動作確認（このサンドボックス環境ではAndroid SDKが無くビルド実行はできないため、Android Studio側で最終確認をお願いします）

## リリース前に必ずやること（広告ID差し替え）

`www/index.html` 内、`AD_CONFIG`という定数に今はGoogleのテスト用広告IDが入っています。Android用・iOS用で別々のIDを持てる構造になっています。

```js
const AD_CONFIG = {
  android: {
    banner: 'ca-app-pub-3940256099942544/6300978111',   // ← Android用の実際のバナーIDに差し替え
    rewarded: 'ca-app-pub-3940256099942544/5224354917',  // ← Android用の実際のリワードIDに差し替え
  },
  ios: {
    banner: 'ca-app-pub-3940256099942544/2934735716',   // ← iOS用の実際のバナーIDに差し替え
    rewarded: 'ca-app-pub-3940256099942544/1712485313',  // ← iOS用の実際のリワードIDに差し替え
  },
  isTesting: true  // ← 本番リリース時は false に変更
};
```

また `android/app/src/main/AndroidManifest.xml` 内の以下も、AdMobコンソールで発行される実際のアプリIDに差し替えてください（現在はGoogle公式テストApp IDが入っています）。

```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-3940256099942544~3347511713" />
```

テストID・実IDの取得手順は [AdMobコンソール](https://apps.admob.com/) → アプリを追加 → 広告ユニットを作成、の順で進めます。差し替えを忘れたまま公開すると収益が発生しないのでご注意ください。

## 既知の注意点（過去アプリからの教訓を反映済み）

- ✅ `capacitor.config.json`は`.ts`ではなく`.json`で作成済み
- ✅ `webDir`はプロジェクトルートではなく`www`を指定済み
- ✅ compileSdk / targetSdk は 36（Google Play要求の最低ライン35を満たしています）
- ⚠️ ファイルをNotepadで編集するとUTF-16化けの原因になるので、VSCodeなど別のエディタを推奨します
- ⚠️ PowerShellで`npx`コマンドが弾かれる場合は実行ポリシーの変更が必要です：
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
  ```


---

## iOS版のリリース手順（Codemagic経由・Mac不要）

Macを持っていない前提で、Codemagic（クラウドCI）を使ってビルド〜TestFlightアップロードまで自動化する手順です。

### 0. 前提: Apple Developer Program登録
[developer.apple.com/programs](https://developer.apple.com/programs/) で個人（Individual）登録。年間$99。
本人確認に数日かかることがあるので、早めに着手するのがおすすめです。

### 1. App Store Connectでアプリを作成
[appstoreconnect.apple.com](https://appstoreconnect.apple.com/) → マイApp → 「+」→ 新規App
- プラットフォーム: iOS
- 名前: ODDIRO
- プライマリ言語: 日本語
- バンドルID: `com.yutaXXX.oddiro`（Identifiers画面で先に登録が必要な場合があります → Certificates, Identifiers & Profiles → Identifiers → 「+」で同じ文字列を登録）
- SKU: 任意の管理用文字列（例: `oddiro001`）

### 2. App Store Connect APIキーを発行
App Store Connect → ユーザーとアクセス → 統合 → App Store Connect API → 「+」でキーを発行。
- 役割: **App Manager**（またはAdmin）
- 発行される `.p8`ファイル / Key ID / Issuer ID の3つを控えておく（`.p8`は一度しかダウンロードできないので必ず保存）

### 3. Codemagicにサインアップしてリポジトリを接続
[codemagic.io](https://codemagic.io/) にGitHubアカウントでサインアップ → `yscaesar3-pixel/oddiro`リポジトリを接続。

### 4. Codemagic側にApple連携を登録
Codemagic → Teams → Integrations → Apple Developer Portal → 「Add integration」
- 手順2で発行した `.p8` / Key ID / Issuer ID を入力
- 登録名を `oddiro_asc_key` にする（このプロジェクトの`codemagic.yaml`内で指定している名前と一致させる必要があります。変えたい場合は`codemagic.yaml`内の`app_store_connect: oddiro_asc_key`も合わせて書き換えてください）

### 5. `codemagic.yaml`をリポジトリにpush
このプロジェクトにはすでに`codemagic.yaml`が含まれています。GitHubにpushするだけでCodemagic側が自動検出します。

```powershell
cd C:\dev\oddiro
git add .
git commit -m "add ios platform and codemagic ci config"
git push
```

### 6. Codemagicでビルドを実行
Codemagic管理画面 → oddiroリポジトリ → workflow `oddiro-ios` → 「Start new build」。
- 初回は証明書・プロビジョニングプロファイルの自動生成が走るため、数分〜十数分かかります
- ビルドが成功すると、自動的にTestFlightへアップロードされます（`codemagic.yaml`内で`submit_to_testflight: true`に設定済み）

### 7. TestFlightでテスト配信
App Store Connect → TestFlight タブ → 内部テスト or 外部テストのグループを作成 → ビルドを割り当て → テスターのメールアドレスを追加。
外部テストの場合は簡易審査（通常24時間以内）が入ります。

### iOS版で必ず確認・差し替えが必要なもの

- `www/index.html`内`AD_CONFIG`のバナー/リワード広告ID（AdMobで**iOS用アプリ**を別途登録すると、Androidとは別のIDが発行されます）
- `ios/App/App/Info.plist`内の`GADApplicationIdentifier`（現在はGoogle公式テストID）
- `codemagic.yaml`内の`bundle_identifier`（すでに`com.yutaXXX.oddiro`で設定済み、変更の必要があれば要修正）

### iOS版で追加対応した仕様

- 画面はiPhone/iPadともに**縦向き固定**にしてあります（ゲームUIが縦画面前提のため）
- iOS 14.5以降で必須の**トラッキング許可ダイアログ（ATT）**と、EEA圏向けの**同意フォーム**を組み込み済みです（`initAds()`内の`requestTrackingAndConsent()`）
- AdMob SDKが要求する`SKAdNetworkItems`をInfo.plistに追加済みです

### なぜCocoaPodsを使っていないのか

このプロジェクトはCapacitorの新しいSwift Package Manager（SPM）方式でiOSプラグインを管理しています（`ios/App/CapApp-SPM`フォルダがそれです）。従来の`pod install`が不要なため、CI設定がシンプルになります。
