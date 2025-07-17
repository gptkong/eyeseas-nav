'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ThemeToggle({
  variant = 'ghost',
  size = 'icon',
  className = ''
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 防止服务端渲染不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // 服务端渲染时显示默认图标
    return (
      <Button
        variant={variant}
        size={size}
        className={`transition-all duration-200 ${className}`}
        disabled
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`transition-all duration-200 ${className}`}
      aria-label={theme === 'light' ? '切换到深色主题' : '切换到明亮主题'}
      title={theme === 'light' ? '切换到深色主题' : '切换到明亮主题'}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}

// 带文字的主题切换组件
export function ThemeToggleWithText({
  variant = 'ghost',
  size = 'default',
  className = ''
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`transition-all duration-200 gap-2 ${className}`}
        disabled
      >
        <Sun className="h-4 w-4" />
        明亮主题
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`transition-all duration-200 gap-2 ${className}`}
      aria-label={theme === 'light' ? '切换到深色主题' : '切换到明亮主题'}
    >
      {theme === 'light' ? (
        <>
          <Moon className="h-4 w-4" />
          深色主题
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" />
          明亮主题
        </>
      )}
    </Button>
  );
}

// 下拉菜单样式的主题选择器
export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">主题:</span>
        <div className="flex rounded-md border">
          <Button
            variant="default"
            size="sm"
            className="rounded-r-none border-r"
            disabled
          >
            <Sun className="h-3 w-3 mr-1" />
            明亮
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-l-none"
            disabled
          >
            <Moon className="h-3 w-3 mr-1" />
            深色
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">主题:</span>
      <div className="flex rounded-md border">
        <Button
          variant={theme === 'light' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTheme('light')}
          className="rounded-r-none border-r"
        >
          <Sun className="h-3 w-3 mr-1" />
          明亮
        </Button>
        <Button
          variant={theme === 'dark' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTheme('dark')}
          className="rounded-l-none"
        >
          <Moon className="h-3 w-3 mr-1" />
          深色
        </Button>
      </div>
    </div>
  );
}
