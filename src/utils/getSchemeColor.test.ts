import {describe, expect, it} from 'vitest'
import {getSchemeColor} from './getSchemeColor'

describe('getSchemeColor', () => {
  it('returns a hex or theme string for light and dark schemes', () => {
    expect(getSchemeColor('light', 'bg')).toMatch(/^#/)
    expect(getSchemeColor('dark', 'bg')).toMatch(/^#/)
    expect(getSchemeColor('light', 'spotBlue')).toBeTruthy()
    expect(getSchemeColor('dark', 'inputEnabledBorder')).toBeTruthy()
  })
})
