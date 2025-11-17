/**
 * SWR 配置文件
 *
 * 为整个应用提供统一的 SWR 配置：
 * - 缓存策略
 * - 错误处理
 * - 性能优化
 */

"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SWRConfigProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60000, // 1分钟内去重
        errorRetryCount: 3,
        onError: (error) => {
          console.error("SWR Error:", error);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}