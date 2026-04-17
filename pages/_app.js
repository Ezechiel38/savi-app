export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #020617; color: #f1f5f9; }
        button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
        input, select, textarea { font-family: inherit; }
        a { color: inherit; text-decoration: none; }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
