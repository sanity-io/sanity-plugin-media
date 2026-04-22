import {describe, expect, it} from 'vitest'
import UploadDropzone from './index'
import {renderWithProviders} from '../../__tests__/fixtures/renderWithProviders'
import {initialState as assetsInitialState} from '../../modules/assets'

describe('UploadDropzone', () => {
  it('still renders file input when directUploads is false (dropzone in disabled mode)', () => {
    const {container} = renderWithProviders(
      <UploadDropzone>
        <div />
      </UploadDropzone>,
      {
        toolOptions: {creditLine: {enabled: false}, directUploads: false},
        preloaded: {
          assets: {...assetsInitialState, assetTypes: ['image', 'file']}
        }
      }
    )

    expect(container.querySelector('input[type="file"]')).toBeTruthy()
  })

  it('enables file input when directUploads is true', () => {
    const {container} = renderWithProviders(
      <UploadDropzone>
        <div />
      </UploadDropzone>,
      {
        toolOptions: {creditLine: {enabled: false}, directUploads: true},
        preloaded: {
          assets: {...assetsInitialState, assetTypes: ['image', 'file']}
        }
      }
    )

    const input = container.querySelector('input[type="file"]')
    expect(input).not.toHaveAttribute('disabled')
  })
})
