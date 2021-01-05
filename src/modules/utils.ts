import {iif, of, throwError} from 'rxjs'
import {delay, mergeMap} from 'rxjs/operators'

export const debugThrottle = (action: any, throttled: boolean) => {
  return mergeMap(action => {
    return iif(
      () => throttled,
      of(action).pipe(
        delay(3000),
        mergeMap(action => {
          if (Math.random() > 0.5) {
            return throwError('Test error')
          }
          return of(action)
        })
      ),
      of(action)
    )
  })
}
