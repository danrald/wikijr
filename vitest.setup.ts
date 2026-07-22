import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Testing Library's auto-cleanup only self-registers when it detects a
// globals-based test runner; this project runs Vitest without `test.globals`,
// so unmount explicitly after each test to avoid DOM/state leaking across tests.
afterEach(() => {
  cleanup()
})
