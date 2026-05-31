'use client'

import { motion } from 'framer-motion'

export default function GreenSquare({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.05, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="w-32 h-32 relative"
      >
        <div className="absolute inset-0 rounded-xl border border-primary/30 bg-primary/5 backdrop-blur-sm" />
        <div className="absolute inset-2 rounded-lg border border-primary/20 bg-primary/5" />
        <div className="absolute inset-4 rounded-md border border-primary/15 bg-primary/5" />
      </motion.div>

      {/* glow */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'radial-gradient(circle, oklch(0.72 0.2 150 / 20%) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
