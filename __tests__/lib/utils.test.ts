import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('px-4', 'py-2')
    expect(result).toBe('px-4 py-2')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toBe('base-class active-class')
  })

  it('handles false conditional classes', () => {
    const isActive = false
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toBe('base-class')
  })

  it('merges conflicting tailwind classes', () => {
    const result = cn('px-2', 'px-4')
    expect(result).toBe('px-4')
  })

  it('handles arrays of classes', () => {
    const result = cn(['px-4', 'py-2'], 'text-white')
    expect(result).toBe('px-4 py-2 text-white')
  })

  it('handles empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('handles undefined and null values', () => {
    const result = cn('px-4', undefined, null, 'py-2')
    expect(result).toBe('px-4 py-2')
  })
})
