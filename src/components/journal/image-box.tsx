"use client"

import { useState } from "react"
import ImageUploder from "@/components/journal/image-uploder"

interface Props {
  image: File | null
  onImageChange: (file: File | null) => void
}

export function ImageBox({ image, onImageChange }: Props) {
  return (
    <div>
      <div className="mb-4 text-sm font-medium"></div>
      <ImageUploder file={image} onChange={onImageChange} />
    </div>
  )
}
