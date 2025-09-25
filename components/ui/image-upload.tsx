"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Upload } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
  maxSize?: number
}

export default function ImageUpload({
  value = [],
  onChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (value.length + acceptedFiles.length > maxFiles) {
        alert(`Máximo ${maxFiles} imágenes permitidas`)
        return
      }

      setUploading(true)
      setUploadProgress(0)

      try {
        const uploadPromises = acceptedFiles.map(async (file, index) => {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            throw new Error("Upload failed")
          }

          const result = await response.json()
          setUploadProgress(((index + 1) / acceptedFiles.length) * 100)
          return result.url
        })

        const uploadedUrls = await Promise.all(uploadPromises)
        onChange([...value, ...uploadedUrls])
      } catch (error) {
        console.error("Upload error:", error)
        alert("Error al subir las imágenes")
      } finally {
        setUploading(false)
        setUploadProgress(0)
      }
    },
    [value, onChange, maxFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize,
    disabled: uploading,
  })

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
        } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-green-600">Suelta las imágenes aquí...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">Arrastra imágenes aquí o haz clic para seleccionar</p>
            <p className="text-sm text-gray-500">PNG, JPG, WEBP hasta {Math.round(maxSize / 1024 / 1024)}MB</p>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Subiendo imágenes...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {/* Image Preview */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={url || "/placeholder.svg"}
                  alt={`Upload ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* File Count */}
      <p className="text-sm text-gray-500">
        {value.length} de {maxFiles} imágenes
      </p>
    </div>
  )
}
