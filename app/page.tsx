import { NavigationDashboard } from '@/components/NavigationDashboard';
import { LinksRepository, CategoriesRepository } from '@/lib/db';

export const revalidate = 60;

export default async function Home() {
  // 并行获取链接和分类数据，避免瀑布式请求
  const [allLinks, categories] = await Promise.all([
    LinksRepository.findAll(),
    CategoriesRepository.findAll(),
  ]);
  const activeLinks = allLinks.filter(link => link.isActive);

  return (
    <NavigationDashboard 
      initialLinks={activeLinks} 
      initialCategories={categories}
    />
  );
}
