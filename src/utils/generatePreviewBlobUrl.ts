import {Observable, from, of} from 'rxjs'
import {mergeMap} from 'rxjs/operators'

const PREVIEW_WIDTH = 180 // px

const createBlob = (img: HTMLImageElement): Promise<Blob | null> => {
  return new Promise(resolve => {
    const imageAspect = img.width / img.height

    // Create a canvas element which we'll use to generate a low resolution preview.
    // Ensure that the canvas is at least 1 pixel high as blob generation will fail otherwise.
    const canvas: HTMLCanvasElement = document.createElement('canvas')
    canvas.width = PREVIEW_WIDTH
    canvas.height = Math.max(PREVIEW_WIDTH / imageAspect, 1)

    // Fail silently if we're unable to generate a preview image.
    // This can often be the case when trying to render SVGs containing `<foreignObject>` elements.
    try {
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, PREVIEW_WIDTH, PREVIEW_WIDTH / imageAspect)
      canvas.toBlob(resolve, 'image/jpeg')
    } catch (err) {
      console.warn(`Unable to generate preview image:`, err)
    }
  })
}

const createImageEl = (file: File): Promise<HTMLImageElement> => {
  return new Promise(resolve => {
    const blobUrlLarge = window.URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      window.URL.revokeObjectURL(blobUrlLarge)
      resolve(img)
    }
    img.src = blobUrlLarge
  })
}

const generatePreviewBlobUrl = async (file: File): Promise<string> => {
  const imageEl = await createImageEl(file)
  const blob = await createBlob(imageEl)

  if (!blob) {
    throw Error('Unable to generate file Blob')
  }

  return window.URL.createObjectURL(blob)
}

export const generatePreviewBlobUrl$ = (file: File): Observable<string> => {
  return of(null).pipe(mergeMap(() => from(generatePreviewBlobUrl(file))))
}
