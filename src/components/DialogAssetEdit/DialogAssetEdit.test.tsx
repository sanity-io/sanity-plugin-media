import userEvent from '@testing-library/user-event'
import {fireEvent, screen, waitFor} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {Subject} from 'rxjs'
import DialogAssetEdit from './index'

vi.mock('../Image', () => ({default: () => null}))
vi.mock('../FileAssetPreview', () => ({default: () => null}))
vi.mock('../DocumentList', () => ({default: () => null}))
vi.mock('../AssetMetadata', () => ({default: () => null}))
import {createMockSanityClient} from '../../__tests__/fixtures/mockSanityClient'
import {renderWithProviders} from '../../__tests__/fixtures/renderWithProviders'
import {createTestRootState} from '../../__tests__/fixtures/rootState'
import {inputByName, withinDialog} from '../../__tests__/fixtures/withinDialog'
import type {RootReducerState} from '../../modules/types'
import {assetsActions, initialState as assetsInitialState} from '../../modules/assets'
import type {AssetType, ImageAsset, MediaToolOptions} from '../../types'

const asset = {
  _id: 'a1',
  _type: 'sanity.imageAsset',
  _createdAt: '',
  _updatedAt: '',
  _rev: 'r1',
  originalFilename: 'x.png',
  size: 1,
  mimeType: 'image/png',
  url: 'https://example.com/x.png',
  metadata: {dimensions: {width: 100, height: 100}, isOpaque: true}
} as ImageAsset

const assetsPreloaded = {
  ...assetsInitialState,
  assetTypes: ['image'] as AssetType[],
  allIds: ['a1'],
  byIds: {
    a1: {_type: 'asset' as const, asset, picked: false, updating: false}
  }
}

vi.mock('sanity', async importOriginal => {
  const actual = await importOriginal<typeof import('sanity')>()
  return {
    ...actual,
    WithReferringDocuments: ({children}: {children: (args: unknown) => unknown}) =>
      children({isLoading: false, referringDocuments: []}),
    useDocumentStore: () => ({})
  }
})

vi.mock('../../hooks/useVersionedClient', () => ({
  default: () =>
    createMockSanityClient({
      listen: vi.fn(() => new Subject())
    })
}))

function renderAssetDialog(
  dialog: {id: string; type: 'assetEdit'; assetId: string},
  opts: {
    preloaded?: Partial<RootReducerState>
    toolOptions?: Partial<MediaToolOptions>
  } = {}
) {
  const {preloaded: extraPreloaded, toolOptions} = opts
  return renderWithProviders(
    <DialogAssetEdit dialog={dialog}>
      <span />
    </DialogAssetEdit>,
    {
      preloaded: {
        assets: assetsPreloaded,
        ...extraPreloaded
      },
      toolOptions: {creditLine: {enabled: true}, ...toolOptions}
    }
  )
}

describe('DialogAssetEdit', () => {
  it('renders asset details header and details tab', () => {
    renderAssetDialog({
      id: 'dlg-1',
      type: 'assetEdit',
      assetId: 'a1'
    })

    const dlg = withinDialog(/asset details/i, screen)
    expect(dlg.getByText('Asset details')).toBeInTheDocument()
    expect(dlg.getByRole('tab', {name: 'Details'})).toBeInTheDocument()
  })

  it('keeps Save disabled until a field is edited', () => {
    renderAssetDialog({
      id: 'dlg-1',
      type: 'assetEdit',
      assetId: 'a1'
    })

    const dlg = withinDialog(/asset details/i, screen)
    expect(dlg.getByRole('button', {name: /save and close/i})).toBeDisabled()
  })

  it('dispatches asset update when a field changes and the form is submitted', async () => {
    const user = userEvent.setup()
    const {store} = renderAssetDialog({
      id: 'dlg-1',
      type: 'assetEdit',
      assetId: 'a1'
    })
    const dispatchSpy = vi.spyOn(store, 'dispatch')
    const dlg = withinDialog(/asset details/i, screen)

    await user.type(inputByName(/asset details/i, screen, 'title'), 'Hero image')
    await user.click(dlg.getByRole('button', {name: /save and close/i}))

    expect(store.getState().assets.byIds.a1.updating).toBe(true)

    await waitFor(() => {
      let updateAction
      for (const call of dispatchSpy.mock.calls) {
        const action = call[0]
        if (assetsActions.updateRequest.match(action)) {
          updateAction = action
          break
        }
      }
      expect(updateAction).toBeDefined()
      expect(updateAction?.payload).toMatchObject({
        asset,
        closeDialogId: 'a1',
        formData: expect.objectContaining({
          title: 'Hero image',
          originalFilename: 'x.png'
        })
      })
    })
  })

  it('removes only this dialog when closed', async () => {
    const user = userEvent.setup()
    const base = createTestRootState({
      dialog: {
        items: [
          {id: 'dlg-1', type: 'assetEdit', assetId: 'a1'},
          {id: 'tags', type: 'tags'}
        ]
      },
      assets: assetsPreloaded
    })

    const {store} = renderWithProviders(
      <DialogAssetEdit
        dialog={{
          id: 'dlg-1',
          type: 'assetEdit',
          assetId: 'a1'
        }}
      >
        <span />
      </DialogAssetEdit>,
      {
        preloaded: base,
        toolOptions: {creditLine: {enabled: true}}
      }
    )

    const dlg = withinDialog(/asset details/i, screen)
    await user.click(dlg.getByRole('button', {name: /close dialog/i}))

    expect(store.getState().dialog.items).toEqual([{id: 'tags', type: 'tags'}])
  })

  it('opens the delete confirmation dialog when Delete is clicked', async () => {
    const {store} = renderAssetDialog({
      id: 'dlg-1',
      type: 'assetEdit',
      assetId: 'a1'
    })

    const dlg = withinDialog(/asset details/i, screen)
    fireEvent.click(dlg.getByRole('button', {name: /^delete$/i}))

    await waitFor(() => {
      let confirm
      for (const d of store.getState().dialog.items) {
        if (d.type === 'confirm') {
          confirm = d
          break
        }
      }
      expect(confirm).toBeDefined()
      expect(confirm?.title).toMatch(/permanently delete/i)
      expect(confirm?.headerTitle).toBe('Confirm deletion')
    })
  })

  it('switches to the References tab when that tab is activated', async () => {
    const user = userEvent.setup()
    renderAssetDialog({
      id: 'dlg-1',
      type: 'assetEdit',
      assetId: 'a1'
    })

    const dlg = withinDialog(/asset details/i, screen)
    const referencesTab = dlg.getByRole('tab', {name: /references/i})
    expect(referencesTab).toHaveAttribute('aria-selected', 'false')

    await user.click(referencesTab)

    expect(referencesTab).toHaveAttribute('aria-selected', 'true')
    expect(dlg.getByRole('tab', {name: 'Details'})).toHaveAttribute('aria-selected', 'false')
  })
})
