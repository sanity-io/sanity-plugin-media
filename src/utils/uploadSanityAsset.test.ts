import {afterEach, describe, expect, it} from 'vitest'
import {firstValueFrom} from 'rxjs'
import {hashFile$} from './uploadSanityAsset'

describe('hashFile$', () => {
  const cryptoRef = globalThis.crypto

  afterEach(() => {
    Object.defineProperty(globalThis, 'crypto', {
      value: cryptoRef,
      configurable: true,
      writable: true
    })
  })

  it('errors when Web Crypto is unavailable', async () => {
    Object.defineProperty(globalThis, 'crypto', {
      value: undefined,
      configurable: true,
      writable: true
    })

    await expect(firstValueFrom(hashFile$(new File(['x'], 'blob.bin')))).rejects.toMatchObject({
      message: expect.stringMatching(/secure contexts/i),
      statusCode: 500
    })
  })
})
