// @vitest-environment node

import {describe, expect, it} from 'vitest'
import type {UploadItem} from '../../types'
import uploadsReducer, {uploadsActions} from './index'

describe('uploads slice', () => {
  it('uploadStart adds item to queue', () => {
    let state = uploadsReducer(undefined, {type: '@@INIT'} as never)
    const uploadItem = {
      _type: 'upload',
      assetType: 'image',
      hash: 'abc',
      name: 'x.png',
      size: 1,
      status: 'queued'
    } as UploadItem

    state = uploadsReducer(
      state,
      uploadsActions.uploadStart({
        file: new File([], 'x.png'),
        uploadItem
      })
    )

    expect(state.allIds).toEqual(['abc'])
    expect(state.byIds.abc).toMatchObject({hash: 'abc', status: 'queued'})
  })

  it('uploadProgress updates percent and status', () => {
    let state = uploadsReducer(undefined, {type: '@@INIT'} as never)
    const uploadItem = {
      _type: 'upload',
      assetType: 'image',
      hash: 'h1',
      name: 'x.png',
      size: 1,
      status: 'queued',
      percent: 0
    } as UploadItem

    state = uploadsReducer(
      state,
      uploadsActions.uploadStart({file: new File([], 'x.png'), uploadItem})
    )
    state = uploadsReducer(
      state,
      uploadsActions.uploadProgress({
        uploadHash: 'h1',
        event: {percent: 42, stage: 'upload'} as any
      })
    )

    expect(state.byIds.h1.percent).toBe(42)
    expect(state.byIds.h1.status).toBe('uploading')
  })
})
