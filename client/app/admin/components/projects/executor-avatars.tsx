import Image from "next/image"
import { memo } from "react"
import type { Executor } from "@/app/types/projectTypes"

interface ExecutorAvatarsProps {
  executors: Executor[]
  maxVisible?: number
  className?: string
}

export const ExecutorAvatars = memo(({ executors, maxVisible = 6, className }: ExecutorAvatarsProps) => {
  const visibleExecutors = executors.slice(0, maxVisible)
  const remainingCount = executors.length - maxVisible

  return (
    <div className={`flex items-center -space-x-2 ${className}`}>
      {visibleExecutors.map((executor, index) => (
        <div
          key={executor.id}
          className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden"
          style={{ zIndex: visibleExecutors.length - index }}
          title={executor.name}
        >
          <Image
            src={executor.avatar || "/placeholder.svg?height=32&width=32"}
            alt={executor.name}
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600"
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
})

ExecutorAvatars.displayName = "ExecutorAvatars"
