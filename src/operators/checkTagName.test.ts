// @vitest-environment node

import {describe, expect, it, vi} from 'vitest'
import {firstValueFrom, of} from 'rxjs'
import type {SanityClient} from '@sanity/client'
import checkTagName from './checkTagName'

describe('checkTagName', () => {
  it('errors with 409 when a tag with the same slug exists', async () => {
    const client = {
      fetch: vi.fn().mockResolvedValue(1)
    } as unknown as SanityClient

    await expect(
      firstValueFrom(of(null).pipe(checkTagName(client, 'existing')))
    ).rejects.toMatchObject({statusCode: 409, message: 'Tag already exists'})
  })

  it('emits true when name is available', async () => {
    const client = {
      fetch: vi.fn().mockResolvedValue(0)
    } as unknown as SanityClient

    await expect(firstValueFrom(of(null).pipe(checkTagName(client, 'fresh-name')))).resolves.toBe(
      true
    )
  })
})
