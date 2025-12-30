'use client'

import { useState, useRef } from 'react'
import { Camera, Image as ImageIcon, X } from 'lucide-react'

interface CaptureChoiceProps {
  onCapture: (imageBase64: string, source: 'camera' | 'gallery') => void
}

export function CaptureChoice({ onCapture }: CaptureChoiceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setShowCamera(true)
    } catch (error) {
      console.error('Camera access denied:', error)
      // Fallback to gallery
      openGallery()
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(videoRef.current, 0, 0)

    // Compress to JPEG
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.8)
    stopCamera()
    onCapture(imageBase64, 'camera')
  }

  const openGallery = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image too large. Max 10MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageBase64 = e.target?.result as string
      // Compress image if needed
      compressImage(imageBase64).then((compressed) => {
        onCapture(compressed, 'gallery')
      })
    }
    reader.readAsDataURL(file)
  }

  const compressImage = async (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxSize = 1920
        let { width, height } = img

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize
            width = maxSize
          } else {
            width = (width / height) * maxSize
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = base64
    })
  }

  // Camera View
  if (showCamera) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

        {/* Close button */}
        <button
          onClick={stopCamera}
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Capture button */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <button
            onClick={capturePhoto}
            className="w-20 h-20 bg-white rounded-full border-4 border-gray-300
                       flex items-center justify-center active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 bg-white rounded-full" />
          </button>
        </div>
      </div>
    )
  }

  // Choice View
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <h1 className="text-2xl font-bold mb-2 text-ink">What are you selling?</h1>
      <p className="text-muted mb-8">Take a photo or choose from gallery</p>

      <div className="flex gap-4 w-full max-w-sm">
        {/* Camera Option */}
        <button
          onClick={startCamera}
          className="flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl
                     border-2 border-dashed border-gray-300 hover:border-accent hover:bg-accent/5
                     transition-colors"
        >
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-accent" />
          </div>
          <span className="font-medium text-ink">Camera</span>
        </button>

        {/* Gallery Option */}
        <button
          onClick={openGallery}
          className="flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl
                     border-2 border-dashed border-gray-300 hover:border-accent hover:bg-accent/5
                     transition-colors"
        >
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-accent" />
          </div>
          <span className="font-medium text-ink">Gallery</span>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
