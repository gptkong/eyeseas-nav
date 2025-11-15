import { NavigationDashboard } from '@/components/NavigationDashboard';
import { DatabaseService } from '@/lib/db';

// 启用 ISR（增量静态再生）- 每60秒重新验证
export const revalidate = 60;

export default async function Home() {
  // 服务端直接查询 Redis 获取数据
  const allLinks = await DatabaseService.getAllLinks();
  // 只传递激活的链接给客户端
  const activeLinks = allLinks.filter(link => link.isActive);

  return <NavigationDashboard initialLinks={activeLinks} />;
}
