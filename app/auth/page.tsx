'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslations()
  const supabase = createClient()

  const redirectTo = searchParams.get('redirect') || '/sell'

  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Format phone with country code
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`

      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      })

      if (otpError) throw otpError

      setStep('otp')
    } catch (err: any) {
      console.error('OTP send failed:', err)
      setError(err.message || 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit code')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      })

      if (verifyError) throw verifyError

      // Create user record if doesn't exist
      if (data.user) {
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            phone: formattedPhone,
            phone_verified: true,
            country_code: '+91',
          } as any)
          .select()

        if (upsertError) console.error('User upsert failed:', upsertError)
      }

      // Navigate to redirect URL
      router.push(redirectTo)
    } catch (err: any) {
      console.error('OTP verify failed:', err)
      setError(err.message || 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setOtp('')
    await handleSendOTP()
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-ink mb-2">
            SnapSell
          </h1>
          <p className="text-muted text-lg">
            {t('auth.subtitle')}
          </p>
        </div>

        {/* Phone Step */}
        {step === 'phone' && (
          <div className="space-y-6 animate-fade-up">
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              label={t('auth.phone')}
              error={error || undefined}
              disabled={loading}
            />

            <Button
              onClick={handleSendOTP}
              loading={loading}
              disabled={!phone}
            >
              {t('auth.send_otp')}
            </Button>

            <p className="text-xs text-muted text-center">
              We'll send you a code to verify your number
            </p>
          </div>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <button
                onClick={() => setStep('phone')}
                className="text-sm text-muted hover:text-ink mb-4 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Change number
              </button>

              <Input
                type="tel"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="000000"
                label={t('auth.verify_otp')}
                error={error || undefined}
                disabled={loading}
                maxLength={6}
              />
            </div>

            <Button
              onClick={handleVerifyOTP}
              loading={loading}
              disabled={!otp || otp.length !== 6}
            >
              {t('auth.verify')}
            </Button>

            <button
              onClick={handleResendOTP}
              disabled={loading}
              className="w-full text-center text-sm text-accent hover:underline disabled:opacity-50"
            >
              {t('auth.resend')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
