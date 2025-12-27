'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { compressImage, validateImageFile } from '@/lib/image'
import { useTranslations } from '@/lib/i18n'

interface CameraCaptureProps {
  onCapture: (imageBlob: Blob, imageUrl: string) => void
  onError: (error: Error) => void
}

export function CameraCapture({ onCapture, onError }: CameraCaptureProps) {
  const { t } = useTranslations()
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturing, setCapturing] = useState(false)
  const [showFallback, setShowFallback] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Rear camera
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })

      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Camera access denied:', err)
      setShowFallback(true)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
  }

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setCapturing(true)

    try {
      const video = videoRef.current
      const canvas = canvasRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Failed to get canvas context')

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0)

      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('Failed to capture image')
        }

        // Compress image
        const compressedBlob = await compressImage(
          new File([blob], 'photo.jpg', { type: 'image/jpeg' })
        )

        const imageUrl = URL.createObjectURL(compressedBlob)

        stopCamera()
        onCapture(compressedBlob, imageUrl)
      }, 'image/jpeg', 0.9)
    } catch (err) {
      onError(err as Error)
      setCapturing(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      onError(new Error(validation.error))
      return
    }

    try {
      const compressedBlob = await compressImage(file)
      const imageUrl = URL.createObjectURL(compressedBlob)
      onCapture(compressedBlob, imageUrl)
    } catch (err) {
      onError(err as Error)
    }
  }

  if (showFallback) {
    return (
      <div className="fixed inset-0 bg-ink flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <p className="text-surface text-lg mb-2">{t('camera.hint')}</p>
          <p className="text-muted text-sm">{t('camera.fallback')}</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="primary"
          size="lg"
        >
          {t('camera.fallback')}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-ink">
      {/* Video stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-between p-6 safe-area-inset">
        {/* Hint */}
        <div className="mt-8 bg-ink/50 backdrop-blur-sm px-6 py-3 rounded-2xl">
          <p className="text-surface text-center animate-pulse-subtle">
            {t('camera.hint')}
          </p>
        </div>

        {/* Capture button */}
        <div className="mb-12">
          <button
            onClick={capturePhoto}
            disabled={capturing}
            className={`
              w-20 h-20 rounded-full border-4 border-surface bg-surface/20
              flex items-center justify-center
              transition-transform active:scale-90
              disabled:opacity-50
              ${capturing ? 'animate-pulse' : ''}
            `}
          >
            <div className="w-16 h-16 rounded-full bg-surface" />
          </button>
        </div>
      </div>

      {/* Flash effect */}
      {capturing && (
        <div className="absolute inset-0 bg-surface animate-fade-up opacity-0" />
      )}
    </div>
  )
}
