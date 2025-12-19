"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const words = [
  "Mastery",
  "Intelligence",
  "Success",
  "Innovation",
  "Confidence"
]

export default function TextCycler() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  return (
    <span className="relative inline-block min-w-[200px] text-left">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute left-0 bg-linear-to-r from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent italic"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
