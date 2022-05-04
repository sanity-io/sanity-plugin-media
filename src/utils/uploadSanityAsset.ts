// Sourced from:
// https://github.com/sanity-io/sanity/blob/ccb777e115a8cdf20d81a9a2bc9d8c228568faff/packages/%40sanity/form-builder/src/sanity/inputs/client-adapters/assets.ts

import type {SanityAssetDocument, SanityImageAssetDocument} from '@sanity/client'
import {HttpError} from '@types'
import {Observable, of, throwError} from 'rxjs'
import {map, mergeMap} from 'rxjs/operators'
import {client} from '../client'
import {withMaxConcurrency} from './withMaxConcurrency'

const fetchExisting$ = (type: string, hash: string) => {
  return client.observable.fetch('*[_type == $documentType && sha1hash == $hash][0]', {
    documentType: type,
    hash
  })
}

const readFile$ = (file: File): Observable<ArrayBuffer> => {
  return new Observable(subscriber => {
    const reader = new FileReader()
    reader.onload = () => {
      subscriber.next(reader.result as ArrayBuffer)
      subscriber.complete()
    }
    reader.onerror = err => {
      subscriber.error(err)
    }
    reader.readAsArrayBuffer(file)
    return () => {
      reader.abort()
    }
  })
}

const hexFromBuffer = (buffer: ArrayBuffer): string => {
  return Array.prototype.map
    .call(new Uint8Array(buffer), x => `00${x.toString(16)}`.slice(-2))
    .join('')
}

export const hashFile$ = (file: File): Observable<string | null> => {
  if (!window.crypto || !window.crypto.subtle || !window.FileReader) {
    return of(null)
  }
  return readFile$(file).pipe(
    mergeMap(arrayBuffer => window.crypto.subtle.digest('SHA-1', arrayBuffer)),
    map(hexFromBuffer)
  )
}

const uploadSanityAsset$ = (assetType: 'file' | 'image', file: File, hash: string) => {
  return of(null).pipe(
    // NOTE: the sanity api will still dedupe unique files, but this saves us from uploading the asset file entirely
    mergeMap(() => fetchExisting$(`sanity.${assetType}Asset`, hash)),
    // Cancel if the asset already exists
    mergeMap((existingAsset: SanityAssetDocument | SanityImageAssetDocument | null) => {
      if (existingAsset) {
        return throwError({
          message: 'Asset already exists',
          statusCode: 409
        } as HttpError)
      }

      return of(null)
    }),
    mergeMap(() => {
      // Begin upload if no existing asset found
      return client.observable.assets
        .upload(assetType, file, {
          extract: ['blurhash', 'exif', 'location', 'lqip', 'palette'],
          preserveFilename: true
        })
        .pipe(
          map(event =>
            event.type === 'response'
              ? {
                  // rewrite to a 'complete' event
                  asset: event.body.document,
                  id: event.body.document._id,
                  type: 'complete'
                }
              : event
          )
        )
    })
  )
}

export const uploadAsset$ = withMaxConcurrency(uploadSanityAsset$)
