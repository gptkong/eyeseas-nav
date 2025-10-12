"use client";

import { useNetworkMode } from "@/lib/contexts/NetworkModeContext";
import { Globe, Building } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NetworkModeToggleProps {
  className?: string;
}

export function NetworkModeToggle({ className }: NetworkModeToggleProps) {
  const { networkMode, toggleNetworkMode } = useNetworkMode();

  const isInternal = networkMode === "internal";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleNetworkMode}
      className={cn(
        "relative px-4 py-2 rounded-xl",
        "bg-gray-100 dark:bg-gray-800",
        "hover:bg-gray-200 dark:hover:bg-gray-700",
        "border border-gray-200 dark:border-gray-700",
        "transition-colors duration-200",
        "flex items-center gap-2",
        className
      )}
      title={`切换到${isInternal ? "外网" : "内网"}模式`}
    >
      {/* Icon Container */}
      <motion.div
        className="relative w-5 h-5"
        animate={{ rotate: isInternal ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {isInternal ? (
          <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        ) : (
          <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
        )}
      </motion.div>

      {/* Label */}
      <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
        {isInternal ? "内网" : "外网"}
      </span>

      {/* Indicator */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-colors duration-200",
          isInternal
            ? "bg-blue-500"
            : "bg-green-500"
        )}
      />
    </motion.button>
  );
}
