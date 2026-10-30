# 髙尾工房

一歩ずつ、つくっていく。つくること、暮らすことを記録する小さな工房のサイトです。

https://takao-kobo.vercel.app/

- **About me**：工房と自分の紹介
- **Works**：個人開発や学習課題で制作したアプリ
- **Blog**：開発で学んだことや日々の記録
- **Contact**：メールでのお問い合わせ

## 使用技術

- Next.js 16（App Router・Cache Components）/ React 19 / TypeScript
- Tailwind CSS v4
- microCMS（Works・Blogのコンテンツ管理）
- Vercel（ホスティング・Web Analytics）
- GitHub Actions（lint・型チェック・ビルドと `develop` への自動マージ）

## 開発環境

Docker Compose（VS CodeのDev Container）で開発します。

1. ルートに `.env.local` を作成し、microCMSの接続情報を設定します。

   ```bash
   MICROCMS_SERVICE_DOMAIN=サービスドメイン
   MICROCMS_API_KEY=APIキー
   ```

2. VS Codeで「Dev Containers: Reopen in Container」を実行するか、`docker compose up` でコンテナを起動します。起動時に `npm ci` と `npm run dev` が実行されます。
3. http://localhost:3000 を開きます。

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run lint` | ESLintでチェック |
| `npm run typecheck` | ルートの型を生成して型チェック |
| `npm run build` | 本番ビルド（microCMSの環境変数が必要） |

## コンテンツ（microCMS）

| エンドポイント | 内容 |
| --- | --- |
| `blogs` | ブログ記事（タイトル・カテゴリ・概要・本文・サムネイル） |
| `works` | 作品（区分・概要・担当範囲・制作の目的・工夫した点・主な機能・使用技術と用途・補足説明・サムネイル・公開URL・GitHub URL・表示順） |

各フィールドの型は `src/types/` にあります。取得結果は分単位でキャッシュされるため、microCMSで公開・更新した内容は少し遅れてサイトに反映されます。

### Works詳細の入力

| フィールドID | 表示名 / 種類 | 入力する内容 |
| --- | --- | --- |
| `role` | 担当範囲 / テキストエリア（任意） | 自分が担当した設計・実装の範囲。イラストなどの制作協力は改行して補足する |
| `background` | 制作の目的 / テキストエリア | 誰のどのような場面を想定し、何を作ろうとしたか |
| `highlights` | 工夫した点 / リッチエディタ（任意） | 見出し3と説明文で、特に伝えたい点を書く。考えた課題・実装した方法・利用時の動きを具体的に書く |
| `features` | 主な機能 / テキストエリア | 1行につき1つの機能 |
| `technologies` | 使用技術 / テキストエリア | 1行目は技術名を ` / ` で区切る。2行目以降は `画面：Vueで操作画面を実装` のように用途と説明を書く。区切りのない補足文も表示できる |
| `description` | 詳細説明 / リッチエディタ | 公開状況、利用上の補足、READMEへの案内など |

冒頭には担当範囲と先頭3件の技術を表示し、本文は「制作の目的 → 工夫した点 → 主な機能 → 使用技術と役割 → 作品の補足」の順に表示します。任意項目が未入力の場合、その項目は表示しません。`role`・`highlights` は任意フィールドとして追加するため、以前のコンテンツも表示できます。

## ブランチ運用とデプロイ

- 作業ブランチ（`feat/`・`fix/` など）から `develop` へ、`automerge` ラベル付きでPRを作成します。GitHub Actionsでlint・型チェック・ビルドが通ると、自動でsquash mergeされます。
- Vercelへのデプロイは `main` だけです。`develop` を `main` へマージすると本番に反映されます。
- 詳しいルールは [AGENTS.md](AGENTS.md) にまとめています。

## アクセス解析（Vercel Web Analytics）

`@vercel/analytics/next` の `Analytics` を `src/app/layout.tsx` に配置しています。
全ページで初回表示とクライアント側のページ遷移を計測します。追加の環境変数は不要です。
ローカル開発時は開発モードになり、本番の集計結果はVercelへのデプロイ後に確認します。

### Vercel管理画面の設定

1. Vercel管理画面で対象プロジェクトの **Analytics** を開き、**Enable** を選択します。
2. 有効化した後、この変更を含むデプロイを通常のリリース手順で行います。
3. 公開サイトにアクセスした後、同じ **Analytics** 画面で訪問者数（Visitors）、ページ閲覧数（Page Views）、よく閲覧されるページ（Pages）、アクセス元（Referrers）を確認します。
4. 画面右上の期間選択やカレンダーで、期間別のアクセス傾向を確認します。

アクセス元はブラウザから送られるリファラー情報がある範囲で取得されます。
直接アクセスや参照元のポリシーなどにより取得できない場合があり、サイト内のページ遷移ごとに新しいアクセス元が記録されるわけではありません。
日時は集計グラフと期間指定で確認し、個々の訪問者の閲覧履歴を表示する管理画面は設けていません。

### 本番デプロイ後の確認

1. ブラウザの開発者ツールでNetworkを開き、本番サイトのトップページにアクセスします。
2. 解析スクリプト（`/_vercel/insights/script.js` またはVercelが割り当てたパス）と、ページビュー送信（`/view` で終わるFetch/XHR）の通信が成功することを確認します。
3. サイト内リンクでAbout・ブログ一覧・記事詳細へ移動し、ページ遷移後にもページビュー送信が発生することを確認します。
4. 少し待ってVercelのAnalytics画面を更新し、訪問者数・ページ閲覧数・Pagesの対象URL・期間別グラフへの反映を確認します。
5. データが表示されない場合は、Web Analyticsの有効化後にデプロイしたか確認し、広告ブロッカーを無効にしたブラウザでも再確認します。

公式資料：
- [導入手順](https://vercel.com/docs/analytics/quickstart)
- [管理画面の使い方・アクセス元・期間指定](https://vercel.com/docs/analytics/using-web-analytics)

## 検索・SNS共有の設定

- 本番URLは `src/lib/metadata.ts` の `siteUrl`（`https://takao-kobo.vercel.app/`）で管理しています。独自ドメインへ移行する場合はここを更新してください。
- 固定ページと記事・作品詳細に固有のタイトル、説明、canonical、Open Graph、Xカードを設定しています。
- 共通の共有画像は `public/og-image.png`（1200×630）。共有URLはキャッシュ更新用に `/og-image.png?v=2` としています。記事・作品詳細はサムネイルがあれば優先して使用します。
- 共有画像の再生成は `node scripts/generate-og-image.mjs`。必要な文字の日本語フォントを取得するため、生成時のみネットワーク接続が必要です。表示・デプロイ時には不要です。
- `/sitemap.xml` に固定ページと全公開記事・作品を掲載します。詳細の更新日時はmicroCMSの `updatedAt` を使用します。CMSの取得結果は分単位でキャッシュされます。
- `/robots.txt` にサイトマップURLを記載しています。ブログ一覧のcanonicalにはページ番号・有効なカテゴリを保持します。記事・作品詳細のcanonicalには一覧への戻り先などのクエリを含めません。サイトマップには固定ページと詳細ページを掲載します。
- 公開後、各ページのHTMLでtitle・description・canonical・OGPタグを確認し、共有画像URLと `/sitemap.xml`・`/robots.txt` が正常に開くことを確認してください。
- ブラウザ用アイコンは `src/app/favicon.ico`（16/32/48px）、Appleホーム画面用は `src/app/apple-icon.png`（180px）です。Next.jsのファイル規約で各ページに自動設定されます。
- 工房ロゴからの再生成は `node scripts/generate-icons.mjs`。追加パッケージや外部フォントは不要です。
