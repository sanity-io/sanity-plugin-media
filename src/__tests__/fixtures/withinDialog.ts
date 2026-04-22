import {within, type Screen} from '@testing-library/react'

/** Topmost Sanity dialog matching `name` (handles animated duplicate layers). */
export function getDialogRoot(name: RegExp, base: Screen): HTMLElement {
  const dialogs = base.getAllByRole('dialog', {name})
  const el = dialogs.at(-1)
  if (!el) {
    throw new Error(`No dialog found matching ${name}`)
  }
  return el
}

/** Scoped queries for that dialog. */
export function withinDialog(name: RegExp, base: Screen) {
  return within(getDialogRoot(name, base))
}

/**
 * Sanity `TextInput` is not always exposed as a labellable control; use the native input by `name`.
 */
export function inputByName(dialogName: RegExp, base: Screen, name: string): HTMLInputElement {
  const root = getDialogRoot(dialogName, base)
  const input = root.querySelector(`input[name="${name}"]`)
  if (!input || !(input instanceof HTMLInputElement)) {
    throw new Error(`No input name="${name}" in dialog matching ${dialogName}`)
  }
  return input
}
