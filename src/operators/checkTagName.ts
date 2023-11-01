import type {SanityClient} from '@sanity/client'
import type {HttpError} from '@types'
import groq from 'groq'
import {from, Observable, of, throwError} from 'rxjs'
import {mergeMap} from 'rxjs/operators'
import {COLLABORATION_DOCUMENT_NAME, SEASONS_DOCUMENT_NAME, TAG_DOCUMENT_NAME} from '../constants'

const checkTagName = (client: SanityClient, name: string) => {
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

export const checkSeasonName = (client: SanityClient, name: string) => {
  return function <T>(source: Observable<T>): Observable<boolean> {
    return source.pipe(
      mergeMap(() => {
        return from(
          client.fetch(
            groq`count(*[_type == "${SEASONS_DOCUMENT_NAME}" && name.current == $name])`,
            {
              name
            }
          )
        ) as Observable<number>
      }),
      mergeMap((existingSeasonCount: number) => {
        if (existingSeasonCount > 0) {
          return throwError({
            message: 'Season already exists',
            statusCode: 409
          } as HttpError)
        }

        return of(true)
      })
    )
  }
}

export const checkCollaborationName = (client: SanityClient, name: string) => {
  return function <T>(source: Observable<T>): Observable<boolean> {
    return source.pipe(
      mergeMap(() => {
        return from(
          client.fetch(
            groq`count(*[_type == "${COLLABORATION_DOCUMENT_NAME}" && name.current == $name])`,
            {
              name
            }
          )
        ) as Observable<number>
      }),
      mergeMap((existingCollaborationCount: number) => {
        if (existingCollaborationCount > 0) {
          return throwError({
            message: 'Collaboration already exists',
            statusCode: 409
          } as HttpError)
        }

        return of(true)
      })
    )
  }
}

export default checkTagName
