"use client"

import { useEffect, useState } from "react"
import ImageUploader from "@/components/journal/image-uploder"

interface Props {
  image: File | string | null
  onImageChange: (file: File | null) => void
}

export function ImageBox({ image, onImageChange }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (typeof image === "string") {
      setPreviewUrl(image)
    } else if (image instanceof File) {
      const url = URL.createObjectURL(image)
      setPreviewUrl(url)

      return () => {
        URL.revokeObjectURL(url)
      }
    } else {
      setPreviewUrl(null)
    }
  }, [image])

  return (
    <div className="flex flex-col gap-4">
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="rounded-md object-cover w-full max-h-60 border"
        />
      )}
      <ImageUploader file={typeof image === "string" ? null : image} onChange={onImageChange} />
    </div>
  )
}
