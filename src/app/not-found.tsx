import type { Metadata } from 'next';
import Button from '../components/Button';
import FolioIcon from '../components/FolioIcon';

export const metadata: Metadata = {
  title: '页面不存在',
  description: '这个地址没有对应的内容。',
};

export default function NotFound() {
  return (
    <section className="page-head statuspage">
      <div className="kit-container statuspage__inner">
        <p className="statuspage__code rise">404</p>
        <h1 className="rise rise-2">这个地址没有内容</h1>
        <p className="statuspage__lead rise rise-2">
          链接可能拼错了，或者这篇内容已经改名、下线。
          下面几个入口都还在。
        </p>
        <div className="statuspage__actions rise rise-3">
          <Button variant="primary" href="/" iconLeft={<FolioIcon name="arrow-left" className="icon" />}>
            回到首页
          </Button>
          <Button variant="secondary" href="/blog/">看文章</Button>
          <Button variant="ghost" href="/projects/">看项目</Button>
        </div>
      </div>
    </section>
  );
}
