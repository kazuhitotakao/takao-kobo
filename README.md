This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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
