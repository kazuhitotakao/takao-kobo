// 検索エンジンにページの内容を伝える構造化データ（JSON-LD）を埋め込む。
// 記事タイトルなどに </script> が含まれても script の外に出ないよう、< をエスケープする
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
