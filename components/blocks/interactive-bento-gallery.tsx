"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface MediaItemType {
  id: number
  title: string
  desc: string
  url: string
}

const MediaItem = ({ item, className, onClick }: { item: MediaItemType; className?: string; onClick?: (e: React.MouseEvent<HTMLImageElement>) => void }) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl" />
      )}
      <img
        src={item.url || "/placeholder.svg"}
        alt={item.title}
        className={`${className} object-cover cursor-pointer transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onClick={onClick}
        loading="lazy"
        decoding="async"
        fetchPriority="high"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}

interface GalleryModalProps {
  selectedItem: MediaItemType
  isOpen: boolean
  onClose: () => void
  setSelectedItem: (item: MediaItemType | null) => void
  mediaItems: MediaItemType[]
}

const GalleryModal = ({ selectedItem, isOpen, onClose, setSelectedItem, mediaItems }: GalleryModalProps) => {
  const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 })
  const VISIBLE_COUNT = 5
  const MIDDLE_INDEX = Math.floor(VISIBLE_COUNT / 2)


  // 计算可见范围，使选中项尽可能在中间
  const calculateVisibleRange = (selectedIndex: number) => {
    let start = selectedIndex - MIDDLE_INDEX
    let end = start + VISIBLE_COUNT

    // 处理边界情况
    if (start < 0) {
      start = 0
      end = Math.min(VISIBLE_COUNT, mediaItems.length)
    } else if (end > mediaItems.length) {
      end = mediaItems.length
      start = Math.max(0, end - VISIBLE_COUNT)
    }

    return { start, end }
  }

  const [visibleRange, setVisibleRange] = useState(() => {
    const selectedIndex = mediaItems.findIndex(item => item.id === selectedItem.id)
    return calculateVisibleRange(selectedIndex)
  })
  
  useEffect(() => {
    const selectedIndex = mediaItems.findIndex(item => item.id === selectedItem.id)
    setVisibleRange(calculateVisibleRange(selectedIndex))
  }, [selectedItem.id, mediaItems])

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    const selectedIndex = mediaItems.findIndex(item => item.id === selectedItem.id)
    const prevIndex = Math.max(0, selectedIndex - 1)
    setSelectedItem(mediaItems[prevIndex])
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    const selectedIndex = mediaItems.findIndex(item => item.id === selectedItem.id)
    const nextIndex = Math.min(mediaItems.length - 1, selectedIndex + 1)
    setSelectedItem(mediaItems[nextIndex])
  }

  if (!isOpen) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed inset-0 w-full h-full z-50 flex items-center justify-center px-4 py-8"
      >
        <motion.div 
          className="absolute inset-0 bg-black/30"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ 
            duration: 0.2,
            backdropFilter: { delay: 0, duration: 0.2 },
            opacity: { duration: 0.2 },
            ease: "easeOut"
          }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => onClose()}
          style={{ backdropFilter: "blur(8px)" }}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ 
            duration: 0.2,
            ease: "easeOut",
            scale: { type: "spring", damping: 25, stiffness: 300 }
          }}
          className="relative w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="relative">
            <div className="relative flex items-center justify-center">
              <img
                src={selectedItem.url}
                alt={selectedItem.title}
                className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white text-xl font-semibold">{selectedItem.title}</h3>
            <p className="text-white/80 text-sm mt-1">{selectedItem.desc}</p>
          </div>
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        initial={{ x: "-50%", y: 0 }}
        style={{
          position: "fixed",
          left: "50%",
          bottom: "1rem",
          x: dockPosition.x,
          y: dockPosition.y,
          zIndex: 50,
          touchAction: "none"
        }}
        onDragEnd={(_, info) => {
          setDockPosition((prev) => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y,
          }))
        }}
      >
        <motion.div className="relative rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg cursor-grab active:cursor-grabbing p-2">
          <div className="flex items-center space-x-2">
            {visibleRange.start > 0 && (
              <button
                onClick={handlePrevious}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
            )}
            {mediaItems.slice(visibleRange.start, visibleRange.end).map((item) => (
              <motion.div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedItem(item)
                }}
                className={`
                  relative group w-10 h-10 rounded-full overflow-hidden 
                  cursor-pointer hover:z-10 transition-all duration-300
                  ${selectedItem.id === item.id ? "ring-2 ring-white shadow-lg scale-110" : "hover:ring-2 hover:ring-white/50"}
                `}
                initial={false}
                animate={{
                  scale: selectedItem.id === item.id ? 1.1 : 1,
                }}
                whileHover={{ scale: 1.1 }}
              >
                <MediaItem item={item} className="w-full h-full object-cover" onClick={() => setSelectedItem(item)} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
            {visibleRange.end < mediaItems.length && (
              <button
                onClick={handleNext}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

interface WaterfallGalleryProps {
  mediaItems: MediaItemType[]
  title: string
  description: string
  insertAtStart?: boolean
}

const WaterfallGallery: React.FC<WaterfallGalleryProps> = ({ mediaItems, title, description, insertAtStart = false }) => {
  const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null)
  const [columns, setColumns] = useState<MediaItemType[][]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [imageHeights, setImageHeights] = useState<{ [key: number]: number }>({})
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  useEffect(() => {
    const loadImage = (item: MediaItemType) => {
      return new Promise<void>((resolve) => {
        if (loadedImages.has(item.id)) {
          resolve();
          return;
        }

        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.height / img.width;
          const scaledHeight = 300 * aspectRatio;
          setImageHeights(prev => ({ ...prev, [item.id]: scaledHeight }));
          setLoadedImages(prev => new Set([...prev, item.id]));
          resolve();
        };
        img.src = item.url;
      });
    };

    const loadImages = async () => {
      if (insertAtStart && mediaItems.length > 0) {
        await loadImage(mediaItems[0]);
      }
      const remainingItems = insertAtStart ? mediaItems.slice(1) : mediaItems;
      await Promise.all(remainingItems.map(loadImage));
    };

    loadImages();
  }, [mediaItems, insertAtStart, loadedImages]);

  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const minColumnWidth = 250; // 最小列宽
      const gap = 16; // 列间距

      // 计算最佳列数和列宽
      let numColumns = Math.floor((containerWidth + gap) / (minColumnWidth + gap));
      numColumns = Math.max(1, Math.min(4, numColumns)); // 限制最大列数为4
      
      // 计算实际列宽
      const columnWidth = Math.floor((containerWidth - (numColumns - 1) * gap) / numColumns);

      const newColumns: MediaItemType[][] = Array.from({ length: numColumns }, () => []);
      const columnHeights = new Array(numColumns).fill(0);

      const processedItems = mediaItems.filter(item => loadedImages.has(item.id));
      
      if (insertAtStart && processedItems.length > 0) {
        newColumns[0].push(processedItems[0]);
        columnHeights[0] += imageHeights[processedItems[0].id] || columnWidth;
      }

      const remainingItems = insertAtStart ? processedItems.slice(1) : processedItems;
      remainingItems.forEach((item) => {
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        newColumns[shortestColumnIndex].push(item);
        columnHeights[shortestColumnIndex] += imageHeights[item.id] || columnWidth;
      });

      setColumns(newColumns);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);

    return () => {
      window.removeEventListener("resize", updateColumns);
    };
  }, [mediaItems, imageHeights, insertAtStart, loadedImages]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" ref={containerRef}>
      <div className="mb-8 text-center">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {description}
        </motion.p>
      </div>
      {selectedItem && (
        <GalleryModal
          selectedItem={selectedItem}
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          setSelectedItem={setSelectedItem}
          mediaItems={mediaItems}
        />
      )}
      <div className="flex flex-wrap gap-4">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4 flex-1 min-w-[250px]">
            {column.map((item, itemIndex) => (
              <motion.div
                key={item.id}
                layoutId={`media-${item.id}`}
                className="mb-4 relative overflow-hidden rounded-xl cursor-pointer group"
                onClick={() => setSelectedItem(item)}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: itemIndex * 0.05,
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <MediaItem item={item} className="w-full h-auto" onClick={() => setSelectedItem(item)} />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-lg font-semibold line-clamp-1">{item.title}</h3>
                    <p className="text-white/80 text-sm mt-1 line-clamp-2">{item.desc}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WaterfallGallery

