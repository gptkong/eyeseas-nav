# EyeSeas Navigation 设计指南

## 🎨 设计系统

### 色彩系统

#### 主题色
我们使用三色渐变作为品牌主色调：

```css
/* 主渐变 */
from-indigo-500 via-purple-500 to-pink-500

/* Indigo (靛蓝) */
Light: #6366f1
Dark: #4f46e5

/* Purple (紫色) */
Light: #8b5cf6
Dark: #7c3aed

/* Pink (粉色) */
Light: #ec4899
Dark: #db2777
```

#### 功能色

```css
/* 成功/外网 */
Green: #10b981

/* 信息/内网 */
Blue: #3b82f6

/* 警告 */
Amber: #f59e0b

/* 错误 */
Red: #ef4444
```

#### 中性色

```css
/* 浅色模式 */
Background: #ffffff
Foreground: #0f172a
Muted: #f8fafc

/* 深色模式 */
Background: #0f172a
Foreground: #f8fafc
Muted: #1e293b
```

### 排版系统

#### 字体家族
```css
/* 无衬线字体 (正文) */
font-family: 'Geist Sans', system-ui, sans-serif;

/* 等宽字体 (代码/URL) */
font-family: 'Geist Mono', 'Courier New', monospace;
```

#### 字体大小
```css
text-xs: 0.75rem    /* 12px */
text-sm: 0.875rem   /* 14px */
text-base: 1rem     /* 16px */
text-lg: 1.125rem   /* 18px */
text-xl: 1.25rem    /* 20px */
text-2xl: 1.5rem    /* 24px */
text-3xl: 1.875rem  /* 30px */
text-4xl: 2.25rem   /* 36px */
```

#### 字重
```css
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700
```

### 间距系统

```css
0: 0px
1: 0.25rem   /* 4px */
2: 0.5rem    /* 8px */
3: 0.75rem   /* 12px */
4: 1rem      /* 16px */
5: 1.25rem   /* 20px */
6: 1.5rem    /* 24px */
8: 2rem      /* 32px */
10: 2.5rem   /* 40px */
12: 3rem     /* 48px */
16: 4rem     /* 64px */
20: 5rem     /* 80px */
```

### 圆角系统

```css
rounded-md: 0.375rem    /* 6px */
rounded-lg: 0.5rem      /* 8px */
rounded-xl: 0.75rem     /* 12px */
rounded-2xl: 1rem       /* 16px */
rounded-3xl: 1.5rem     /* 24px */
```

### 阴影系统

```css
/* Light Mode */
shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
shadow: 0 1px 3px rgba(0,0,0,0.1)
shadow-md: 0 4px 6px rgba(0,0,0,0.1)
shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
shadow-xl: 0 20px 25px rgba(0,0,0,0.1)
shadow-2xl: 0 25px 50px rgba(0,0,0,0.25)

/* Dark Mode */
适当降低不透明度，增强对比度
```

## 🎭 组件设计规范

### 按钮 (Button)

#### 主要按钮
```tsx
<button className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium shadow-lg transition-all duration-200">
  Primary Button
</button>
```

#### 次要按钮
```tsx
<button className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors duration-200">
  Secondary Button
</button>
```

#### 危险按钮
```tsx
<button className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors duration-200">
  Danger Button
</button>
```

### 卡片 (Card)

#### 基础卡片
```tsx
<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
  Card Content
</div>
```

#### 交互式卡片
```tsx
<motion.div
  whileHover={{ y: -8 }}
  className="group cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 p-6"
>
  Interactive Card
</motion.div>
```

### 输入框 (Input)

```tsx
<input
  type="text"
  className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200 outline-none"
  placeholder="Enter text..."
/>
```

### 搜索框 (Search)

```tsx
<div className="relative max-w-2xl mx-auto">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
  <input
    type="search"
    className="w-full h-16 pl-14 pr-32 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-indigo-500 text-lg font-medium text-gray-900 dark:text-white placeholder-gray-400 outline-none"
    placeholder="搜索..."
  />
</div>
```

## 🎬 动画规范

### 进入动画

#### 淡入 + 上移
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

#### 缩放进入
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

#### 延迟进入（列表项）
```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
  >
    {item}
  </motion.div>
))}
```

### 悬停动画

#### 上浮
```tsx
<motion.div whileHover={{ y: -8 }}>
  Hover me
</motion.div>
```

#### 缩放
```tsx
<motion.div whileHover={{ scale: 1.05 }}>
  Hover me
</motion.div>
```

#### 旋转
```tsx
<motion.div whileHover={{ rotate: 10 }}>
  Hover me
</motion.div>
```

### 点击动画

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

### 加载动画

#### 旋转
```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{
    duration: 1,
    repeat: Infinity,
    ease: "linear"
  }}
  className="w-8 h-8 border-2 border-gray-300 border-t-indigo-600 rounded-full"
/>
```

#### 脉冲
```tsx
<motion.div
  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
>
  Pulsing
</motion.div>
```

## 🖼️ 特效系统

### 玻璃态效果 (Glassmorphism)

```css
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.dark .glass {
  background: rgba(17, 24, 39, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 渐变文字

```css
.gradient-text {
  background: linear-gradient(to right, #6366f1, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 光泽扫过效果 (Shine Effect)

```tsx
<motion.div
  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
  initial={{ x: "-100%" }}
  animate={{ x: "100%" }}
  transition={{ duration: 0.8, ease: "easeInOut" }}
/>
```

### 浮动动画 (Float)

```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

### 渐变底部指示条

```tsx
<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
```

## 📐 布局规范

### 网格系统

```tsx
/* 响应式网格 */
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
  {items}
</div>
```

### 容器 (Container)

```tsx
<div className="container mx-auto px-4 py-8 sm:py-12">
  Content
</div>
```

### Flexbox 布局

```tsx
/* 水平居中 */
<div className="flex items-center justify-center">
  Content
</div>

/* 两端对齐 */
<div className="flex items-center justify-between">
  <div>Left</div>
  <div>Right</div>
</div>

/* 垂直堆叠 */
<div className="flex flex-col space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

## 🌓 深色模式

### 实现方式
使用 `dark:` 前缀和 Context API

```tsx
/* 背景色 */
bg-white dark:bg-gray-900

/* 文字色 */
text-gray-900 dark:text-white

/* 边框色 */
border-gray-200 dark:border-gray-700
```

### 色彩对比
确保深色模式下的对比度足够：
- 文字对比度 ≥ 4.5:1
- 大文字对比度 ≥ 3:1
- 交互元素对比度 ≥ 3:1

## ♿ 无障碍指南

### 语义化 HTML
```tsx
<nav>导航</nav>
<main>主要内容</main>
<aside>侧边栏</aside>
<footer>页脚</footer>
```

### ARIA 属性
```tsx
<button aria-label="关闭对话框" />
<input aria-describedby="error-message" />
<div role="alert" aria-live="polite">通知消息</div>
```

### 键盘导航
- Tab: 移动焦点
- Enter/Space: 激活按钮
- Esc: 关闭对话框
- ⌘K/Ctrl+K: 打开搜索

### 焦点状态
```css
focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
```

## 📱 响应式设计

### 断点使用

```tsx
/* 手机 */
className="text-sm sm:text-base"

/* 平板 */
className="grid-cols-1 lg:grid-cols-2"

/* 桌面 */
className="hidden xl:block"
```

### 触摸目标
最小点击区域：44x44px

```css
min-h-[44px] min-w-[44px]
```

## 🎯 性能优化

### GPU 加速
```css
transform-gpu will-change-transform
```

### 图片优化
```tsx
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
/>
```

### 动画性能
优先使用 `transform` 和 `opacity`：
```css
/* 好 ✓ */
transform: translateY(-8px);
opacity: 0.5;

/* 避免 ✗ */
margin-top: -8px;
visibility: hidden;
```

## 📚 资源链接

- [Tailwind CSS 文档](https://tailwindcss.com)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev)
- [HeroUI 文档](https://heroui.com)
- [Next.js 文档](https://nextjs.org)

---

**保持设计的一致性和简洁性，让用户专注于内容本身。**

