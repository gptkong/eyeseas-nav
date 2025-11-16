// HeroUI Tailwind CSS 插件配置
// 用于 Tailwind CSS v4 的 HeroUI 集成
import { heroui } from "@heroui/react";

export default heroui({
  themes: {
    light: {
      extend: "light",
    },
    dark: {
      extend: "dark",
    },
  },
});
