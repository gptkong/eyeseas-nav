/**
 * CategoryIcon 组件
 *
 * 统一的分类图标渲染组件，支持：
 * - Emoji 图标
 * - Lucide 图标（支持所有 Lucide 图标）
 */

"use client";

import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryIconType } from "@/lib/types";

interface CategoryIconProps {
  icon?: string;
  iconType?: CategoryIconType;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallback?: string;
}

const sizeMap = {
  sm: { lucide: 14, emoji: "text-sm" },
  md: { lucide: 18, emoji: "text-lg" },
  lg: { lucide: 22, emoji: "text-xl" },
  xl: { lucide: 28, emoji: "text-2xl" },
};

export function CategoryIcon({
  icon,
  iconType = "emoji",
  size = "md",
  className,
  fallback = "📁",
}: CategoryIconProps) {
  const sizeConfig = sizeMap[size];

  // 无图标时显示默认
  if (!icon) {
    return (
      <span className={cn(sizeConfig.emoji, "flex-shrink-0", className)}>
        {fallback}
      </span>
    );
  }

  // Lucide 图标
  if (iconType === "lucide") {
    // 尝试从 LucideIcons 中获取图标组件（支持 PascalCase 格式）
    const IconComponent = LucideIcons[icon as keyof typeof LucideIcons];

    // 如果找不到图标，回退到默认图标
    // 注意：React 组件可能是 function 或 object（forwardRef）
    if (!IconComponent) {
      return (
        <span className={cn(sizeConfig.emoji, "flex-shrink-0", className)}>
          {fallback}
        </span>
      );
    }

    // 类型断言为 React 组件
    const Icon = IconComponent as React.ComponentType<{ size?: number; className?: string }>;

    return (
      <Icon
        size={sizeConfig.lucide}
        className={cn("flex-shrink-0", className)}
      />
    );
  }

  // Emoji 图标
  return (
    <span className={cn(sizeConfig.emoji, "flex-shrink-0", className)}>
      {icon}
    </span>
  );
}

// 导出常用图标列表，供 IconPicker 使用
export const SUGGESTED_LUCIDE_ICONS = [
  // 文件/文档
  "Folder",
  "FolderOpen",
  "File",
  "FileText",
  "Files",
  "Archive",
  "BookOpen",
  "Book",
  "Notebook",
  // 工作/办公
  "Briefcase",
  "Building",
  "Building2",
  "Calendar",
  "Clock",
  "Mail",
  "Inbox",
  "Send",
  // 技术/开发
  "Code",
  "Code2",
  "Terminal",
  "Database",
  "Server",
  "Cloud",
  "Cpu",
  "HardDrive",
  "Monitor",
  "Smartphone",
  // 学习/教育
  "GraduationCap",
  "Lightbulb",
  "Brain",
  "FlaskConical",
  "Atom",
  "Calculator",
  // 媒体/娱乐
  "Music",
  "Film",
  "Image",
  "Camera",
  "Gamepad2",
  "Headphones",
  "Radio",
  "Tv",
  // 工具/设置
  "Settings",
  "Wrench",
  "Hammer",
  "Palette",
  "Paintbrush",
  "Pencil",
  "Scissors",
  // 社交/通讯
  "MessageCircle",
  "MessageSquare",
  "Users",
  "User",
  "Heart",
  "Star",
  "ThumbsUp",
  // 导航/位置
  "Home",
  "MapPin",
  "Navigation",
  "Compass",
  "Globe",
  "Map",
  // 其他常用
  "Search",
  "Link",
  "Bookmark",
  "Tag",
  "Flag",
  "Award",
  "Trophy",
  "Zap",
  "Rocket",
  "Target",
  "Shield",
  "Lock",
  "Key",
  "Eye",
  "Bell",
  "Gift",
  "ShoppingCart",
  "CreditCard",
  "Wallet",
  "DollarSign",
  "TrendingUp",
  "BarChart",
  "PieChart",
  "Activity",
];

export const SUGGESTED_EMOJIS: Record<string, string[]> = {
  常用: ["📁", "📂", "📚", "💼", "🏠", "⭐", "❤️", "🔥", "✨", "💎"],
  工作: ["💻", "📊", "📈", "📝", "📋", "🗂️", "📎", "✉️", "📧", "🖥️"],
  学习: ["📖", "🎓", "💡", "🧠", "✏️", "📐", "🔬", "🧪", "📏", "🎯"],
  娱乐: ["🎮", "🎬", "🎵", "🎨", "📷", "🎧", "🎭", "🎪", "🎲", "🎳"],
  生活: ["🍕", "☕", "🏃", "🚗", "✈️", "🏖️", "🎉", "🎁", "🏡", "🛒"],
  工具: ["🔧", "⚙️", "🔨", "🔍", "🔐", "📌", "🏷️", "📦", "🗃️", "🔑"],
  自然: ["🌸", "🌿", "🌙", "☀️", "🌈", "⛰️", "🌊", "🔮", "💫", "🍀"],
  动物: ["🐱", "🐶", "🦊", "🐻", "🐼", "🦁", "🐯", "🦄", "🐬", "🦋"],
};

