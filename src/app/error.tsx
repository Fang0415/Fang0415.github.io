'use client';

import { useEffect } from 'react';
import Button from '../components/Button';
import FolioIcon from '../components/FolioIcon';

/**
 * Page-level error boundary. Every public page reads from Postgres, so the
 * realistic failure here is "the database is unreachable" — which is worth
 * retrying, hence `reset()` rather than only a link home.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="page-head statuspage">
      <div className="kit-container statuspage__inner">
        <p className="statuspage__code rise">500</p>
        <h1 className="rise rise-2">这一页没能加载出来</h1>
        <p className="statuspage__lead rise rise-2">
          可能是数据服务暂时没响应。先重试一次，如果还是失败，稍后再来。
        </p>
        <div className="statuspage__actions rise rise-3">
          <Button variant="primary" onClick={reset} iconLeft={<FolioIcon name="refresh" className="icon" />}>
            重新加载
          </Button>
          <Button variant="secondary" href="/">回到首页</Button>
        </div>
        {error.digest && <p className="statuspage__digest">错误编号 {error.digest}</p>}
      </div>
    </section>
  );
}
