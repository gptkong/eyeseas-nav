// HeroUI Tailwind CSS 插件配置
// 用于 Tailwind CSS v4 的 HeroUI 集成
import { heroui } from "@heroui/react";

export default heroui({
  themes: {
    light: {
      extend: "light",
      colors: {
        primary: {
          DEFAULT: "#0d9488",
          foreground: "#ffffff",
        },
      },
    },
    dark: {
      extend: "dark",
      colors: {
        primary: {
          DEFAULT: "#14b8a6",
          foreground: "#ffffff",
        },
      },
    },
  },
});
