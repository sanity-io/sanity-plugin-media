import {css} from 'styled-components'

export const pdfCoreStyles = css`
  :root {
    --rpv-core__annotation--link-hover-background-color: rgba(255, 255, 0, 0.2);
    --rpv-core__annotation-popup-wrapper-background-color: #faf089;
    --rpv-core__annotation-popup-wrapper-box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --rpv-core__annotation-popup-content-border-top-color: #1a202c;
    --rpv-core__arrow-border-color: rgba(0, 0, 0, 0.3);
    --rpv-core__asking-password-color: #000;
    --rpv-core__asking-password-wrapper-background-color: #fff;
    --rpv-core__asking-password-wrapper-border-color: rgba(0, 0, 0, 0.3);
    --rpv-core__button-background-color: rgba(0, 0, 0, 0.3);
    --rpv-core__button-color: #000;
    --rpv-core__doc-error-background-color: #fff;
    --rpv-core__doc-error-text-background-color: #c02424;
    --rpv-core__doc-error-text-color: #fff;
    --rpv-core__doc-loading-background-color: #fff;
    --rpv-core__full-screen-target-background-color: #fff;
    --rpv-core__inner-page-background-color: #fff;
    --rpv-core__menu-divider-border-bottom-color: rgba(0, 0, 0, 0.3);
    --rpv-core__menu-item-color: #000;
    --rpv-core__menu-item--hover-background-color: rgba(0, 0, 0, 0.1);
    --rpv-core__menu-item--disabled-color: rgba(0, 0, 0, 0.3);
    --rpv-core__minimal-button-color: #000;
    --rpv-core__minimal-button--hover-background-color: rgba(0, 0, 0, 0.1);
    --rpv-core__minimal-button--disabled-color: rgba(0, 0, 0, 0.3);
    --rpv-core__minimal-button--selected-background-color: rgba(0, 0, 0, 0.1);
    --rpv-core__modal-body-background-color: #fff;
    --rpv-core__modal-body-border-color: rgba(0, 0, 0, 0.3);
    --rpv-core__modal-overlay-background-color: rgba(0, 0, 0, 0.5);
    --rpv-core__page-layer-box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.2);
    --rpv-core__popover-body-background-color: #fff;
    --rpv-core__popover-body-border-color: rgba(0, 0, 0, 0.3);
    --rpv-core__popover-body-color: #000;
    --rpv-core__primary-button-background-color: #2566e8;
    --rpv-core__primary-button-color: #fff;
    --rpv-core__progress-bar-background-color: rgba(0, 0, 0, 0.1);
    --rpv-core__progress-bar-progress-background-color: #2566e8;
    --rpv-core__progress-bar-progress-color: #fff;
    --rpv-core__separator-border-bottom-color: rgba(0, 0, 0, 0.3);
    --rpv-core__spinner-border-color: rgba(0, 0, 0, 0.4);
    --rpv-core__spinner-border-transparent-color: transparent;
    --rpv-core__splitter-background-color: transparent;
    --rpv-core__splitter--hover-background-color: rgba(0, 0, 0, 0.2);
    --rpv-core__text-layer-text--selection-background-color: rgb(0, 0, 255, 1);
    --rpv-core__text-layer-text--selection-color: transparent;
    --rpv-core__textbox-background-color: #fff;
    --rpv-core__textbox-border-color: rgba(0, 0, 0, 0.2);
    --rpv-core__textbox-color: #000;
    --rpv-core__tooltip-body-background-color: #000;
    --rpv-core__tooltip-body-color: #fff;
  }
  .rpv-core__viewer--dark {
    --rpv-core__asking-password-background-color: #363636;
    --rpv-core__asking-password-color: #fff;
    --rpv-core__asking-password-wrapper-border-color: #191919;
    --rpv-core__asking-password-wrapper-background-color: #191919;
    --rpv-core__button-background-color: #171717;
    --rpv-core__button-color: #fff;
    --rpv-core__doc-error-background-color: #191919;
    --rpv-core__doc-error-text-background-color: #c02323;
    --rpv-core__doc-error-text-color: #fff;
    --rpv-core__doc-loading-background-color: #191919;
    --rpv-core__full-screen-target-background-color: #1a1a1a;
    --rpv-core__inner-page-background-color: #1a1a1a;
    --rpv-core__menu-divider-border-bottom-color: #000;
    --rpv-core__menu-item-color: #fff;
    --rpv-core__menu-item--hover-background-color: #2566e8;
    --rpv-core__menu-item--disabled-color: #5e5e5e;
    --rpv-core__minimal-button-color: #fff;
    --rpv-core__minimal-button--disabled-color: #5e5e5e;
    --rpv-core__minimal-button--hover-background-color: #191919;
    --rpv-core__minimal-button--selected-background-color: #1657bb;
    --rpv-core__modal-body-background-color: #363636;
    --rpv-core__primary-button-background-color: #2566e8;
    --rpv-core__popover-body-background-color: #363636;
    --rpv-core__popover-body-color: #fff;
    --rpv-core__progress-bar-background-color: #000;
    --rpv-core__separator-border-bottom-color: #000;
    --rpv-core__spinner-border-color: #fff;
    --rpv-core__splitter-background-color: #1a1a1a;
    --rpv-core__splitter--hover-background-color: #2566e8;
    --rpv-core__textbox-background-color: #121212;
    --rpv-core__textbox-border-color: #121212;
    --rpv-core__textbox-color: #fff;
    --rpv-core__tooltip-body-background-color: #414141;
    --rpv-core__tooltip-body-color: #fff;
  }
  .rpv-core__annotation {
    position: absolute;
  }
  .rpv-core__annotation-layer {
    z-index: 1;
  }
  .rpv-core__arrow {
    border-bottom: 1px solid var(--rpv-core__arrow-border-color);
    border-left-color: var(--rpv-core__arrow-border-color);
    border-right: 1px solid var(--rpv-core__arrow-border-color);
    border-top-color: var(--rpv-core__arrow-border-color);
    height: 10px;
    position: absolute;
    width: 10px;
    z-index: 0;
  }
  .rpv-core__arrow--tl {
    bottom: 0;
    left: 0;
    transform: translate(50%, 50%) rotate(45deg);
  }
  .rpv-core__arrow--tc {
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%) rotate(45deg);
  }
  .rpv-core__arrow--tr {
    bottom: 0;
    right: 0;
    transform: translate(-50%, 50%) rotate(45deg);
  }
  .rpv-core__arrow--rt {
    left: 0;
    top: 0;
    transform: translate(-50%, 50%) rotate(135deg);
  }
  .rpv-core__arrow--rc {
    left: 0;
    top: 50%;
    transform: translate(-50%, -50%) rotate(135deg);
  }
  .rpv-core__arrow--rb {
    bottom: 0;
    left: 0;
    transform: translate(-50%, -50%) rotate(135deg);
  }
  .rpv-core__arrow--bl {
    left: 0;
    top: 0;
    transform: translate(50%, -50%) rotate(225deg);
  }
  .rpv-core__arrow--bc {
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%) rotate(225deg);
  }
  .rpv-core__arrow--br {
    right: 0;
    top: 0;
    transform: translate(-50%, -50%) rotate(225deg);
  }
  .rpv-core__arrow--lt {
    right: 0;
    top: 0;
    transform: translate(50%, 50%) rotate(315deg);
  }
  .rpv-core__arrow--lc {
    right: 0;
    top: 50%;
    transform: translate(50%, -50%) rotate(315deg);
  }
  .rpv-core__arrow--lb {
    bottom: 0;
    right: 0;
    transform: translate(50%, -50%) rotate(315deg);
  }
  .rpv-core__asking-password {
    background-color: var(--rpv-core__asking-password-background-color);
    border-radius: 0.25rem;
    color: var(--rpv-core__asking-password-color);
    padding: 2rem;
  }
  .rpv-core__asking-password--rtl {
    direction: rtl;
  }
  .rpv-core__asking-password-wrapper {
    align-items: center;
    background-color: var(--rpv-core__asking-password-wrapper-background-color);
    border: 1px solid var(--rpv-core__asking-password-wrapper-border-color);
    display: flex;
    height: 100%;
    justify-content: center;
    width: 100%;
  }
  .rpv-core__asking-password-message {
    margin: 0.5rem 0;
  }
  .rpv-core__asking-password-body {
    align-items: center;
    display: flex;
    justify-content: center;
  }
  .rpv-core__asking-password-input {
    width: 15rem;
  }
  .rpv-core__asking-password-input--ltr {
    margin-right: 0.5rem;
  }
  .rpv-core__asking-password-input--rtl {
    margin-left: 0.5rem;
  }
  .rpv-core__button {
    background-color: var(--rpv-core__button-background-color);
    border: none;
    border-radius: 0.25rem;
    color: var(--rpv-core__button-color);
    cursor: pointer;
    height: 2rem;
    padding: 0 1rem;
  }
  .rpv-core__button--rtl {
    direction: rtl;
  }
  .rpv-core__canvas-layer {
    direction: ltr;
    left: 0;
    position: absolute;
    overflow: hidden;
    top: 0;
  }
  .rpv-core__doc-error {
    align-items: center;
    background-color: var(--rpv-core__doc-error-background-color);
    display: flex;
    justify-content: center;
    height: 100%;
  }
  .rpv-core__doc-error--rtl {
    direction: rtl;
  }
  .rpv-core__doc-error-text {
    background-color: var(--rpv-core__doc-error-text-background-color);
    border-radius: 0.25rem;
    color: var(--rpv-core__doc-error-text-color);
    line-height: 1.5;
    max-width: 50%;
    padding: 0.5rem;
  }
  .rpv-core__doc-loading {
    background-color: var(--rpv-core__doc-loading-background-color);
    align-items: center;
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
    min-height: inherit;
  }
  .rpv-core__doc-loading--rtl {
    direction: rtl;
  }
  .rpv-core__icon {
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1;
    text-align: center;
  }
  .rpv-core__icon--rtl {
    transform: scale(-1, 1);
  }
  .rpv-core__inner-container {
    min-height: inherit;
  }
  .rpv-core__inner-pages {
    overflow: auto;
  }
  .rpv-core__inner-pages--rtl {
    direction: rtl;
  }
  .rpv-core__inner-pages--single {
    overflow: hidden;
  }
  .rpv-core__inner-page-container--single {
    overflow: auto;
  }
  .rpv-core__inner-page {
    background-color: var(--rpv-core__inner-page-background-color);
  }
  .rpv-core__inner-page--single {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rpv-core__inner-page--dual-even {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .rpv-core__inner-page--dual-odd {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .rpv-core__inner-page--dual-cover {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rpv-core__inner-page--dual-cover-odd {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .rpv-core__inner-page--dual-cover-even {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .rpv-core__annotation--link a {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
  .rpv-core__annotation--link a:hover {
    background-color: var(--rpv-core__annotation--link-hover-background-color);
  }
  .rpv-core__menu {
    display: flex;
    flex-direction: column;
  }
  .rpv-core__menu--rtl {
    direction: rtl;
    text-align: right;
  }
  .rpv-core__menu-divider {
    border-bottom: 1px solid var(--rpv-core__menu-divider-border-bottom-color);
    margin: 0.25rem 0;
  }
  .rpv-core__menu-item {
    align-items: center;
    background-color: rgba(0, 0, 0, 0);
    color: var(--rpv-core__menu-item-color);
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    padding: 0.25rem 0;
    width: 100%;
  }
  .rpv-core__menu-item:focus {
    background-color: var(--rpv-core__menu-item--hover-background-color);
    outline: 0;
  }
  .rpv-core__menu-item:hover {
    background-color: var(--rpv-core__menu-item--hover-background-color);
  }
  .rpv-core__menu-item-icon {
    align-items: center;
    display: flex;
  }
  .rpv-core__menu-item-icon--ltr {
    padding-left: 1rem;
    padding-right: 0.5rem;
  }
  .rpv-core__menu-item-icon--rtl {
    padding-left: 0.5rem;
    padding-right: 1rem;
  }
  .rpv-core__menu-item-label {
    flex-grow: 1;
    flex-shrink: 1;
    white-space: nowrap;
  }
  .rpv-core__menu-item-label--ltr {
    padding-right: 2rem;
  }
  .rpv-core__menu-item-label--rtl {
    padding-left: 2rem;
  }
  .rpv-core__menu-item-check--ltr {
    padding-right: 1rem;
  }
  .rpv-core__menu-item-check--rtl {
    padding-left: 1rem;
  }
  .rpv-core__menu-item--disabled {
    color: var(--rpv-core__menu-item--disabled-color);
  }
  .rpv-core__menu-item--disabled:hover {
    background-color: rgba(0, 0, 0, 0);
  }
  .rpv-core__menu-item--ltr {
    text-align: left;
  }
  .rpv-core__menu-item--rtl {
    direction: rtl;
    text-align: right;
  }
  .rpv-core__minimal-button {
    background-color: rgba(0, 0, 0, 0);
    border: none;
    border-radius: 0.25rem;
    color: var(--rpv-core__minimal-button-color);
    cursor: pointer;
    height: 2rem;
    padding: 0 0.5rem;
  }
  .rpv-core__minimal-button:hover {
    background-color: var(--rpv-core__minimal-button--hover-background-color);
  }
  .rpv-core__minimal-button--disabled {
    color: var(--rpv-core__minimal-button--disabled-color);
  }
  .rpv-core__minimal-button--rtl {
    direction: rtl;
  }
  .rpv-core__minimal-button--selected {
    background-color: var(--rpv-core__minimal-button--selected-background-color);
  }
  .rpv-core__modal-body {
    background-color: var(--rpv-core__modal-body-background-color);
    border: 1px solid var(--rpv-core__modal-body-border-color);
    border-radius: 0.25rem;
    margin: 1rem;
    max-width: 32rem;
    overflow: auto;
  }
  .rpv-core__modal-body--rtl {
    direction: rtl;
  }
  .rpv-core__modal-overlay {
    background-color: var(--rpv-core__modal-overlay-background-color);
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 9999;
    align-items: center;
    display: flex;
    justify-content: center;
  }
  .rpv-core__page-layer {
    align-items: center;
    display: flex;
    justify-content: center;
    overflow: visible;
    position: relative;
  }
  .rpv-core__page-layer::after {
    content: '';
    position: absolute;
    bottom: 0.25rem;
    left: 0.25rem;
    right: 0.25rem;
    top: 0.25rem;
    box-shadow: var(--rpv-core__page-layer-box-shadow);
  }
  .rpv-core__page-layer--single {
    margin: 0 auto;
  }
  .rpv-core__page-size-calculator {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    width: 100%;
  }
  .rpv-core__popover-body {
    background-color: var(--rpv-core__popover-body-background-color);
    border: 1px solid var(--rpv-core__popover-body-border-color);
    border-radius: 0.25rem;
    color: var(--rpv-core__popover-body-color);
    left: 0;
    padding: 0.5rem 0;
    position: absolute;
    top: -9999px;
    z-index: 9999;
  }
  .rpv-core__popover-body-arrow {
    background-color: var(--rpv-core__popover-body-background-color);
  }
  .rpv-core__popover-body--rtl {
    direction: rtl;
  }
  .rpv-core__popover-overlay {
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
  }
  .rpv-core__annotation-popup-wrapper {
    background-color: var(--rpv-core__annotation-popup-wrapper-background-color);
    box-shadow: var(--rpv-core__annotation-popup-wrapper-box-shadow);
    font-size: 0.75rem;
    padding: 0.25rem;
    word-break: break-word;
  }
  .rpv-core__annotation-popup-wrapper--rtl {
    direction: rtl;
  }
  .rpv-core__annotation-popup-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  .rpv-core__annotation-popup-date {
    font-size: 0.5rem;
  }
  .rpv-core__annotation-popup-content {
    border-top: 1px solid var(--rpv-core__annotation-popup-content-border-top-color);
    padding: 0.25rem;
    max-height: 16rem;
    overflow: auto;
  }
  .rpv-core__primary-button {
    background-color: var(--rpv-core__primary-button-background-color);
    border: none;
    border-radius: 0.25rem;
    color: var(--rpv-core__primary-button-color);
    cursor: pointer;
    height: 2rem;
    padding: 0 1rem;
  }
  .rpv-core__primary-button--rtl {
    direction: rtl;
  }
  .rpv-core__progress-bar {
    background-color: var(--rpv-core__progress-bar-background-color);
    border-radius: 9999px;
    padding: 0.125rem;
  }
  .rpv-core__progress-bar--rtl {
    direction: rtl;
  }
  .rpv-core__progress-bar-progress {
    align-items: center;
    background-color: var(--rpv-core__progress-bar-progress-background-color);
    border-radius: 9999px;
    color: var(--rpv-core__progress-bar-progress-color);
    display: flex;
    font-size: 0.75rem;
    justify-content: center;
    height: 0.75rem;
  }
  .rpv-core__separator {
    border-bottom: 1px solid var(--rpv-core__separator-border-bottom-color);
  }
  .rpv-core__spinner {
    border-bottom: 2px solid var(--rpv-core__spinner-border-transparent-color);
    border-left: 2px solid var(--rpv-core__spinner-border-transparent-color);
    border-right: 2px solid var(--rpv-core__spinner-border-color);
    border-top: 2px solid var(--rpv-core__spinner-border-color);
    border-radius: 9999px;
  }
  .rpv-core__spinner--animating {
    animation-duration: 0.4s;
    animation-name: rpv-core__spinner-transform;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  @keyframes rpv-core__spinner-transform {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .rpv-core__splitter {
    background-color: var(--rpv-core__splitter-background-color);
    cursor: ew-resize;
    height: 100%;
    width: 0.25rem;
  }
  .rpv-core__splitter:hover,
  .rpv-core__splitter--resizing {
    cursor: col-resize;
    background-color: var(--rpv-core__splitter--hover-background-color);
  }
  .rpv-core__splitter-body--resizing {
    cursor: col-resize;
  }
  .rpv-core__splitter-sibling--resizing {
    pointer-events: none;
    user-select: none;
  }
  .rpv-core__textbox {
    background-color: var(--rpv-core__textbox-background-color);
    border: 1px solid var(--rpv-core__textbox-border-color);
    box-sizing: border-box;
    border-radius: 0.25rem;
    color: var(--rpv-core__textbox-color);
    padding: 0 0.5rem;
    height: 2rem;
    width: 100%;
  }
  .rpv-core__textbox--rtl {
    direction: rtl;
  }
  .rpv-core__text-layer {
    left: 0;
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    opacity: 0.2;
    line-height: 1;
    z-index: 1;
  }
  .rpv-core__text-layer span::selection {
    background-color: var(--rpv-core__text-layer-text--selection-background-color);
    color: var(--rpv-core__text-layer-text--selection-color);
  }
  .rpv-core__text-layer br::selection {
    color: rgba(0, 0, 0, 0);
  }
  .rpv-core__text-layer-text {
    color: rgba(0, 0, 0, 0);
    cursor: text;
    position: absolute;
    transform-origin: 0% 0%;
    white-space: pre;
  }
  .rpv-core__tooltip-body {
    background-color: var(--rpv-core__tooltip-body-background-color);
    border-radius: 0.25rem;
    color: var(--rpv-core__tooltip-body-color);
    left: 0;
    max-width: 20rem;
    position: absolute;
    text-align: center;
    top: -9999px;
    z-index: 9999;
  }
  .rpv-core__tooltip-body--rtl {
    direction: rtl;
  }
  .rpv-core__tooltip-body-arrow {
    background-color: var(--rpv-core__tooltip-body-background-color);
  }
  .rpv-core__tooltip-body-content {
    padding: 0.5rem;
  }
  .rpv-core__display--block {
    display: block;
  }
  .rpv-core__display--hidden {
    display: none;
  }
  @media (min-width: 640px) {
    .rpv-core__display--hidden-small {
      display: none;
    }
    .rpv-core__display--block-small {
      display: block;
    }
  }
  @media (min-width: 768px) {
    .rpv-core__display--hidden-medium {
      display: none;
    }
    .rpv-core__display--block-medium {
      display: block;
    }
  }
  @media (min-width: 1024px) {
    .rpv-core__display--hidden-large {
      display: none;
    }
    .rpv-core__display--block-large {
      display: block;
    }
  }
  .rpv-core__viewer {
    min-height: inherit;
  }
`
