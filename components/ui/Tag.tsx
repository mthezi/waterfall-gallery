interface TagProps {
  children: React.ReactNode
  className?: string
}

export const Tag = ({ children, className = '' }: TagProps) => {
  return (
    <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-black/10">
      <span className={`text-xs font-medium text-white drop-shadow-sm tracking-wide ${className}`}>
        {children}
      </span>
    </div>
  )
} 