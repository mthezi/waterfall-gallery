import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { IconButton } from '../ui/IconButton'

interface ZoomableImageProps {
  src: string
  alt: string
  className?: string
}

export const ZoomableImage = ({ src, alt, className = '' }: ZoomableImageProps) => {
  const [scale, setScale] = useState(1)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [showDropdown, setShowDropdown] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = imageRef.current
    if (!element) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const newScale = scale + (e.deltaY > 0 ? -0.1 : 0.1)
      setScale(Math.min(Math.max(0.5, newScale), 3))
    }

    element.addEventListener('wheel', handleWheel, { passive: false })
    return () => element.removeEventListener('wheel', handleWheel)
  }, [scale])

  const handleDoubleClick = () => {
    setScale(1)
    setDragPosition({ x: 0, y: 0 })
  }

  return (
    <div className="relative flex items-center justify-center min-h-[50vh]">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full p-1.5">
        <IconButton
          onClick={() => setScale(Math.max(0.5, scale - 0.1))}
          variant="transparent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </IconButton>
        <div className="relative">
          <button 
            className="px-2 text-white text-sm font-medium select-none hover:bg-white/10 rounded-md transition-colors"
            onClick={() => setScale(1)}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            {Math.round(scale * 100)}%
          </button>
          <div 
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 py-1 transition-all duration-200 bg-black/50 backdrop-blur-sm rounded-lg shadow-lg ${
              showDropdown ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            {[25, 50, 75, 100, 150, 200].map((percentage) => (
              <button
                key={percentage}
                className={`block w-full px-4 py-1 text-sm text-white hover:bg-white/10 text-left whitespace-nowrap transition-colors ${Math.round(scale * 100) === percentage ? 'bg-white/10' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setScale(percentage / 100)
                  setShowDropdown(false)
                }}
              >
                {percentage}%
              </button>
            ))}
          </div>
        </div>
        <IconButton
          onClick={() => setScale(Math.min(3, scale + 0.1))}
          variant="transparent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </IconButton>
        <IconButton
          onClick={() => {
            setScale(1)
            setDragPosition({ x: 0, y: 0 })
          }}
          variant="transparent"
          title="Reset Zoom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M8 16H3v5"></path>
          </svg>
        </IconButton>
      </div>

      <motion.div
        className="relative cursor-move select-none"
        drag
        dragConstraints={{
          left: -1000,
          right: 1000,
          top: -1000,
          bottom: 1000
        }}
        dragElastic={0.1}
        dragMomentum={false}
        animate={{
          scale: scale,
          x: dragPosition.x,
          y: dragPosition.y
        }}
        onDragEnd={(_, info) => {
          setDragPosition({
            x: dragPosition.x + info.offset.x,
            y: dragPosition.y + info.offset.y
          })
        }}
        style={{
          touchAction: "none",
          WebkitUserSelect: "none",
          userSelect: "none"
        }}
        onDoubleClick={handleDoubleClick}
      >
        <div 
          ref={imageRef}
          style={{ touchAction: "none" }}
        >
          <img
            src={src}
            alt={alt}
            className={`max-w-full max-h-[70vh] w-auto h-auto object-contain ${className}`}
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
      </motion.div>
    </div>
  )
} 