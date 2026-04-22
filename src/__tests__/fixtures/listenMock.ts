import {vi} from 'vitest'

/** Flat mock for client.listen() without deep callback nesting (ESLint max-nested-callbacks). */
export function createListenMock(): ReturnType<typeof vi.fn> {
  const unsubscribe = vi.fn()
  const subscribe = vi.fn()
  subscribe.mockReturnValue({unsubscribe})
  return vi.fn().mockReturnValue({subscribe})
}
