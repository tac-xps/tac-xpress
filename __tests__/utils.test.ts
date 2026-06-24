import { describe, it, expect } from 'vitest'
import { cn } from '../lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('merges tailwind classes properly', () => {
      expect(cn('px-2 py-1', 'bg-red-500')).toBe('px-2 py-1 bg-red-500')
      expect(cn('px-2', 'px-4')).toBe('px-4')
      expect(cn('p-4 p-2')).toBe('p-2')
    })
  })
})
