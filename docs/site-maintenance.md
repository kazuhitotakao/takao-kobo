# サイトの保守ガイド

普段の作品・ブログ更新は [コンテンツ更新ガイド](content-guide.md)、開発環境の起動は [README](../README.md#手元で動かすには) を参照してください。ここでは、公開設定や画像などを変更するときの確認先をまとめます。

## 公開と自動チェック

- 開発環境とGitHub ActionsはNode.js 24を使います。
- GitHub Actionsで、コードの書き方・型・公開用ビルドをチェックします。ビルドには `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` のGitHub Secretsが必要です。
- `develop` 向けPRの自動マージには、`automerge` ラベルとリポジトリ変数 `ENABLE_AUTO_MERGE=true` が必要です。同じリポジトリの `kazuhitotakao` が作成した、DraftではないPRが対象です。
- VercelへのGit連携デプロイは `main` のみ有効です。`develop` に統合した変更は、`main` へのPRをマージして本番へ反映します。
- microCMSのサービスを変更するときは、接続情報に加え、`next.config.ts` の画像取得先も確認してください。

設定ファイル：[CI](../.github/workflows/ci.yml) / [Vercel](../vercel.json) / [Next.js](../next.config.ts)

## アクセス傾向の確認

Vercel Web Analyticsを [src/app/layout.tsx](../src/app/layout.tsx) に配置しています。ページの閲覧状況はVercel側のAnalyticsで確認します。サイト内に解析用の管理画面は設けていません。

導入時は、Vercel側でWeb Analyticsを有効にしてからデプロイします。この実装のために追加する環境変数はありません。ローカル開発時の表示だけで、本番の集計への反映を判断しないでください。

本番公開後は、トップページからいくつかのページへ移動し、Vercel側で閲覧データの反映を確認します。データが出ない場合は、有効化後にデプロイしたか、広告ブロッカーなどが通信を止めていないかを確認します。

アクセス元はブラウザが送る情報に左右されます。直接アクセスなどでは取得できない場合もあるため、サイトを見つけてもらった経路の参考として使います。

設定・確認方法の詳細：[導入手順](https://vercel.com/docs/analytics/quickstart) / [Analyticsの使い方](https://vercel.com/docs/analytics/using-web-analytics)

## 検索・SNS共有

タイトルや説明、共有画像などの共通設定は [src/lib/metadata.ts](../src/lib/metadata.ts) にあります。現在の本番URLは `https://takao-kobo.vercel.app/` です。独自ドメインへ移行する場合は、このファイルの `siteUrl` を更新してください。

固定ページと作品・記事の詳細には、それぞれタイトル、説明、正規URL（canonical）、SNS共有用の情報を設定しています。ブログ一覧の正規URLにはページ番号・有効なカテゴリを残し、詳細ページには一覧への戻り先などの情報を含めません。

### 共有画像とアイコン

| ファイル | 用途 |
| --- | --- |
| `public/og-image.png` | 共通のSNS共有画像（1200×630px）。作品・記事にサムネイルがあれば、そちらを優先 |
| `src/app/favicon.ico` | ブラウザ用アイコン（16 / 32 / 48px） |
| `src/app/apple-icon.png` | Appleホーム画面用アイコン（180px） |

共通共有画像のURLには、キャッシュ更新用の `?v=2` を付けています。画像を差し替えた場合は、必要に応じてこの値も更新します。

再生成する場合は、リポジトリのルートで実行してください。

```bash
node scripts/generate-og-image.mjs
node scripts/generate-icons.mjs
```

共有画像の再生成時のみ、日本語フォントの取得にネットワーク接続が必要です。アイコンの生成には追加パッケージや外部フォントは不要です。

### サイトマップ

`/sitemap.xml` には固定ページと、公開している全作品・記事を掲載します。詳細ページの更新日時にはmicroCMSの `updatedAt` を使います。`/robots.txt` にはサイトマップのURLを記載しています。CMSの内容はキャッシュ更新後に反映されます。

実装：[サイトマップ](../src/app/sitemap.ts) / [robots.txt](../src/app/robots.ts)

公開後は、ページのタイトル・説明・共有画像に加え、`/sitemap.xml` と `/robots.txt` が開けることを確認してください。
