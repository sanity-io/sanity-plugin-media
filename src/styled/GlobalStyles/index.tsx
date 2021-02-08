import {createGlobalStyle, css} from 'styled-components'

const customScrollbar = css`
  ::-webkit-scrollbar {
    width: 14px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    border: 4px solid rgba(0, 0, 0, 0);
    background: #444;
    background-clip: padding-box;

    &:hover {
      background: #aaa;
      background-clip: padding-box;
    }
  }
`

const GlobalStyle = createGlobalStyle`
  .media-custom-scrollbar {
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

`

export default GlobalStyle
