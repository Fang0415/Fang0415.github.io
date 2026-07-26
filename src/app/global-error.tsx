'use client';

import { useEffect } from 'react';
import './globals.css';

/**
 * Last-resort boundary: it replaces the root layout, so it has to ship its own
 * <html>/<body> and cannot use Navbar/Footer (they would need the layout's data
 * fetch, which is exactly what may have failed).
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body>
        <main style={{ paddingTop: 0 }}>
          <section className="page-head statuspage">
            <div className="kit-container statuspage__inner">
              <p className="statuspage__code">出错了</p>
              <h1>站点没能启动这一页</h1>
              <p className="statuspage__lead">
                这是一个比较底层的错误，通常意味着服务本身出了问题。刷新一次试试。
              </p>
              <div className="statuspage__actions">
                <button className="folio-btn folio-btn--primary folio-btn--md" type="button" onClick={reset}>
                  <span>重新加载</span>
                </button>
                <a className="folio-btn folio-btn--secondary folio-btn--md" href="/">
                  <span>回到首页</span>
                </a>
              </div>
              {error.digest && <p className="statuspage__digest">错误编号 {error.digest}</p>}
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
