import { NavigationDashboard } from '@/components/NavigationDashboard';
import { LinksRepository } from '@/lib/db';

export const revalidate = 60;

export default async function Home() {
  const allLinks = await LinksRepository.findAll();
  const activeLinks = allLinks.filter(link => link.isActive);

  return <NavigationDashboard initialLinks={activeLinks} />;
}
