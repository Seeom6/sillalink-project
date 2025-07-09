import Image from "next/image"
import { memo } from "react"

interface ProjectPhotoProps {
  src: string
  alt: string
  className?: string
}

export const ProjectPhoto = memo(({ src, alt, className }: ProjectPhotoProps) => {
  return (
    <div className={`relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 ${className}`}>
      <Image src={src || "/placeholder.svg?height=48&width=64"} alt={alt} fill className="object-cover" sizes="64px" />
    </div>
  )
})

ProjectPhoto.displayName = "ProjectPhoto"
