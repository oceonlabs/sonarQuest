import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('Utility functions', () => {
  describe('cn (className merge)', () => {
    it('merges class names correctly', () => {
      expect(cn('px-2 py-1', 'text-sm')).toBe('px-2 py-1 text-sm')
    })

    it('handles conflicting classes with Tailwind merge', () => {
      expect(cn('px-2 px-4', 'py-1')).toBe('px-4 py-1')
    })

    it('handles conditional classes', () => {
      expect(cn('px-2', true && 'py-1', false && 'text-lg')).toBe('px-2 py-1')
    })

    it('handles undefined and null values', () => {
      expect(cn('px-2', undefined, null, 'py-1')).toBe('px-2 py-1')
    })

    it('handles empty input', () => {
      expect(cn()).toBe('')
    })
  })
})