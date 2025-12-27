'use client'

export interface TestResult {
  name: string
  passed: boolean
  error?: string
  duration: number
  details?: string
}

export interface TestReport {
  timestamp: string
  totalTests: number
  passed: number
  failed: number
  duration: number
  results: TestResult[]
}

export class TestRunner {
  private results: TestResult[] = []

  async run(name: string, testFn: () => Promise<void> | void): Promise<TestResult> {
    const startTime = performance.now()

    try {
      await testFn()
      const duration = performance.now() - startTime
      const result: TestResult = { name, passed: true, duration }
      this.results.push(result)
      return result
    } catch (error) {
      const duration = performance.now() - startTime
      const result: TestResult = {
        name,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        duration,
      }
      this.results.push(result)
      return result
    }
  }

  async runWithDetails(
    name: string,
    testFn: () => Promise<string | void> | string | void
  ): Promise<TestResult> {
    const startTime = performance.now()

    try {
      const details = await testFn()
      const duration = performance.now() - startTime
      const result: TestResult = {
        name,
        passed: true,
        duration,
        details: typeof details === 'string' ? details : undefined,
      }
      this.results.push(result)
      return result
    } catch (error) {
      const duration = performance.now() - startTime
      const result: TestResult = {
        name,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        duration,
      }
      this.results.push(result)
      return result
    }
  }

  getReport(): TestReport {
    const passed = this.results.filter((r) => r.passed).length
    const failed = this.results.length - passed
    const duration = this.results.reduce((sum, r) => sum + r.duration, 0)

    return {
      timestamp: new Date().toISOString(),
      totalTests: this.results.length,
      passed,
      failed,
      duration,
      results: this.results,
    }
  }

  reset() {
    this.results = []
  }

  downloadReport(report: TestReport) {
    const json = JSON.stringify(report, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `snapsell-test-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

// Assertion helpers
export function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

export function assertEqual<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(
      message || `Expected ${expected}, but got ${actual}`
    )
  }
}

export function assertExists<T>(value: T | null | undefined, message?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message || 'Expected value to exist, but got null or undefined')
  }
}

export function assertContains(array: any[], item: any, message?: string) {
  if (!array.includes(item)) {
    throw new Error(message || `Expected array to contain ${item}`)
  }
}

export function assertGreaterThan(actual: number, expected: number, message?: string) {
  if (actual <= expected) {
    throw new Error(
      message || `Expected ${actual} to be greater than ${expected}`
    )
  }
}
