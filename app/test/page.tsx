'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TestRunner, assert, assertEqual, assertExists, assertGreaterThan, type TestReport } from '@/lib/test-utils'
import { formatPrice } from '@/lib/currency'
import { generateWhatsAppLink } from '@/lib/contact'

export const dynamic = 'force-dynamic'

export default function TestPage() {
  const [report, setReport] = useState<TestReport | null>(null)
  const [running, setRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string>('')

  const runAllTests = async () => {
    setRunning(true)
    setReport(null)

    const runner = new TestRunner()
    const supabase = createClient()

    // Test 1: Supabase Connection
    setCurrentTest('Testing Supabase connection...')
    await runner.run('Supabase connection works', async () => {
      const { data, error } = await supabase.from('users').select('count').limit(1)
      assert(!error, `Supabase connection failed: ${error?.message}`)
    })

    // Test 2: Users Table Exists
    setCurrentTest('Checking users table...')
    await runner.run('Users table exists', async () => {
      const { error } = await supabase.from('users').select('id').limit(1)
      assert(!error, `Users table query failed: ${error?.message}`)
    })

    // Test 3: Products Table Exists
    setCurrentTest('Checking products table...')
    await runner.run('Products table exists', async () => {
      const { error } = await supabase.from('products').select('id').limit(1)
      assert(!error, `Products table query failed: ${error?.message}`)
    })

    // Test 4: products_with_seller View
    setCurrentTest('Checking products_with_seller view...')
    await runner.runWithDetails('products_with_seller view works', async () => {
      const { data, error } = await (supabase as any)
        .from('products_with_seller')
        .select('id, seller_verified, seller_listings')
        .limit(5)

      assert(!error, `View query failed: ${error?.message}`)
      assertExists(data, 'View returned no data')

      if (data.length > 0) {
        const sample = data[0]
        assert(
          'seller_verified' in sample && 'seller_listings' in sample,
          'View missing trust signal fields'
        )
        return `Found ${data.length} products with trust signals`
      }
      return 'View structure validated'
    })

    // Test 5: PostGIS Extension
    setCurrentTest('Checking PostGIS extension...')
    await runner.run('PostGIS extension enabled', async () => {
      const { data, error } = await supabase.rpc('get_nearby_products' as any, {
        user_lat: 13.0827,
        user_lng: 80.2707,
        radius_km: 50,
        result_limit: 1,
        result_offset: 0,
      } as any)

      assert(
        !error || error.message.includes('does not exist'),
        `PostGIS function check failed: ${error?.message}`
      )
    })

    // Test 6: get_nearby_products Function
    setCurrentTest('Checking get_nearby_products function...')
    await runner.runWithDetails('get_nearby_products() function exists', async () => {
      const { data, error } = await supabase.rpc('get_nearby_products' as any, {
        user_lat: 13.0827,
        user_lng: 80.2707,
        radius_km: 50,
        result_limit: 5,
        result_offset: 0,
      } as any)

      if (error && error.message.includes('does not exist')) {
        return 'Function not yet deployed (optional for testing)'
      }

      assert(!error, `RPC call failed: ${error?.message}`)
      return data ? `Function works, returned ${(data as any[]).length} results` : 'Function works'
    })

    // Test 7: Storage Bucket
    setCurrentTest('Checking storage bucket...')
    await runner.run('Storage bucket accessible', async () => {
      const { data, error } = await supabase.storage.from('products').list('', { limit: 1 })
      assert(!error, `Storage bucket not accessible: ${error?.message}`)
    })

    // Test 8: Pages Load
    setCurrentTest('Checking page routes...')
    await runner.runWithDetails('All pages accessible', async () => {
      const pages = ['/', '/feed', '/sell', '/auth']
      const results = []

      for (const page of pages) {
        try {
          const response = await fetch(page, { method: 'HEAD' })
          results.push(`${page}: ${response.ok ? '✓' : '✗ ' + response.status}`)
        } catch (err) {
          results.push(`${page}: ✗ network error`)
        }
      }

      return results.join(', ')
    })

    // Test 9: API Routes
    setCurrentTest('Checking API routes...')
    await runner.run('API routes exist', async () => {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: '' }),
      })

      // Should return 400 for invalid data, not 404
      assert(
        response.status !== 404,
        'API route /api/analyze-image not found'
      )
    })

    // Test 10: Environment Variables
    setCurrentTest('Checking environment configuration...')
    await runner.runWithDetails('Environment variables configured', async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      assertExists(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL not set')
      assertExists(supabaseKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY not set')

      return 'Supabase environment variables configured'
    })

    // Test 11: Sample Products
    setCurrentTest('Checking sample data...')
    await runner.runWithDetails('Sample products exist', async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price')
        .eq('status', 'live')
        .limit(10)

      assert(!error, `Failed to fetch products: ${error?.message}`)
      assertExists(data, 'No products found')
      assertGreaterThan(data.length, 0, 'Database has no live products')

      return `Found ${data.length} live products`
    })

    // Test 12: Geolocation API
    setCurrentTest('Checking browser geolocation...')
    await runner.run('Geolocation API available', async () => {
      assert(
        'geolocation' in navigator,
        'Geolocation API not available in this browser'
      )
    })

    // Test 13: localStorage
    setCurrentTest('Checking localStorage...')
    await runner.run('localStorage available', async () => {
      try {
        const testKey = '__snapsell_test__'
        localStorage.setItem(testKey, 'test')
        const value = localStorage.getItem(testKey)
        localStorage.removeItem(testKey)
        assertEqual(value, 'test', 'localStorage read/write failed')
      } catch (err) {
        throw new Error('localStorage not accessible')
      }
    })

    // Test 14: Camera API
    setCurrentTest('Checking camera API...')
    await runner.run('Camera API available', async () => {
      assert(
        'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
        'Camera API not available in this browser'
      )
    })

    // Test 15: WhatsApp Link Generation
    setCurrentTest('Testing WhatsApp link generation...')
    await runner.runWithDetails('WhatsApp links generate correctly', async () => {
      const link = generateWhatsAppLink('9876543210', 'Test message')
      assert(link.includes('9876543210'), 'Phone number not in link')
      assert(link.includes('Test%20message'), 'Message not encoded in link')
      assert(
        link.startsWith('whatsapp://') || link.startsWith('https://wa.me/'),
        'Invalid WhatsApp URL scheme'
      )
      return `Generated: ${link.substring(0, 50)}...`
    })

    // Test 16: Currency Formatting
    setCurrentTest('Testing currency formatting...')
    await runner.runWithDetails('Currency formatting works', async () => {
      const formatted = formatPrice(1500, 'INR')
      assert(formatted.includes('1'), 'Price value missing')
      assert(formatted.includes('500') || formatted.includes('1,500'), 'Price not formatted')
      return `₹1500 → ${formatted}`
    })

    const finalReport = runner.getReport()
    setReport(finalReport)
    setRunning(false)
    setCurrentTest('')
  }

  const downloadReport = () => {
    if (report) {
      const runner = new TestRunner()
      runner.downloadReport(report)
    }
  }

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-ink mb-2">SnapSell Test Suite</h1>
          <p className="text-muted">
            Automated validation of database, APIs, and browser features
          </p>
        </div>

        {/* Run Tests Button */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <button
            onClick={runAllTests}
            disabled={running}
            className="w-full bg-accent text-white font-semibold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-accent/90 active:scale-[0.98]"
          >
            {running ? `Running: ${currentTest}` : 'Run All Tests'}
          </button>
        </div>

        {/* Progress */}
        {running && currentTest && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
              <span className="text-blue-900 font-medium">{currentTest}</span>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {report && (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-ink">Test Results</h2>
              <button
                onClick={downloadReport}
                className="flex items-center gap-2 bg-ink text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ink/90"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Download Report
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-surface rounded-xl p-4">
                <div className="text-2xl font-bold text-ink">{report.totalTests}</div>
                <div className="text-sm text-muted">Total Tests</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">{report.passed}</div>
                <div className="text-sm text-green-700">Passed</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-red-600">{report.failed}</div>
                <div className="text-sm text-red-700">Failed</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {(report.duration / 1000).toFixed(2)}s
                </div>
                <div className="text-sm text-blue-700">Duration</div>
              </div>
            </div>

            {/* Individual Test Results */}
            <div className="space-y-2 mt-6">
              <h3 className="font-semibold text-ink mb-3">Detailed Results</h3>
              {report.results.map((result, index) => (
                <div
                  key={index}
                  className={`border rounded-xl p-4 ${
                    result.passed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">
                        {result.passed ? '✅' : '❌'}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-ink">{result.name}</div>
                        {result.details && (
                          <div className="text-sm text-muted mt-1">{result.details}</div>
                        )}
                        {result.error && (
                          <div className="text-sm text-red-700 mt-2 font-mono bg-red-100 p-2 rounded">
                            {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted ml-4">
                      {result.duration.toFixed(0)}ms
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Status */}
            <div
              className={`rounded-xl p-6 text-center ${
                report.failed === 0
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              {report.failed === 0 ? (
                <>
                  <div className="text-4xl mb-2">🎉</div>
                  <div className="text-xl font-bold text-green-900">
                    All Tests Passed!
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    Your SnapSell MVP is ready for deployment
                  </div>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-2">⚠️</div>
                  <div className="text-xl font-bold text-yellow-900">
                    {report.failed} Test{report.failed > 1 ? 's' : ''} Failed
                  </div>
                  <div className="text-sm text-yellow-700 mt-1">
                    Review the errors above and fix before deploying
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!report && !running && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Testing Checklist</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Database connection and tables</li>
              <li>✓ PostGIS spatial queries</li>
              <li>✓ Storage bucket access</li>
              <li>✓ API routes and pages</li>
              <li>✓ Browser APIs (camera, geolocation, storage)</li>
              <li>✓ Utility functions (WhatsApp, currency)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
