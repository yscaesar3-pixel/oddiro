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

`www/index.html` 内、`AD_CONFIG`という定数に今はGoogleのテスト用広告IDが入っています。

```js
const AD_CONFIG = {
  banner: 'ca-app-pub-3940256099942544/6300978111',   // ← 実際のバナー広告ユニットIDに差し替え
  rewarded: 'ca-app-pub-3940256099942544/5224354917',  // ← 実際のリワード広告ユニットIDに差し替え
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
