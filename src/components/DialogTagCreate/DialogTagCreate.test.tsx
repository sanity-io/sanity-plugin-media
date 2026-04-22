import userEvent from '@testing-library/user-event'
import {screen, waitFor} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import DialogTagCreate from './index'
import {renderWithProviders} from '../../__tests__/fixtures/renderWithProviders'
import {createTestRootState} from '../../__tests__/fixtures/rootState'
import {getDialogRoot, inputByName, withinDialog} from '../../__tests__/fixtures/withinDialog'
import {tagsActions} from '../../modules/tags'

describe('DialogTagCreate', () => {
  it('dispatches tag create flow when form is valid', async () => {
    const user = userEvent.setup()
    const {store} = renderWithProviders(
      <DialogTagCreate dialog={{id: 'dlg-1', type: 'tagCreate'}}>
        <span />
      </DialogTagCreate>
    )

    const dlg = withinDialog(/create tag/i, screen)
    await user.type(inputByName(/create tag/i, screen, 'name'), 'my-tag')
    await user.click(dlg.getByRole('button', {name: /save and close/i}))

    expect(store.getState().tags.creating).toBe(true)
  })

  it('dispatches createRequest with a trimmed tag name', async () => {
    const user = userEvent.setup()
    const {store} = renderWithProviders(
      <DialogTagCreate dialog={{id: 'dlg-1', type: 'tagCreate'}}>
        <span />
      </DialogTagCreate>
    )
    const dispatchSpy = vi.spyOn(store, 'dispatch')
    const dlg = withinDialog(/create tag/i, screen)

    await user.type(inputByName(/create tag/i, screen, 'name'), '  spaced  ')
    await user.click(dlg.getByRole('button', {name: /save and close/i}))

    await waitFor(() => {
      const createAction = dispatchSpy.mock.calls.map(([a]) => a).find(tagsActions.createRequest.match)
      expect(createAction).toBeDefined()
      expect(createAction?.payload).toEqual({name: 'spaced'})
    })
  })

  it('keeps Save disabled until the name is non-empty and valid', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <DialogTagCreate dialog={{id: 'dlg-1', type: 'tagCreate'}}>
        <span />
      </DialogTagCreate>
    )

    expect(
      withinDialog(/create tag/i, screen).getByRole('button', {name: /save and close/i})
    ).toBeDisabled()

    const nameInput = inputByName(/create tag/i, screen, 'name')
    await user.type(nameInput, 'a')
    await user.tab()
    await waitFor(() => {
      expect(
        withinDialog(/create tag/i, screen).getByRole('button', {name: /save and close/i})
      ).not.toBeDisabled()
    })
  })

  it('clears the entire dialog stack when the dialog close control is used', async () => {
    const user = userEvent.setup()
    const base = createTestRootState({
      dialog: {
        items: [
          {id: 'dlg-1', type: 'tagCreate'},
          {id: 'tags', type: 'tags'}
        ]
      }
    })

    const {store} = renderWithProviders(
      <DialogTagCreate dialog={{id: 'dlg-1', type: 'tagCreate'}}>
        <span />
      </DialogTagCreate>,
      {preloaded: base}
    )

    const dlg = withinDialog(/create tag/i, screen)
    await user.click(dlg.getByRole('button', {name: /close dialog/i}))

    expect(store.getState().dialog.items).toEqual([])
  })

  it('shows an error indicator beside the name when tag creation failed on the server', async () => {
    const base = createTestRootState({
      tags: {
        ...createTestRootState().tags,
        creatingError: {message: 'Tag already exists', statusCode: 409}
      }
    })

    renderWithProviders(
      <DialogTagCreate dialog={{id: 'dlg-1', type: 'tagCreate'}}>
        <span />
      </DialogTagCreate>,
      {preloaded: base}
    )

    await waitFor(() => {
      expect(
        getDialogRoot(/create tag/i, screen).querySelector('[data-sanity-icon="error-outline"]')
      ).toBeTruthy()
    })
  })
})
