import {createGlobalStyle} from 'styled-components'

const GlobalStyle = createGlobalStyle`
  .media-custom-scrollbar {
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
  }
`

export default GlobalStyle
