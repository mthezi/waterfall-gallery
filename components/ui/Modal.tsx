import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { IconButton } from './IconButton'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export const Modal = ({ isOpen, onClose, children, className = '' }: ModalProps) => {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed inset-0 w-full h-full z-[100] flex items-center justify-center px-4 py-8"
    >
      <motion.div 
        className="absolute inset-0 bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{ 
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          pointerEvents: "auto"
        }}
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
        className={`relative bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl ${className}`}
      >
        <div className="absolute top-4 right-4 z-[100]">
          <IconButton
            size="lg"
            className="text-white"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </IconButton>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
} 