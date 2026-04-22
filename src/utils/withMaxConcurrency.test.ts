import {describe, expect, it} from 'vitest'
import {Observable, firstValueFrom} from 'rxjs'
import {createThrottler, withMaxConcurrency} from './withMaxConcurrency'

describe('createThrottler', () => {
  it('never runs more observables concurrently than the limit', async () => {
    let active = 0
    let maxActive = 0
    const request = createThrottler(2)

    const mk = () =>
      new Observable<number>(sub => {
        active++
        maxActive = Math.max(maxActive, active)
        queueMicrotask(() => {
          active--
          sub.next(1)
          sub.complete()
        })
      })

    await Promise.all([
      firstValueFrom(request(mk())),
      firstValueFrom(request(mk())),
      firstValueFrom(request(mk()))
    ])

    expect(maxActive).toBe(2)
  })
})

describe('withMaxConcurrency', () => {
  it('wraps a function so each call returns a single-value observable', async () => {
    const fn = (n: number) =>
      new Observable<number>(sub => {
        sub.next(n)
        sub.complete()
      })
    const wrapped = withMaxConcurrency(fn, 4)
    await expect(firstValueFrom(wrapped(7))).resolves.toBe(7)
  })
})
