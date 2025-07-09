"use client"

import { memo } from "react"

interface EmployeeAvatarProps {
  name: string
  avatar?: string
  className?: string
}

export const EmployeeAvatar = memo(({ name, avatar, className = "w-10 h-10" }: EmployeeAvatarProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getBackgroundColor = (name: string) => {
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-gray-500",
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  if (avatar) {
    return <img src={avatar || "/placeholder.svg"} alt={name} className={`${className} rounded-full object-cover`} />
  }

  return (
    <div
      className={`${className} ${getBackgroundColor(name)} rounded-full flex items-center justify-center text-white font-medium text-sm`}
    >
      {getInitials(name)}
    </div>
  )
})

EmployeeAvatar.displayName = "EmployeeAvatar"
