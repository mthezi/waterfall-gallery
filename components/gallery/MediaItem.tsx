import { MediaItemProps } from '@/types/gallery'
import { Image } from '@/components/ui/Image'
import { IconButton } from '@/components/ui/IconButton'
import { Tag } from '@/components/ui/Tag'

export const MediaItem = ({ 
  item, 
  className = '', 
  onClick,
  onDelete,
  onDownload,
  showActions = true,
  showTag = true
}: MediaItemProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(item)
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDownload?.(item)
  }

  return (
    <div className={`relative group ${className}`}>
      {showTag && item.tag && (
        <div className="absolute top-3 left-3 z-10">
          <Tag>{item.tag}</Tag>
        </div>
      )}
      
      {showActions && (
        <div className="absolute bottom-3 right-3 z-[60] flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton onClick={handleDownload} title="Download">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </IconButton>
          <IconButton onClick={handleDelete} title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </IconButton>
        </div>
      )}

      <Image
        src={item.url}
        alt={item.title}
        className="w-full h-auto object-cover cursor-pointer"
        onClick={onClick}
      />
    </div>
  )
} 