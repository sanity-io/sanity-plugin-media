import {hues} from '@sanity/color'
import {type ThemeColorSchemeKey, studioTheme} from '@sanity/ui'

const SCHEME_COLORS = {
  bg: {
    dark: hues.gray[950].hex,
    light: hues.gray[50].hex
  },
  bg2: {
    dark: hues.gray[900].hex,
    light: hues.gray[100].hex
  },
  inputEnabledBorder: {
    dark: studioTheme.color.dark.default.input.default.enabled.border,
    light: studioTheme.color.light.default.input.default.enabled.border
  },
  inputHoveredBorder: {
    dark: studioTheme.color.dark.default.input.default.hovered.border,
    light: studioTheme.color.light.default.input.default.hovered.border
  },
  mutedHoveredBg: {
    dark: studioTheme.color.dark.primary.muted.primary.hovered.bg,
    light: studioTheme.color.light.primary.muted.primary.hovered.bg
  },
  mutedHoveredFg: {
    dark: studioTheme.color.dark.primary.muted.primary.hovered.fg,
    light: studioTheme.color.light.primary.muted.primary.hovered.fg
  },
  mutedSelectedBg: {
    dark: studioTheme.color.dark.primary.muted.primary.selected.bg,
    light: studioTheme.color.light.primary.muted.primary.selected.bg
  },
  spotBlue: {
    dark: studioTheme.color.dark.primary.spot.blue,
    light: studioTheme.color.light.primary.spot.blue
  }
}

type SchemeColorKey = keyof typeof SCHEME_COLORS

export function getSchemeColor(scheme: ThemeColorSchemeKey, colorKey: SchemeColorKey): string {
  return SCHEME_COLORS[colorKey]?.[scheme]
}
