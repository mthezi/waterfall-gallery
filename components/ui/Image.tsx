import { useState } from 'react'
import { motion } from 'framer-motion'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  className?: string
  aspectRatio?: number
}

export const Image = ({ 
  src, 
  alt, 
  className = '',
  aspectRatio,
  ...props 
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true)

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl" />
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className={`transition-opacity duration-300 ${className}`}
          style={aspectRatio ? { aspectRatio } : undefined}
          loading="lazy"
          decoding="async"
          fetchPriority="high"
          draggable="false"
          onLoad={() => setIsLoading(false)}
          onDragStart={handleDragStart}
          {...props}
        />
      </motion.div>
    </div>
  )
} 