import userEvent from '@testing-library/user-event'
import {fireEvent, screen, waitFor} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {Subject} from 'rxjs'
import DialogTagEdit from './index'
import {createMockSanityClient} from '../../__tests__/fixtures/mockSanityClient'
import {renderWithProviders} from '../../__tests__/fixtures/renderWithProviders'
import {createTestRootState} from '../../__tests__/fixtures/rootState'
import {inputByName, withinDialog} from '../../__tests__/fixtures/withinDialog'
import {tagsActions} from '../../modules/tags'
import type {Tag} from '../../types'

const tag: Tag = {
  _id: 't1',
  _type: 'media.tag',
  _createdAt: '',
  _updatedAt: '',
  _rev: 'r1',
  name: {_type: 'slug', current: 'alpha'}
}

const tagsPreloaded = {
  allIds: ['t1'],
  byIds: {
    t1: {_type: 'tag' as const, tag, picked: false, updating: false}
  },
  creating: false,
  fetchCount: -1,
  fetching: false,
  panelVisible: true
}

vi.mock('../../hooks/useVersionedClient', () => ({
  default: () =>
    createMockSanityClient({
      listen: vi.fn(() => new Subject())
    })
}))

describe('DialogTagEdit', () => {
  it('dispatches updateRequest when name changes and form submits', async () => {
    const user = userEvent.setup()
    const {store} = renderWithProviders(
      <DialogTagEdit dialog={{id: 'dlg-1', type: 'tagEdit', tagId: 't1'}}>
        <span />
      </DialogTagEdit>,
      {
        preloaded: {
          tags: tagsPreloaded
        }
      }
    )

    const dlg = withinDialog(/edit tag/i, screen)
    const input = inputByName(/edit tag/i, screen, 'name')
    await user.clear(input)
    await user.type(input, 'beta')
    await user.click(dlg.getByRole('button', {name: /save and close/i}))

    expect(store.getState().tags.byIds.t1.updating).toBe(true)
  })

  it('dispatches updateRequest with slug-shaped form data', async () => {
    const user = userEvent.setup()
    const {store} = renderWithProviders(
      <DialogTagEdit dialog={{id: 'dlg-1', type: 'tagEdit', tagId: 't1'}}>
        <span />
      </DialogTagEdit>,
      {
        preloaded: {
          tags: tagsPreloaded
        }
      }
    )
    const dispatchSpy = vi.spyOn(store, 'dispatch')
    const dlg = withinDialog(/edit tag/i, screen)

    const input = inputByName(/edit tag/i, screen, 'name')
    await user.clear(input)
    await user.type(input, 'gamma')
    await user.click(dlg.getByRole('button', {name: /save and close/i}))

    await waitFor(() => {
      const updateAction = dispatchSpy.mock.calls
        .map(([a]) => a)
        .find(tagsActions.updateRequest.match)
      expect(updateAction).toBeDefined()
      expect(updateAction?.payload).toMatchObject({
        closeDialogId: 't1',
        formData: {
          name: {_type: 'slug', current: 'gamma'}
        },
        tag
      })
    })
  })

  it('does not enable Save until the name is edited', () => {
    renderWithProviders(
      <DialogTagEdit dialog={{id: 'dlg-1', type: 'tagEdit', tagId: 't1'}}>
        <span />
      </DialogTagEdit>,
      {
        preloaded: {
          tags: tagsPreloaded
        }
      }
    )

    const dlg = withinDialog(/edit tag/i, screen)
    expect(dlg.getByRole('button', {name: /save and close/i})).toBeDisabled()
  })

  it('removes only this dialog when closed', async () => {
    const user = userEvent.setup()
    const base = createTestRootState({
      dialog: {
        items: [
          {id: 'dlg-1', type: 'tagEdit', tagId: 't1'},
          {id: 'tags', type: 'tags'}
        ]
      },
      tags: tagsPreloaded
    })

    const {store} = renderWithProviders(
      <DialogTagEdit dialog={{id: 'dlg-1', type: 'tagEdit', tagId: 't1'}}>
        <span />
      </DialogTagEdit>,
      {preloaded: base}
    )

    const dlg = withinDialog(/edit tag/i, screen)
    await user.click(dlg.getByRole('button', {name: /close dialog/i}))

    expect(store.getState().dialog.items).toEqual([{id: 'tags', type: 'tags'}])
  })

  it('opens the delete confirmation dialog when Delete is clicked', async () => {
    const {store} = renderWithProviders(
      <DialogTagEdit dialog={{id: 'dlg-1', type: 'tagEdit', tagId: 't1'}}>
        <span />
      </DialogTagEdit>,
      {
        preloaded: {
          tags: tagsPreloaded
        }
      }
    )

    const dlg = withinDialog(/edit tag/i, screen)
    fireEvent.click(dlg.getByRole('button', {name: /^delete$/i}))

    const confirm = store.getState().dialog.items.find(d => d.type === 'confirm')
    expect(confirm).toBeDefined()
    expect(confirm?.title).toMatch(/permanently delete/i)
    expect(confirm?.headerTitle).toBe('Confirm deletion')
  })
})
