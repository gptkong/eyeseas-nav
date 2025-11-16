/**
 * HeroUI 样式验证测试组件
 */

"use client";

import { Tabs, Tab, Button } from "@heroui/react";

export function HeroUITest() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">HeroUI 样式验证测试</h1>

      {/* 测试 1: 基础 Tabs 组件 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">1. Tabs 组件测试</h2>
        <Tabs aria-label="测试标签">
          <Tab key="tab1" title="标签一">
            <div className="p-4">
              <p>这是标签一的内容</p>
            </div>
          </Tab>
          <Tab key="tab2" title="标签二">
            <div className="p-4">
              <p>这是标签二的内容</p>
            </div>
          </Tab>
          <Tab key="tab3" title="标签三">
            <div className="p-4">
              <p>这是标签三的内容</p>
            </div>
          </Tab>
        </Tabs>
      </div>

      {/* 测试 2: Button 组件 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">2. Button 组件测试</h2>
        <div className="flex gap-4">
          <Button color="primary">Primary</Button>
          <Button color="secondary">Secondary</Button>
          <Button color="success">Success</Button>
          <Button color="warning">Warning</Button>
          <Button color="danger">Danger</Button>
        </div>
      </div>

      {/* 测试 3: 不同变体 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">3. Button 变体测试</h2>
        <div className="flex flex-wrap gap-4">
          <Button color="primary" variant="solid">Solid</Button>
          <Button color="primary" variant="bordered">Bordered</Button>
          <Button color="primary" variant="light">Light</Button>
          <Button color="primary" variant="flat">Flat</Button>
          <Button color="primary" variant="ghost">Ghost</Button>
          <Button color="primary" variant="shadow">Shadow</Button>
        </div>
      </div>

      {/* 测试 4: 深色模式切换 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">4. 主题测试</h2>
        <div className="space-y-2">
          <p className="text-foreground">前景色测试文本</p>
          <p className="text-primary">主色调测试文本</p>
          <p className="bg-primary text-primary-foreground px-4 py-2 rounded">
            背景色测试
          </p>
        </div>
      </div>
    </div>
  );
}
