'use client'

import { useEffect, ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function Modal({
  isOpen,
  onClose,
  children
}: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return
    
    // Save the current overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow
    
    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden'
    
    // Restore original body scroll when component unmounts or modal closes
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn !m-0"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
} 