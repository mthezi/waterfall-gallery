"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { GalleryProps, MediaItemType } from "@/types/gallery"
import { MediaItem } from "./MediaItem"
import { GalleryModal } from "./GalleryModal"

export const WaterfallGallery = ({ 
  mediaItems, 
  title, 
  description, 
  insertAtStart = false,
  emptyStateMessage = "No images to display",
  onDelete,
  onDownload
}: GalleryProps) => {
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
          onDelete={onDelete}
          onDownload={onDownload}
        />
      )}

      <div className="flex flex-wrap gap-4">
        {mediaItems.length === 0 ? (
          <div className="w-full flex items-center justify-center py-16">
            <div className="text-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{emptyStateMessage}</h3>
            </div>
          </div>
        ) : (
          columns.map((column, columnIndex) => (
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
                  <MediaItem 
                    item={item} 
                    className="w-full h-auto" 
                    onClick={() => setSelectedItem(item)}
                    onDelete={onDelete}
                    onDownload={onDownload}
                    showActions={true}
                    showTag={true}
                  />
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
          ))
        )}
      </div>
    </div>
  )
}

export default WaterfallGallery 