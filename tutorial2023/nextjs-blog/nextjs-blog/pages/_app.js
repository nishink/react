// _app.js - アプリケーション内のすべてのページをラップする、トップレベルのReactコンポーネント
// ページ間遷移で状態を維持したり、グローバルスタイルを追加したりできる。

import '../styles/globals.css';

export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />;
}