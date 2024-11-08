import {createGlobalStyle, css} from 'styled-components'
import {pdfCoreStyles} from './pdf-core'
import {pdfToolbarStyles} from './pdf-toolbar'

export const customScrollbar = css`
  ::-webkit-scrollbar {
    width: 14px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    border: 4px solid rgba(0, 0, 0, 0);
    background: var(--card-border-color);
    background-clip: padding-box;

    &:hover {
      background: var(--card-muted-fg-color);
      background-clip: padding-box;
    }
  }
`

const GlobalStyle = createGlobalStyle`
  .media__custom-scrollbar {
    ${customScrollbar}
  }

  // @sanity/ui overrides

  // Custom scrollbar on Box (used in Dialogs)
  div[data-ui="Box"] {
    ${customScrollbar}
  }

  // Dialog background color
  div[data-ui="Dialog"] {
    background-color: rgba(15, 17, 18, 0.9);
  }

  .rpv-thumbnail__cover-image,
  .rpv-thumbnail__cover-inner,
  .rpv-thumbnail__cover {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media screen and (max-width: 974px) {
    .rpv-core__display--hidden {
      display: none;
    }
  }

  .media__custom-menu > div {
    position: relative !important;
    width: fit-content !important;
    min-width: 100% !important;
  }

  ${pdfCoreStyles}
  ${pdfToolbarStyles}
`

export default GlobalStyle
