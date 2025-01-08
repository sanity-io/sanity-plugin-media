import {css} from 'styled-components'

export const pdfToolbarStyles = css`
  :root {
    --rpv-drop__area-background-color: #fff;
    --rpv-drop__area-body-border-color: rgba(0, 0, 0, 0.3);
    --rpv-drop__area-body-color: #000;
  }
  .rpv-core__viewer--dark {
    --rpv-drop__area-background-color: #191919;
    --rpv-drop__area-body-border-color: #fff;
    --rpv-drop__area-body-color: #fff;
  }
  .rpv-drop__area {
    background-color: var(--rpv-drop__area-background-color);
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    padding: 0.5rem;
    z-index: 9999;
  }
  .rpv-drop__area-body {
    border: 2px dashed var(--rpv-drop__area-body-border-color);
    color: var(--rpv-drop__area-body-color);
    font-size: 1.5rem;
    align-items: center;
    display: flex;
    justify-content: center;
    height: 100%;
  }
  .rpv-drop__area-body--rtl {
    direction: rtl;
  }
  :root {
    --rpv-full-screen__overlay-background-color: #fff;
  }
  .rpv-core__viewer--dark {
    --rpv-full-screen__overlay-background-color: #1a1a1a;
  }
  .rpv-full-screen__exit-button {
    bottom: 0;
    padding: 0.5rem;
    position: fixed;
    z-index: 2;
  }
  .rpv-full-screen__exit-button--ltr {
    right: 0;
  }
  .rpv-full-screen__exit-button--rtl {
    left: 0;
  }
  .rpv-full-screen__overlay {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    align-items: center;
    display: flex;
    justify-content: center;
    background-color: var(--rpv-full-screen__overlay-background-color);
    z-index: 1;
  }
  .rpv-open__input-wrapper {
    position: relative;
  }
  .rpv-open__input {
    display: none;
    bottom: 0;
    cursor: pointer;
    height: 100%;
    left: 0;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
  }
  .rpv-open__input::-webkit-file-upload-button {
    width: 0;
  }
  .rpv-page-navigation__current-page-input {
    margin: 0 0.25rem;
    text-align: right;
    width: 3rem;
  }
  :root {
    --rpv-print__progress-body-background-color: #fff;
    --rpv-print__progress-body-border-color: rgba(0, 0, 0, 0.3);
    --rpv-print__progress-body-color: #000;
  }
  .rpv-core__viewer--dark {
    --rpv-print__progress-body-background-color: #363636;
    --rpv-print__progress-body-border-color: transparent;
    --rpv-print__progress-body-color: #fff;
  }
  .rpv-print__permission-body {
    padding: 1rem;
  }
  .rpv-print__permission-footer {
    display: flex;
    justify-content: center;
    padding: 0 1rem 1rem 0;
  }
  .rpv-print__progress {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 9999;
  }
  .rpv-print__progress-body {
    background-color: var(--rpv-print__progress-body-background-color);
    border: 1px solid var(--rpv-print__progress-body-border-color);
    border-radius: 0.25rem;
    color: var(--rpv-print__progress-body-color);
    padding: 1.5rem;
    text-align: center;
    width: 15rem;
  }
  .rpv-print__progress-body--rtl {
    direction: rtl;
  }
  .rpv-print__progress-bar {
    margin-bottom: 1rem;
  }
  .rpv-print__progress-message {
    margin-bottom: 0.5rem;
  }
  .rpv-print__zone {
    display: none;
  }
  @media print {
    @page {
      margin: 0;
    }
    .rpv-print__html-printing {
      height: 100%;
    }
    .rpv-print__body-printing {
      height: 100%;
      margin: 0;
    }
    .rpv-print__body-printing * {
      display: none;
    }
    .rpv-print__zone {
      display: block;
      height: 100%;
    }
    .rpv-print__page {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      width: 100%;
      page-break-after: always;
      page-break-inside: avoid;
    }
    .rpv-print__page img {
      display: block;
      max-height: 100%;
      max-width: 100%;
    }
  }
  .rpv-properties__loader {
    text-align: center;
  }
  .rpv-properties__modal {
    min-height: 20rem;
    padding: 0.5rem 0;
  }
  .rpv-properties__modal-section {
    padding: 0 0.5rem;
  }
  .rpv-properties__modal-footer {
    display: flex;
    justify-content: center;
    margin-top: 0.5rem;
  }
  .rpv-properties__item {
    align-items: flex-start;
    display: flex;
    margin: 0.5rem 0;
  }
  .rpv-properties__item--rtl {
    direction: rtl;
  }
  .rpv-properties__item-label {
    padding-right: 0.5rem;
    width: 25%;
  }
  .rpv-properties__item-value {
    flex: 1;
  }
  .rpv-search__highlights {
    left: 0;
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
  }
  .rpv-search__highlight {
    background-color: var(--rpv-search__highlight-background-color);
    border-radius: 0.25rem;
    position: absolute;
    z-index: 1;
  }
  .rpv-search__highlight--current {
    background-color: var(--rpv-search__highlight--current-background-color);
  }
  .rpv-search__popover {
    padding: 0 0.5rem;
  }
  .rpv-search__popover-input-counter {
    align-items: center;
    display: flex;
    margin-bottom: 0.5rem;
    position: relative;
    width: 12rem;
  }
  .rpv-search__popover-counter {
    align-items: center;
    bottom: 0;
    display: flex;
    position: absolute;
    top: 0;
  }
  .rpv-search__popover-counter--ltr {
    padding-right: 0.25rem;
    right: 0;
  }
  .rpv-search__popover-counter--rtl {
    left: 0;
    padding-left: 0.25rem;
  }
  .rpv-search__popover-label {
    align-items: center;
    cursor: pointer;
    display: flex;
    margin-bottom: 0.5rem;
  }
  .rpv-search__popover-label-checkbox {
    cursor: pointer;
    margin-right: 0.25rem;
  }
  .rpv-search__popover-footer {
    align-items: center;
    display: flex;
  }
  .rpv-search__popover-footer-item {
    padding: 0 0.25rem;
  }
  .rpv-search__popover-footer-button--ltr {
    margin-left: auto;
  }
  .rpv-search__popover-footer-button--rtl {
    margin-right: auto;
  }
  :root {
    --rpv-search__highlight-background-color: rgba(255, 255, 0, 0.4);
    --rpv-search__highlight--current-background-color: rgba(0, 128, 0, 0.4);
  }
  .rpv-selection-mode__grab {
    cursor: grab;
  }
  .rpv-selection-mode__grab :not(input),
  .rpv-selection-mode__grab :not(select),
  .rpv-selection-mode__grab :not(textarea) {
    cursor: grab !important;
  }
  .rpv-selection-mode__grabbing {
    cursor: grabbing;
  }
  .rpv-selection-mode__grabbing :not(input),
  .rpv-selection-mode__grabbing :not(select),
  .rpv-selection-mode__grabbing :not(textarea) {
    cursor: grabbing !important;
  }
  :root {
    --rpv-zoom__popover-target-arrow-border-color: rgba(0, 0, 0, 0.6);
  }
  .rpv-core__viewer--dark {
    --rpv-zoom__popover-target-arrow-border-color: #fff;
  }
  .rpv-zoom__popover-target {
    align-items: center;
    color: var(--rpv-zoom__popover-target-color);
    display: flex;
  }
  .rpv-zoom__popover-target-scale--ltr {
    margin-right: 0.25rem;
  }
  .rpv-zoom__popover-target-scale--rtl {
    margin-left: 0.25rem;
  }
  .rpv-zoom__popover-target-arrow {
    border-color: var(--rpv-zoom__popover-target-arrow-border-color) rgba(0, 0, 0, 0)
      rgba(0, 0, 0, 0);
    border-style: solid;
    border-width: 0.5rem 0.25rem 0;
    height: 0;
    width: 0;
  }
  :root {
    --rpv-toolbar__label--color: #000;
  }
  .rpv-core__viewer--dark {
    --rpv-toolbar__label--color: #fff;
  }
  .rpv-toolbar {
    align-items: center;
    display: flex;
    width: 100%;
  }
  .rpv-toolbar--rtl {
    direction: rtl;
  }
  .rpv-toolbar__left {
    align-items: center;
    display: flex;
  }
  .rpv-toolbar__center {
    align-items: center;
    display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    justify-content: center;
  }
  .rpv-toolbar__right {
    align-items: center;
    display: flex;
    margin-left: auto;
  }
  .rpv-toolbar__item {
    align-items: center;
    display: flex;
    padding: 0 0.125rem;
  }
  .rpv-toolbar__label {
    color: var(--rpv-toolbar__label--color);
  }
`