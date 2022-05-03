import {iif, Observable, of, throwError} from 'rxjs'
import {delay, mergeMap} from 'rxjs/operators'

const debugThrottle = (throttled?: boolean) => {
  return function <T>(source: Observable<T>): Observable<T> {
    return iif(
      () => !!throttled,
      source.pipe(
        delay(3000),
        mergeMap(v => {
          if (Math.random() > 0.5) {
            return throwError({
              message: 'Test error',
              statusCode: 500
            })
          }
          return of(v)
        })
      ),
      source
    )
  }
}

export default debugThrottle
