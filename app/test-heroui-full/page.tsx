import HeroUIComprehensiveTest from "@/components/HeroUIComprehensiveTest";

export const metadata = {
  title: "HeroUI 全组件测试",
  description: "用于验证 HeroUI 配置是否正确加载的测试页面",
};

export default function HeroUIComprehensiveTestPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroUIComprehensiveTest />
    </main>
  );
}
