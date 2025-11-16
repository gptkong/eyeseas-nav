# CategoryTabs 组件使用指南

## 概述

`CategoryTabs` 是一个基于 HeroUI Tabs 组件构建的高级分类切换组件，支持多种样式、响应式设计和丰富的交互功能。

## 基础用法

```tsx
import { CategoryTabs } from "@/components/CategoryTabs";
import { useState } from "react";

export default function Example() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { id: "1", name: "AI", icon: "🤖", color: "blue" },
    { id: "2", name: "开发", icon: "💻", color: "green" },
    { id: "3", name: "设计", icon: "🎨", color: "purple" },
  ];

  return (
    <CategoryTabs
      categories={categories}
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
      onAddCategory={() => console.log("添加分类")}
    />
  );
}
```

## 高级配置

### 1. 不同密度模式

```tsx
// 紧凑模式
<CategoryTabs
  categories={categories}
  density="compact"
  // tab 高度: 32px, 字体: 14px
/>

// 默认模式
<CategoryTabs
  categories={categories}
  density="default"
  // tab 高度: 40px, 字体: 14px
/>

// 宽松模式
<CategoryTabs
  categories={categories}
  density="spacious"
  // tab 高度: 48px, 字体: 16px
/>
```

### 2. 垂直布局

```tsx
<CategoryTabs
  categories={categories}
  orientation="vertical"
  onCategoryChange={setActiveCategory}
/>
```

### 3. 完整示例（带分类管理）

```tsx
import { CategoryTabs } from "@/components/CategoryTabs";
import { useCategories } from "@/lib/hooks/useCategories";
import { useAuth } from "@/lib/hooks/useAuth";

export default function NavigationPage() {
  const { categories } = useCategories();
  const { isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleAddCategory = () => {
    // 打开添加分类模态框
    openCategoryModal();
  };

  return (
    <div className="container mx-auto p-6">
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onAddCategory={isAuthenticated ? handleAddCategory : undefined}
        density="default"
        className="mb-6"
      />

      {/* 分类内容展示区域 */}
      <div className="mt-8">
        {/* 根据 activeCategory 渲染不同内容 */}
      </div>
    </div>
  );
}
```

### 4. 带搜索和过滤的复杂场景

```tsx
export default function AdvancedExample() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { categories, isLoading } = useCategories();

  // 过滤分类
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <input
        type="text"
        placeholder="搜索分类..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />

      {/* 分类标签 */}
      <CategoryTabs
        categories={filteredCategories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onAddCategory={() => {}}
        density="compact"
        className="overflow-x-auto"
      />

      {/* 加载状态 */}
      {isLoading && (
        <div className="text-center py-8">
          加载中...
        </div>
      )}
    </div>
  );
}
```

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `categories` | `Category[]` | - | 分类列表 |
| `activeCategory` | `string \| null` | - | 当前激活的分类 ID，null 表示"全部" |
| `onCategoryChange` | `(categoryId: string \| null) => void` | - | 分类切换回调 |
| `onAddCategory` | `() => void` | `undefined` | 添加分类按钮点击回调（管理员） |
| `onAddCategoryClick` | `() => void` | `undefined` | `onAddCategory` 的别名，保持向后兼容 |
| `className` | `string` | `undefined` | 自定义样式类 |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | 布局方向 |
| `density` | `"compact" \| "default" \| "spacious"` | `"default"` | 密度模式，影响尺寸和间距 |

## HeroUI Tabs 特性

### 1. tabRef 支持

```tsx
import { useRef } from "react";

function Example() {
  const categoryTabsRef = useRef<HTMLUListElement>(null);

  const focusFirstTab = () => {
    categoryTabsRef.current?.focus();
  };

  return (
    <CategoryTabs
      ref={categoryTabsRef}
      categories={categories}
      // ... 其他属性
    />
  );
}
```

### 2. 可访问性

- ✅ ARIA 标签支持
- ✅ 键盘导航
- ✅ 屏幕阅读器友好
- ✅ Focus 管理

### 3. 样式自定义

可以通过 `classNames` 属性自定义样式：

```tsx
<CategoryTabs
  categories={categories}
  classNames={{
    tabList: "custom-tab-list-class",
    cursor: "custom-cursor-class",
    tab: "custom-tab-class",
  }}
/>
```

## 动画效果

组件内置了以下动画：

1. **Tab 悬停缩放**: `data-[hover=true]:scale-105`
2. **图标旋转**: 悬停时旋转 90 度
3. **按钮交互**: 按压和释放反馈
4. **颜色过渡**: 平滑的颜色变化
5. **辅助信息**: 淡入动画

## 响应式设计

- ✅ 移动端友好
- ✅ 滚动支持（当标签过多时）
- ✅ 自适应文本截断
- ✅ 触摸友好

## 颜色系统

每个分类可以有一个颜色值，支持以下预设：

- `blue` - 蓝色 (#3b82f6)
- `green` - 绿色 (#10b981)
- `purple` - 紫色 (#8b5cf6)
- `pink` - 粉色 (#ec4899)
- `orange` - 橙色 (#f59e0b)
- `indigo` - 靛蓝 (#6366f1)
- `red` - 红色 (#ef4444)
- `yellow` - 黄色 (#eab308)

## 最佳实践

### 1. 性能优化

```tsx
// 使用 React.memo 优化渲染
const CategoryTabs = React.memo(({ categories, ...props }) => {
  // 组件实现
});

// 避免不必要的重渲染
const memoizedCategories = useMemo(
  () => categories.filter(/* 过滤逻辑 */),
  [categories]
);
```

### 2. 状态管理

```tsx
// 使用 useReducer 管理复杂状态
function categoryReducer(state, action) {
  switch (action.type) {
    case "SET_ACTIVE":
      return { ...state, activeCategory: action.payload };
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] };
    default:
      return state;
  }
}
```

### 3. 可访问性

```tsx
// 确保足够的对比度
<div className="bg-white dark:bg-gray-900">
  <CategoryTabs
    categories={categories}
    // 组件自动处理对比度
  />
</div>
```

## 故障排除

### 问题：标签不显示

**解决方案**: 确保 `categories` 数组格式正确：

```tsx
const categories = [
  {
    id: "1",        // 必需：唯一标识符
    name: "AI",     // 必需：显示名称
    icon: "🤖",     // 可选：图标
    color: "blue",  // 可选：颜色
  },
];
```

### 问题：添加按钮不显示

**解决方案**: 确保传递了 `onAddCategory` 或 `onAddCategoryClick`：

```tsx
<CategoryTabs
  categories={categories}
  onAddCategory={() => console.log("点击了添加按钮")}  // 确保传递了这个属性
/>
```

### 问题：样式不生效

**解决方案**: 确保已安装 HeroUI：

```bash
npm install @heroui/react
# 或
npx heroui-cli@latest add tabs
```

## 更新日志

### v2.0.0
- ✨ 添加 tabRef 支持
- ✨ 新增密度控制（compact/default/spacious）
- ✨ 支持垂直布局
- ✨ 改进动画效果
- ✨ 添加颜色指示器
- ✨ 优化可访问性
- ✨ 响应式设计增强

### v1.0.0
- 🎉 初始版本
- 基础 Tab 功能
- 分类切换
- 添加分类按钮
