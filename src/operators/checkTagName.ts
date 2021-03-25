import {HttpError} from '@types'
import groq from 'groq'
import {from, Observable, of, throwError} from 'rxjs'
import {mergeMap} from 'rxjs/operators'

import {client} from '../client'
import {TAG_DOCUMENT_NAME} from '../constants'

const checkTagName = (name: string) => {
  return function <T>(source: Observable<T>): Observable<boolean> {
    return source.pipe(
      mergeMap(() => {
        return from(
          client.fetch(groq`count(*[_type == "${TAG_DOCUMENT_NAME}" && name.current == $name])`, {
            name
          })
        ) as Observable<number>
      }),
      mergeMap((existingTagCount: number) => {
        if (existingTagCount > 0) {
          return throwError({
            message: 'Tag already exists',
            statusCode: 409
          } as HttpError)
        }

        return of(true)
      })
    )
  }
}

export default checkTagName
