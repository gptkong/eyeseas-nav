"use client";

import { motion } from "framer-motion";
import { Link, Globe, Building, Activity, TrendingUp } from "lucide-react";
import { DashboardStats } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatsPanelProps {
  stats?: DashboardStats;
  isLoading?: boolean;
}

export function StatsPanel({ stats, isLoading }: StatsPanelProps) {
  const statsData = [
    {
      label: "总链接数",
      value: stats?.totalLinks || 0,
      icon: Link,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "内网链接",
      value: stats?.internalLinks || 0,
      icon: Building,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      label: "外网链接",
      value: stats?.externalLinks || 0,
      icon: Globe,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "激活状态",
      value: stats?.activeLinks || 0,
      icon: Activity,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50 dark:bg-pink-950/30",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Background Gradient */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                stat.color
              )}
            />

            <div className="relative p-4 sm:p-5">
              {/* Icon */}
              <div className="flex items-center justify-between mb-3">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    stat.bgColor
                  )}
                >
                  <Icon className={cn("w-6 h-6", stat.iconColor)} />
                </motion.div>
                <TrendingUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Value */}
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  delay: index * 0.1 + 0.2,
                }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1"
              >
                {stat.value}
              </motion.div>

              {/* Label */}
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>

            {/* Bottom Shine */}
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                stat.color
              )}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

