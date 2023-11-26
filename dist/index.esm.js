import { useClient, useColorScheme, useSchema, Preview, useColorSchemeValue, useDocumentStore, WithReferringDocuments, useFormValue, definePlugin } from 'sanity';
import { forwardRef, createElement, useRef, useCallback, useEffect, createContext, useContext, useState, useMemo, memo, Component } from 'react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Inline, Button, usePortal, MenuButton, Menu as Menu$2, MenuItem, MenuDivider, Box, studioTheme, rem, Flex, Label, Text, TextInput, Card, MenuGroup, useMediaIndex, Tooltip, Switch, Popover, Stack, Dialog as Dialog$1, TextArea, Autocomplete, TabList, Tab, TabPanel, Container as Container$2, Spinner, Checkbox, Grid, useToast, ThemeProvider, ToastProvider, PortalProvider, useLayer, Portal } from '@sanity/ui';
import isHotkey from 'is-hotkey';
import groq from 'groq';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { createAction, createSlice, createSelector, combineReducers, configureStore } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { ofType, combineEpics, createEpicMiddleware } from 'redux-observable';
import { iif, throwError, of, from, empty, merge, Subject, Observable } from 'rxjs';
import { delay, mergeMap, filter, withLatestFrom, catchError, switchMap, bufferTime, debounceTime, first, map, takeUntil } from 'rxjs/operators';
import { uuid } from '@sanity/uuid';
import styled, { css, createGlobalStyle } from 'styled-components';
import pluralize from 'pluralize';
import { useNProgress } from '@tanem/react-nprogress';
import Select, { components } from 'react-select';
import { Virtuoso, VirtuosoGrid, GroupedVirtuoso } from 'react-virtuoso';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import format from 'date-fns/format';
import filesize from 'filesize';
import copy from 'copy-to-clipboard';
import { useIntentLink } from 'sanity/router';
import { FileIcon as FileIcon$1, defaultStyles } from 'react-file-icon';
import CreatableSelect from 'react-select/creatable';
import { useDebounce } from 'usehooks-ts';
import formatRelative from 'date-fns/formatRelative';
import { useDropzone } from 'react-dropzone';
const AccessDeniedIcon = forwardRef(function AccessDeniedIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "access-denied",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M18.1568 6.84315C21.281 9.96734 21.281 15.0327 18.1568 18.1569C15.0326 21.281 9.96733 21.281 6.84313 18.1569C3.71894 15.0327 3.71894 9.96734 6.84313 6.84315C9.96733 3.71895 15.0326 3.71895 18.1568 6.84315ZM18.1568 6.84315L6.844 18.156",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ActivityIcon = forwardRef(function ActivityIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "activity",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M21 15H19L15.5 7L11 18L8 12L6 15H4",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const AddCircleIcon = forwardRef(function AddCircleIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "add-circle",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M8 12.4H17M12.5 8V17M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const AddIcon = forwardRef(function AddIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "add",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M12.5 5V20M5 12.5H20",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ApiIcon = forwardRef(function ApiIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "api",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M5.93047 13.2107L6.66782 10.3728H6.73089L7.45854 13.2107H5.93047ZM8.17164 16H9.66089L7.56041 9H5.93047L3.82999 16H5.20767L5.65396 14.2876H7.73505L8.17164 16Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M10.5389 9V16H11.9166V13.7782H13.0323C14.541 13.7782 15.5015 12.8517 15.5015 11.3964C15.5015 9.92654 14.5701 9 13.1003 9H10.5389ZM11.9166 10.1303H12.751C13.6533 10.1303 14.1044 10.5475 14.1044 11.3867C14.1044 12.2308 13.6533 12.6431 12.751 12.6431H11.9166V10.1303Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M21.1675 16V14.8164H19.717V10.1836H21.1675V9H16.8889V10.1836H18.3393V14.8164H16.8889V16H21.1675Z",
      fill: "currentColor"
    })]
  });
});
const ArchiveIcon = forwardRef(function ArchiveIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "archive",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M12.5 10.5V17M20.5 7.5V20.5H4.5V7.5L7.5 4.5H17.5L20.5 7.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M4.5 7.5H20.5M16 14L12.5 17.5L9 14",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const ArrowDownIcon = forwardRef(function ArrowDownIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "arrow-down",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M12.5 19.5V5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M18 14L12.5 19.5L7 14",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const ArrowLeftIcon = forwardRef(function ArrowLeftIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "arrow-left",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M5.5 12.5H20",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M11 18L5.5 12.5L11 7",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const ArrowRightIcon = forwardRef(function ArrowRightIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "arrow-right",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M19.5 12.5H5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M14 7L19.5 12.5L14 18",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const ArrowTopRightIcon = forwardRef(function ArrowTopRightIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "arrow-top-right",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M16.5 8.5L7 18",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M9 8.5H16.5V16",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const ArrowUpIcon = forwardRef(function ArrowUpIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "arrow-up",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M7 11L12.5 5.5L18 11",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M12.5 5.5V20",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const BarChartIcon = forwardRef(function BarChartIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "bar-chart",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M5.5 5V19.5H20M8.5 18V13M11.5 18V9M14.5 18V11M17.5 18V7",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const BasketIcon = forwardRef(function BasketIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "basket",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M8.5 10.5H5L6.5 19.5H18.5L20 10.5H16.5M8.5 10.5L10.2721 5.18377C10.4082 4.77543 10.7903 4.5 11.2208 4.5H13.7792C14.2097 4.5 14.5918 4.77543 14.7279 5.18377L16.5 10.5M8.5 10.5H16.5M8.5 10.5L9.5 19.5M16.5 10.5L15.5 19.5M12.5 10.5V19.5M19.5 13.5H5.5M19 16.5H6",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const BellIcon = forwardRef(function BellIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "bell",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M10.5 17.5V18.5C10.5 20 11.5 20.5 12.5 20.5C13.5 20.5 14.5 20 14.5 18.5V17.5M5.5 17.5C6.5 16 6.5 15 6.5 12C6.5 8 8.5 5.5 12.5 5.5C16.5 5.5 18.5 8 18.5 12C18.5 15 18.5 16 19.5 17.5H5.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const BillIcon = forwardRef(function BillIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "bill",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M6.50001 5.5C8.50003 5.5 8.50003 8 8.50003 8V9.5M6.50001 5.5C4.5 5.5 4.5 8 4.5 8L4.50001 9.5H8.50003M6.50001 5.5C6.50001 5.5 15.8333 5.5 17.6667 5.5C19.5 5.5 19.5 8.5 19.5 8.5V20L17.6667 19L15.8333 20L14 19L12.1667 20L10.3334 19L8.50003 20V9.5M11 12.5H15M11 9.5H16M11 15.5H16",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const BinaryDocumentIcon = forwardRef(function BinaryDocumentIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "binary-document",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M11.5 4.5V9.5H6.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M9.5 12.5V17.5M11.5 4.5H18.5V20.5H6.5V9.5L11.5 4.5ZM12.5 12.5V17.5H15.5V12.5H12.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinecap: "square",
      strokeLinejoin: "round"
    })]
  });
});
const BlockContentIcon = forwardRef(function BlockContentIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "block-content",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M21 7.60002L11 7.60003V6.40003L21 6.40002V7.60002Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M21 11.2667L12.4833 11.2667V10.0667L21 10.0667V11.2667Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M21 14.9334H13.9254V13.7334L21 13.7334V14.9334Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M21 18.6002H4V17.4002H21V18.6002Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M9.86438 15.6H11.2L8.27623 7.60003H6.92377L4 15.6H5.29072L6.0371 13.4767H9.12362L9.86438 15.6ZM7.53546 9.05255H7.63086L8.80374 12.4344H6.35698L7.53546 9.05255Z",
      fill: "currentColor"
    })]
  });
});
const BlockElementIcon = forwardRef(function BlockElementIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "block-element",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M5 19.5H20M5 5.5H20M6.5 8.5H18.5V16.5H6.5V8.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const BlockquoteIcon = forwardRef(function BlockquoteIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "blockquote",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M10 17.5H19M6 7.5H19M10 12.5H17M6.5 12V18",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const BoldIcon = forwardRef(function BoldIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "bold",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M13.2087 18C15.5322 18 16.9731 16.793 16.9731 14.8844C16.9731 13.4812 15.9245 12.3949 14.4836 12.2892V12.1534C15.6001 11.9875 16.4526 10.9841 16.4526 9.82991C16.4526 8.14761 15.1927 7.11409 13.0804 7.11409H8.32019V18H13.2087ZM10.5985 8.85674H12.4995C13.5859 8.85674 14.212 9.37727 14.212 10.2448C14.212 11.1199 13.5406 11.6254 12.3109 11.6254H10.5985V8.85674ZM10.5985 16.2574V13.1643H12.575C13.9178 13.1643 14.6496 13.6924 14.6496 14.6882C14.6496 15.7066 13.9404 16.2574 12.6278 16.2574H10.5985Z",
      fill: "currentColor"
    })
  });
});
const BookIcon = forwardRef(function BookIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "book",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M20.5 17.5V5.5L12.5 6.5M20.5 17.5L12.5 18.5M20.5 17.5V18.5M4.5 17.5V5.5L12.5 6.5M4.5 17.5L12.5 18.5M4.5 17.5V18.5M12.5 18.5L4.5 19.5V18.5M12.5 18.5L20.5 19.5V18.5M12.5 18.5V6.5M12.5 18.5H4.5M12.5 18.5H20.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const BottleIcon = forwardRef(function BottleIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "bottle",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M7.5 17.5L17.5 17.5M17.5 13C17.5 12.087 17.5 11.3518 17.5 11C17.5 8.5 14.5 9 14.5 7.37494L14.5 5.5M17.5 13C17.5 15.1229 17.5 18.7543 17.5 20.5022C17.5 21.0545 17.0523 21.5 16.5 21.5L8.5 21.5C7.94772 21.5 7.5 21.0547 7.5 20.5024C7.5 18.8157 7.5 15.3546 7.5 13M17.5 13L7.5 13M7.5 13C7.5 12.2538 7.5 11.5648 7.5 11C7.5 8.5 10.5 9 10.5 7.37494L10.5 5.5M10.5 5.5L10.5 3.99999C10.5 3.72385 10.7239 3.49999 11 3.49999L14 3.49999C14.2761 3.49999 14.5 3.72385 14.5 3.99999L14.5 5.5M10.5 5.5L14.5 5.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const BulbFilledIcon = forwardRef(function BulbFilledIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "bulb-filled",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M16.4272 14.3368C15.8273 15.1773 15.5 16.1794 15.5 17.212V18.5C15.5 19.0523 15.0523 19.5 14.5 19.5H14V20.5C14 21.0523 13.5523 21.5 13 21.5H12C11.4477 21.5 11 21.0523 11 20.5V19.5H10.5C9.94772 19.5 9.5 19.0523 9.5 18.5V17.212C9.5 16.1794 9.17266 15.1773 8.57284 14.3368C7.60216 12.9767 7 11.94 7 10C7 7 9.5 4.5 12.5 4.5C15.5 4.5 18 7 18 10C18 11.94 17.3978 12.9767 16.4272 14.3368Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M16.4272 14.3368L15.9388 13.9883L16.4272 14.3368ZM14 19.5V18.9H13.4V19.5H14ZM11 19.5H11.6V18.9H11V19.5ZM8.57284 14.3368L9.06122 13.9883H9.06122L8.57284 14.3368ZM16.1 17.212C16.1 16.3069 16.3868 15.4261 16.9155 14.6853L15.9388 13.9883C15.2678 14.9284 14.9 16.0519 14.9 17.212H16.1ZM16.1 18.5V17.212H14.9V18.5H16.1ZM14.5 20.1C15.3837 20.1 16.1 19.3837 16.1 18.5H14.9C14.9 18.7209 14.7209 18.9 14.5 18.9V20.1ZM14 20.1H14.5V18.9H14V20.1ZM13.4 19.5V20.5H14.6V19.5H13.4ZM13.4 20.5C13.4 20.7209 13.2209 20.9 13 20.9V22.1C13.8837 22.1 14.6 21.3837 14.6 20.5H13.4ZM13 20.9H12V22.1H13V20.9ZM12 20.9C11.7791 20.9 11.6 20.7209 11.6 20.5H10.4C10.4 21.3837 11.1163 22.1 12 22.1V20.9ZM11.6 20.5V19.5H10.4V20.5H11.6ZM10.5 20.1H11V18.9H10.5V20.1ZM8.9 18.5C8.9 19.3837 9.61634 20.1 10.5 20.1V18.9C10.2791 18.9 10.1 18.7209 10.1 18.5H8.9ZM8.9 17.212V18.5H10.1V17.212H8.9ZM8.08446 14.6853C8.61315 15.4261 8.9 16.3069 8.9 17.212H10.1C10.1 16.0519 9.73217 14.9284 9.06122 13.9883L8.08446 14.6853ZM6.4 10C6.4 11.0377 6.56208 11.8595 6.86624 12.611C7.16624 13.3521 7.59495 13.9995 8.08446 14.6853L9.06122 13.9883C8.58004 13.314 8.22233 12.7629 7.97858 12.1607C7.739 11.5688 7.6 10.9023 7.6 10H6.4ZM12.5 3.9C9.16863 3.9 6.4 6.66863 6.4 10H7.6C7.6 7.33137 9.83137 5.1 12.5 5.1V3.9ZM18.6 10C18.6 6.66863 15.8314 3.9 12.5 3.9V5.1C15.1686 5.1 17.4 7.33137 17.4 10H18.6ZM16.9155 14.6853C17.4051 13.9995 17.8338 13.3521 18.1338 12.611C18.4379 11.8595 18.6 11.0377 18.6 10H17.4C17.4 10.9023 17.261 11.5688 17.0214 12.1607C16.7777 12.7629 16.42 13.314 15.9388 13.9883L16.9155 14.6853Z",
      fill: "currentColor"
    })]
  });
});
const BulbOutlineIcon = forwardRef(function BulbOutlineIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "bulb-outline",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M9.5 16.5H15.5M11 20V20.5C11 21.0523 11.4477 21.5 12 21.5H13C13.5523 21.5 14 21.0523 14 20.5V20M18 10C18 11.94 17.3978 12.9767 16.4272 14.3368C15.8273 15.1773 15.5 16.1794 15.5 17.212V18.5C15.5 19.0523 15.0523 19.5 14.5 19.5H10.5C9.94772 19.5 9.5 19.0523 9.5 18.5V17.212C9.5 16.1794 9.17266 15.1773 8.57284 14.3368C7.60216 12.9767 7 11.94 7 10C7 7 9.5 4.5 12.5 4.5C15.5 4.5 18 7 18 10Z",
      stroke: "currentColor",
      strokeWidth: 1.2
    })
  });
});
const CalendarIcon = forwardRef(function CalendarIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "calendar",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M4.5 10.5V19.5H20.5V10.5M4.5 10.5V5.5H20.5V10.5M4.5 10.5H12.5H20.5M20.5 13.5H16.5M16.5 13.5H12.5M16.5 13.5V10.5M16.5 13.5V16.5M12.5 13.5H8.5M12.5 13.5V16.5M12.5 13.5V10.5M8.5 13.5H4.5M8.5 13.5V10.5M8.5 13.5V16.5M20.5 16.5H16.5M16.5 16.5H12.5M16.5 16.5V19.5M12.5 16.5H8.5M12.5 16.5V19.5M8.5 16.5H4.5M8.5 16.5V19.5M17.5 8V3M7.5 8V3",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const CaseIcon = forwardRef(function CaseIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "case",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M9 8.5122V6C9 5.44772 9.44772 5 10 5H15C15.5523 5 16 5.44772 16 6V8.5122M4.5 12V18.5C4.5 19.0523 4.94772 19.5 5.5 19.5H19.5C20.0523 19.5 20.5 19.0523 20.5 18.5V12M4.5 12V9.5122C4.5 8.95991 4.94772 8.5122 5.5 8.5122H19.5C20.0523 8.5122 20.5 8.95991 20.5 9.5122V12M4.5 12L11.7978 14.7367C12.2505 14.9064 12.7495 14.9064 13.2022 14.7367L20.5 12",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ChartUpwardIcon = forwardRef(function ChartUpwardIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "chart-upward",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M5.5 5V19.5H20M7.5 16L11.5 11.5L15.5 14L19.5 8.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const CheckmarkCircleIcon = forwardRef(function CheckmarkCircleIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "checkmark-circle",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M9.5 12.1316L11.7414 14.5L16 10M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const CheckmarkIcon = forwardRef(function CheckmarkIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "checkmark",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M5.5 11.5L10.5 16.5L19.5 7.60001",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ChevronDownIcon = forwardRef(function ChevronDownIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "chevron-down",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M17 10.5L12.5 15L8 10.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ChevronLeftIcon = forwardRef(function ChevronLeftIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "chevron-left",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M14.5 17L10 12.5L14.5 8",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ChevronRightIcon = forwardRef(function ChevronRightIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "chevron-right",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M10.5 8L15 12.5L10.5 17",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ChevronUpIcon = forwardRef(function ChevronUpIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "chevron-up",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M8 14.5L12.5 10L17 14.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const CircleIcon = forwardRef(function CircleIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "circle",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("circle", {
      cx: 12.5,
      cy: 12.5,
      r: 8,
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ClipboardIcon = forwardRef(function ClipboardIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "clipboard",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M8 5.5H6.5V19.5H18.5V5.5H17M12.5 3C11.5 3 11.5 4.5 11 4.5C10 4.5 9.5 5 9.5 6.5H15.6C15.6 5 15 4.5 14 4.5C13.5 4.5 13.5 3 12.5 3Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ClipboardImageIcon = forwardRef(function ClipboardImageIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "clipboard-image",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M8 5.5H6.5V19.5H10.5M17 5.5H18.5V11.5M10.5 18.5L12.73 15.8983C13.1327 15.4285 13.8613 15.4335 14.2575 15.909L15.299 17.1588C15.6754 17.6105 16.3585 17.6415 16.7743 17.2257L16.9903 17.0097C17.2947 16.7053 17.7597 16.6298 18.1447 16.8223L20.5 18M10.5 11.5H20.5V21.5H10.5V11.5ZM12.5 3C11.5 3 11.5 4.5 11 4.5C10 4.5 9.5 5 9.5 6.5H15.6C15.6 5 15 4.5 14 4.5C13.5 4.5 13.5 3 12.5 3Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ClockIcon = forwardRef(function ClockIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "clock",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M12.5 8V12.5L15.5 15.5M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const CloseCircleIcon = forwardRef(function CloseCircleIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "close-circle",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M9.5 15.5L12.5 12.5M12.5 12.5L15.5 9.5M12.5 12.5L9.5 9.5M12.5 12.5L15.5 15.5M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const CloseIcon = forwardRef(function CloseIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "close",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M18 7L7 18M7 7L18 18",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const CodeBlockIcon = forwardRef(function CodeBlockIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "code-block",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M11 15L8.5 12.5L11 10M14 10L16.5 12.5L14 15M5.5 6.5H19.5V18.5H5.5V6.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const CodeIcon = forwardRef(function CodeIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "code",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M11 16L7.5 12.5L11 9M14 9L17.5 12.5L14 16",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const CogIcon = forwardRef(function CogIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "cog",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M14.2624 5.40607L13.8714 4.42848C13.6471 3.86771 13.104 3.5 12.5 3.5C11.896 3.5 11.3529 3.86771 11.1286 4.42848L10.7376 5.40607C10.5857 5.78585 10.2869 6.08826 9.90901 6.2448C9.53111 6.40133 9.10603 6.39874 8.73006 6.23761L7.76229 5.82285C7.20716 5.58494 6.56311 5.70897 6.13604 6.13604C5.70897 6.56311 5.58494 7.20716 5.82285 7.76229L6.23761 8.73006C6.39874 9.10602 6.40133 9.53111 6.2448 9.90901C6.08826 10.2869 5.78585 10.5857 5.40607 10.7376L4.42848 11.1286C3.86771 11.3529 3.5 11.896 3.5 12.5C3.5 13.104 3.86771 13.6471 4.42848 13.8714L5.40607 14.2624C5.78585 14.4143 6.08826 14.7131 6.2448 15.091C6.40133 15.4689 6.39874 15.894 6.23761 16.2699L5.82285 17.2377C5.58494 17.7928 5.70897 18.4369 6.13604 18.864C6.56311 19.291 7.20716 19.4151 7.76229 19.1772L8.73006 18.7624C9.10603 18.6013 9.53111 18.5987 9.90901 18.7552C10.2869 18.9117 10.5857 19.2141 10.7376 19.5939L11.1286 20.5715C11.3529 21.1323 11.896 21.5 12.5 21.5C13.104 21.5 13.6471 21.1323 13.8714 20.5715L14.2624 19.5939C14.4143 19.2141 14.7131 18.9117 15.091 18.7552C15.4689 18.5987 15.894 18.6013 16.2699 18.7624L17.2377 19.1771C17.7928 19.4151 18.4369 19.291 18.864 18.864C19.291 18.4369 19.4151 17.7928 19.1771 17.2377L18.7624 16.2699C18.6013 15.894 18.5987 15.4689 18.7552 15.091C18.9117 14.7131 19.2141 14.4143 19.5939 14.2624L20.5715 13.8714C21.1323 13.6471 21.5 13.104 21.5 12.5C21.5 11.896 21.1323 11.3529 20.5715 11.1286L19.5939 10.7376C19.2141 10.5857 18.9117 10.2869 18.7552 9.90901C18.5987 9.53111 18.6013 9.10602 18.7624 8.73006L19.1772 7.76229C19.4151 7.20716 19.291 6.56311 18.864 6.13604C18.4369 5.70897 17.7928 5.58494 17.2377 5.82285L16.2699 6.23761C15.894 6.39874 15.4689 6.40133 15.091 6.2448C14.7131 6.08826 14.4143 5.78585 14.2624 5.40607Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M16.5 12.5C16.5 14.7091 14.7091 16.5 12.5 16.5C10.2909 16.5 8.5 14.7091 8.5 12.5C8.5 10.2909 10.2909 8.5 12.5 8.5C14.7091 8.5 16.5 10.2909 16.5 12.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const CollapseIcon = forwardRef(function CollapseIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "collapse",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M6 14.5L10.5 14.5V19M19 10.5H14.5L14.5 6",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M10.5 14.5L6 19M14.5 10.5L19 6",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const ColorWheelIcon = forwardRef(function ColorWheelIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "color-wheel",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M9.43853 5.10896L11.1606 9.26642M13.8394 15.7336L15.5615 19.891M15.7336 11.1606L19.891 9.43853M9.26642 13.8394L5.10896 15.5615M5.3139 9.52342L9.23359 11.147M15.7664 13.853L19.6861 15.4766M13.853 9.23359L15.4766 5.3139M9.52342 19.6861L11.147 15.7664M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5ZM16 12.5C16 14.433 14.433 16 12.5 16C10.567 16 9 14.433 9 12.5C9 10.567 10.567 9 12.5 9C14.433 9 16 10.567 16 12.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const CommentIcon = forwardRef(function CommentIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "comment",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M7.5 16.5H9.5V20.5L13.5 16.5H17.5C18.6046 16.5 19.5 15.6046 19.5 14.5V8.5C19.5 7.39543 18.6046 6.5 17.5 6.5H7.5C6.39543 6.5 5.5 7.39543 5.5 8.5V14.5C5.5 15.6046 6.39543 16.5 7.5 16.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ComponentIcon = forwardRef(function ComponentIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "component",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M8.5 8.5L12.5 12.5M12.5 12.5L16.5 16.5M12.5 12.5L16.5 8.5M12.5 12.5L8.5 16.5M12.5 4L21 12.5L12.5 21L4 12.5L12.5 4Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ComposeIcon = forwardRef(function ComposeIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "compose",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M17 6L19 8M14 5.5H5.5V19.5H19.5V11M9 16L9.5 13.5L19 4L21 6L11.5 15.5L9 16Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ControlsIcon = forwardRef(function ControlsIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "controls",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M6.5 5V7.5M6.5 7.5C5.39543 7.5 4.5 8.39543 4.5 9.5C4.5 10.6046 5.39543 11.5 6.5 11.5M6.5 7.5C7.60457 7.5 8.5 8.39543 8.5 9.5C8.5 10.6046 7.60457 11.5 6.5 11.5M6.5 11.5V20M12.5 5V13.5M12.5 13.5C11.3954 13.5 10.5 14.3954 10.5 15.5C10.5 16.6046 11.3954 17.5 12.5 17.5M12.5 13.5C13.6046 13.5 14.5 14.3954 14.5 15.5C14.5 16.6046 13.6046 17.5 12.5 17.5M12.5 17.5V20M18.5 5V7.5M18.5 7.5C17.3954 7.5 16.5 8.39543 16.5 9.5C16.5 10.6046 17.3954 11.5 18.5 11.5M18.5 7.5C19.6046 7.5 20.5 8.39543 20.5 9.5C20.5 10.6046 19.6046 11.5 18.5 11.5M18.5 11.5V20",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const CopyIcon = forwardRef(function CopyIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "copy",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M8.5 8.5H5.5V20.5H16.5V16.5M19.5 4.5H8.5V16.5H19.5V4.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const CreditCardIcon = forwardRef(function CreditCardIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "credit-card",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M20.5 9.5H4.5V11.5H20.5V9.5Z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M7 15.5H14M5.5 18.5H19.5C20.0523 18.5 20.5 18.0523 20.5 17.5V7.5C20.5 6.94772 20.0523 6.5 19.5 6.5H5.5C4.94772 6.5 4.5 6.94772 4.5 7.5V17.5C4.5 18.0523 4.94772 18.5 5.5 18.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const CropIcon = forwardRef(function CropIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "crop",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M9.5 5V15.5H20M5 9.5H15.5V20",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const DashboardIcon = forwardRef(function DashboardIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "dashboard",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M14.5 19.5V12.5M10.5 12.5V5.5M5.5 12.5H19.5M5.5 19.5H19.5V5.5H5.5V19.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const DatabaseIcon = forwardRef(function DatabaseIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "database",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M18.5 7V17.5C18.5 19.0594 16.0504 20.5 12.5 20.5C8.9496 20.5 6.5 19.0594 6.5 17.5V7M18.5 7C18.5 8.45543 15.8137 9.5 12.5 9.5C9.18629 9.5 6.5 8.45543 6.5 7C6.5 5.54457 9.18629 4.5 12.5 4.5C15.8137 4.5 18.5 5.54457 18.5 7Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const DesktopIcon = forwardRef(function DesktopIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "desktop",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M4.5 13.5V15.5C4.5 16.0523 4.94772 16.5 5.5 16.5H12.5M4.5 13.5V6.5C4.5 5.94772 4.94772 5.5 5.5 5.5H19.5C20.0523 5.5 20.5 5.94772 20.5 6.5V13.5M4.5 13.5H20.5M20.5 13.5V15.5C20.5 16.0523 20.0523 16.5 19.5 16.5H12.5M12.5 16.5V19.5M12.5 19.5H8M12.5 19.5H17",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const DocumentIcon = forwardRef(function DocumentIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "document",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M11.5 4.5V9.5H6.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M11.5 4.5H18.5V20.5H6.5L6.5 9.5M11.5 4.5L6.5 9.5M11.5 4.5V9.5H6.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const DocumentPdfIcon = forwardRef(function DocumentPdfIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "document-pdf",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M12.7127 13.8012L12.7193 13.77C12.8488 13.2366 13.0117 12.5716 12.8845 11.969C12.7997 11.4937 12.4493 11.3084 12.1503 11.295C11.7977 11.2794 11.483 11.4803 11.4049 11.7726C11.2576 12.3082 11.3893 13.0402 11.6303 13.973C11.3268 14.6961 10.8425 15.7472 10.4877 16.3721C9.8271 16.7135 8.94113 17.2402 8.80946 17.9053C8.78268 18.028 8.81392 18.1842 8.88757 18.3248C8.97014 18.481 9.10181 18.6015 9.25579 18.6596C9.32274 18.6841 9.40308 18.7042 9.49681 18.7042C9.88959 18.7042 10.5256 18.3873 11.3736 16.9322C11.5031 16.8898 11.637 16.8452 11.7664 16.8006C12.3734 16.5953 13.0028 16.381 13.5718 16.2851C14.2012 16.622 14.9175 16.8385 15.404 16.8385C15.8861 16.8385 16.0758 16.5529 16.1472 16.381C16.2722 16.0797 16.2119 15.7004 16.0088 15.4973C15.7143 15.2072 14.9979 15.1313 13.882 15.2696C13.3331 14.9349 12.9738 14.4796 12.7127 13.8012ZM10.2645 17.1911C9.95431 17.6419 9.71998 17.8673 9.59278 17.9655C9.7423 17.691 10.0346 17.4009 10.2645 17.1911ZM12.2195 11.9355C12.3355 12.1341 12.3199 12.7345 12.2306 13.038C12.1213 12.5939 12.1056 11.9645 12.1704 11.8909L12.2195 11.9355ZM12.1837 14.6247C12.4225 15.0376 12.7238 15.3924 13.0563 15.6557C12.5743 15.7651 12.1346 15.9458 11.7419 16.1065C11.6481 16.1445 11.5566 16.1824 11.4674 16.2181C11.7642 15.6803 12.0119 15.071 12.1837 14.6247ZM15.6562 16.0864L15.6428 16.1065C15.6428 16.1065 15.4375 16.2315 14.6497 15.9213C15.5558 15.8789 15.6562 16.0864 15.6562 16.0864Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M11.5 4.5V9.5H6.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M11.5 4.5H18.5V20.5H6.5V9.5L11.5 4.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const DocumentRemoveIcon = forwardRef(function DocumentRemoveIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "document-remove",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M11.5 4.5V9.5H6.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M6.5 14V20.5H18.5V14M6.5 11V9.5L11.5 4.5H18.5V11M3 12.5H22",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const DocumentSheetIcon = forwardRef(function DocumentSheetIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "document-sheet",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M11.5 4.5V9.5H6.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M10.4 19V16.4M10.4 16.4L10.4 13.4M10.4 16.4H8M10.4 16.4H14.4M10.4 13.4V11M10.4 13.4H8M10.4 13.4H14.4M14.4 19V16.4M14.4 16.4V13.4M14.4 16.4H17M14.4 13.4V11M14.4 13.4H17M11.5 4.5H18.5V20.5H6.5V9.5L11.5 4.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const DocumentTextIcon = forwardRef(function DocumentTextIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "document-text",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M11.5 4.5V9.5H6.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M16 13H9M14 16H9M11.5 4.5H18.5V20.5H6.5V9.5L11.5 4.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const DocumentVideoIcon = forwardRef(function DocumentVideoIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "document-video",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M11.5 16.5V13.5L14 15L11.5 16.5Z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeWidth: 1.2
    }), /* @__PURE__ */jsx("path", {
      d: "M11.5 4.5V9.5H6.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M11.5 4.5H18.5V20.5H6.5V9.5L11.5 4.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const DocumentWordIcon = forwardRef(function DocumentWordIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "document-word",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M12.4699 13.4588H12.5263L13.6328 17H14.5435L16 12H14.9952L14.0656 15.7214H14.0129L12.929 12H12.0672L10.9984 15.7214H10.9419L10.0124 12H9L10.4565 17H11.371L12.4699 13.4588Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M11.5 4.5V9.5H6.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M11.5 4.5H18.5V20.5H6.5V9.5L11.5 4.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const DocumentZipIcon = forwardRef(function DocumentZipIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "document-zip",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M11.5 4.5V9.5H6.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M15 4.5L13.5 5L15.5 6L13.5 7L15.5 8L13.5 9L15.5 10L13.5 11L14.5 11.5V13M11.5 4.5H18.5V20.5H6.5V9.5L11.5 4.5ZM13.5 13H15.5L16 17H13L13.5 13Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const DocumentsIcon = forwardRef(function DocumentsIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "documents",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M10.5 4.5V9.5H5.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M16.5 7.5H19.5V21.5H8.5V18.5M10.5 4.5H16.5V18.5H5.5V9.5L10.5 4.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const DotIcon = forwardRef(function DotIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "dot",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("circle", {
      cx: 12.5,
      cy: 12.5,
      r: 1.5,
      fill: "currentColor",
      stroke: "currentColor",
      strokeWidth: 1.2
    })
  });
});
const DoubleChevronDownIcon = forwardRef(function DoubleChevronDownIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "double-chevron-down",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M17 8.5L12.5 13L8 8.5M17 12.5L12.5 17L8 12.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const DoubleChevronLeftIcon = forwardRef(function DoubleChevronLeftIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "double-chevron-left",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M12.5 17L8 12.5L12.5 8M16.5 17L12 12.5L16.5 8",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const DoubleChevronRightIcon = forwardRef(function DoubleChevronRightIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "double-chevron-right",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M12.5 8L17 12.5L12.5 17M8.5 8L13 12.5L8.5 17",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const DoubleChevronUpIcon = forwardRef(function DoubleChevronUpIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "double-chevron-up",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M8 12.5L12.5 8L17 12.5M8 16.5L12.5 12L17 16.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const DownloadIcon = forwardRef(function DownloadIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "download",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M19.5 17V19.5H5.5V17M12.5 16L12.5 5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M17.5 11L12.5 16L7.5 11",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const DragHandleIcon = forwardRef(function DragHandleIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "drag-handle",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M15.5 8C16.3284 8 17 7.32843 17 6.5C17 5.67157 16.3284 5 15.5 5C14.6716 5 14 5.67157 14 6.5C14 7.32843 14.6716 8 15.5 8Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M17 12.5C17 13.3284 16.3284 14 15.5 14C14.6716 14 14 13.3284 14 12.5C14 11.6716 14.6716 11 15.5 11C16.3284 11 17 11.6716 17 12.5Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z",
      fill: "currentColor"
    })]
  });
});
const DropIcon = forwardRef(function DropIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "drop",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M18.5 14.5C18.5 18 16 20.5 12.5 20.5C9 20.5 6.5 18 6.5 14.5C6.5 11 9.5 7.50001 12.5 4.5C15.5 7.5 18.5 11 18.5 14.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const EarthAmericasIcon = forwardRef(function EarthAmericasIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "earth-americas",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M7 13L5.5 9L10 5H15V10L14 9H11L9.5 11L10.5 12H12V13L13 14.5H15.5L18.5 17L15.5 19.5L10.5 20V17L12.5 15L9 13L7 10.5V13Z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("circle", {
      cx: 12.5,
      cy: 12.5,
      r: 8,
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const EarthGlobeIcon = forwardRef(function EarthGlobeIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "earth-globe",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M5.5 16.5H19.5M5.5 8.5H19.5M4.5 12.5H20.5M12.5 20.5C12.5 20.5 8 18.5 8 12.5C8 6.5 12.5 4.5 12.5 4.5M12.5 4.5C12.5 4.5 17 6.5 17 12.5C17 18.5 12.5 20.5 12.5 20.5M12.5 4.5V20.5M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const EditIcon = forwardRef(function EditIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "edit",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M15 7L18 10M6 19L7 15L17 5L20 8L10 18L6 19Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const EllipsisHorizontalIcon = forwardRef(function EllipsisHorizontalIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "ellipsis-horizontal",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M6.5 11C7.32843 11 8 11.6716 8 12.5C8 13.3284 7.32843 14 6.5 14C5.67157 14 5 13.3284 5 12.5C5 11.6716 5.67157 11 6.5 11Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M12.5 11C13.3284 11 14 11.6716 14 12.5C14 13.3284 13.3284 14 12.5 14C11.6716 14 11 13.3284 11 12.5C11 11.6716 11.6716 11 12.5 11Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M18.5 11C19.3284 11 20 11.6716 20 12.5C20 13.3284 19.3284 14 18.5 14C17.6716 14 17 13.3284 17 12.5C17 11.6716 17.6716 11 18.5 11Z",
      fill: "currentColor"
    })]
  });
});
const EllipsisVerticalIcon = forwardRef(function EllipsisVerticalIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "ellipsis-vertical",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M14 6.5C14 7.32843 13.3284 8 12.5 8C11.6716 8 11 7.32843 11 6.5C11 5.67157 11.6716 5 12.5 5C13.3284 5 14 5.67157 14 6.5Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M14 12.5C14 13.3284 13.3284 14 12.5 14C11.6716 14 11 13.3284 11 12.5C11 11.6716 11.6716 11 12.5 11C13.3284 11 14 11.6716 14 12.5Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M14 18.5C14 19.3284 13.3284 20 12.5 20C11.6716 20 11 19.3284 11 18.5C11 17.6716 11.6716 17 12.5 17C13.3284 17 14 17.6716 14 18.5Z",
      fill: "currentColor"
    })]
  });
});
const EnterIcon = forwardRef(function EnterIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "enter",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M6 14.5H19.5V7",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M10 18.5L6 14.5L10 10.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const EnterRightIcon = forwardRef(function EnterRightIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "enter-right",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M19 14.5H5.5V7",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M15 18.5L19 14.5L15 10.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const EnvelopeIcon = forwardRef(function EnvelopeIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "envelope",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M20.5 18.5H4.5V6.5H20.5V18.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M20.5 18.5L17.75 15.5L15 12.5M4.5 18.5L10 12.5M20.5 6.5L12.5 15L4.5 6.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const EqualIcon = forwardRef(function EqualIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "equal",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M7.5 4.5H3.5V20.5H7.5",
      stroke: "currentColor",
      strokeWidth: 1.2
    }), /* @__PURE__ */jsx("path", {
      d: "M17.5 20.5L21.5 20.5L21.5 4.5L17.5 4.5",
      stroke: "currentColor",
      strokeWidth: 1.2
    }), /* @__PURE__ */jsx("path", {
      d: "M9 10.5H16",
      stroke: "currentColor",
      strokeWidth: 1.2
    }), /* @__PURE__ */jsx("path", {
      d: "M9 14.5H16",
      stroke: "currentColor",
      strokeWidth: 1.2
    })]
  });
});
const ErrorFilledIcon = forwardRef(function ErrorFilledIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "error-filled",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M4 12.5C4 7.80558 7.80558 4 12.5 4C17.1944 4 21 7.80558 21 12.5C21 17.1944 17.1944 21 12.5 21C7.80558 21 4 17.1944 4 12.5ZM13 14.5V16H12V14.5H13ZM12 9V13H13V9H12Z",
      fill: "currentColor"
    })
  });
});
const ErrorOutlineIcon = forwardRef(function ErrorOutlineIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "error-outline",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M12.5 16V14.5M12.5 9V13M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ExpandIcon = forwardRef(function ExpandIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "expand",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M14 6.5H18.5V11M11 18.5H6.5V14",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M18.5 6.5L14 11M6.5 18.5L11 14",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const EyeClosedIcon = forwardRef(function EyeClosedIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "eye-closed",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M7 15.5L5.5 17.5M20.5 12.5C19.8612 13.5647 19.041 14.6294 18.0008 15.501M18.0008 15.501C16.5985 16.676 14.7965 17.5 12.5 17.5M18.0008 15.501L18 15.5M18.0008 15.501L19.5 17.5M12.5 17.5C8.5 17.5 6 15 4.5 12.5M12.5 17.5V20M15.5 17L16.5 19.5M9.5 17L8.5 19.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const EyeOpenIcon = forwardRef(function EyeOpenIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "eye-open",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M9.39999 12.5C9.39999 10.7879 10.7879 9.39999 12.5 9.39999C14.2121 9.39999 15.6 10.7879 15.6 12.5C15.6 14.2121 14.2121 15.6 12.5 15.6C10.7879 15.6 9.39999 14.2121 9.39999 12.5Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M12.5 7.5C8.5 7.5 6 10 4.5 12.5C6 15 8.5 17.5 12.5 17.5C16.5 17.5 19 15 20.5 12.5C19 10 16.5 7.5 12.5 7.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const FilterIcon = forwardRef(function FilterIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "filter",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M11 12L6 7V6L19 6L19 7L14 12V17L11 19V12Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinecap: "square",
      strokeLinejoin: "round"
    })
  });
});
const FolderIcon = forwardRef(function FolderIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "folder",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M11.5 8.5H19.5V18.5H5.5V5.5H10.5L11.5 8.5ZM11.5 8.5H5.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const GenerateIcon = forwardRef(function GenerateIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "generate",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M9 5.30423C6.33576 6.60253 4.5 9.33688 4.5 12.5C4.5 16.9183 8.08172 20.5 12.5 20.5C16.9183 20.5 20.5 16.9183 20.5 12.5C20.5 8.08172 16.9183 4.5 12.5 4.5V14.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M16 11L12.5 14.5L9 11",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const GroqIcon = forwardRef(function GroqIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "groq",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M13 13H21L13 21L13 13Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M12 12V4L4 12H12Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M12 13H4L12 21V13Z",
      fill: "currentColor"
    })]
  });
});
const HeartFilledIcon = forwardRef(function HeartFilledIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "heart-filled",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M17 16C15.8 17.3235 12.5 20.5 12.5 20.5C12.5 20.5 9.2 17.3235 8 16C5.2 12.9118 4.5 11.7059 4.5 9.5C4.5 7.29412 6.1 5.5 8.5 5.5C10.5 5.5 11.7 6.82353 12.5 8.14706C13.3 6.82353 14.5 5.5 16.5 5.5C18.9 5.5 20.5 7.29412 20.5 9.5C20.5 11.7059 19.8 12.9118 17 16Z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const HeartIcon = forwardRef(function HeartIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "heart",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M17 16C15.8 17.3235 12.5 20.5 12.5 20.5C12.5 20.5 9.2 17.3235 8 16C5.2 12.9118 4.5 11.7059 4.5 9.5C4.5 7.29412 6.1 5.5 8.5 5.5C10.5 5.5 11.7 6.82353 12.5 8.14706C13.3 6.82353 14.5 5.5 16.5 5.5C18.9 5.5 20.5 7.29412 20.5 9.5C20.5 11.7059 19.8 12.9118 17 16Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const HelpCircleIcon = forwardRef(function HelpCircleIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "help-circle",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M12.5 13C12.5 11 14 11.5 14 10C14 9.34375 13.5 8.5 12.5 8.5C11.5 8.5 11 9 10.5 9.5M12.5 16V14.5M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const HomeIcon = forwardRef(function HomeIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "home",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M6.5 8.75V18.5H18.5V8.75M4.5 10L12.5 5L20.5 10M14.5 18.5V11.5H10.5V18.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const IceCreamIcon = forwardRef(function IceCreamIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "ice-cream",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M9.5 13.5L12.5 20.5L15.5 13.5M12.5 8.26389C11.9692 7.78885 11.2684 7.5 10.5 7.5C8.84315 7.5 7.5 8.84315 7.5 10.5C7.5 12.1569 8.84315 13.5 10.5 13.5C11.2684 13.5 11.9692 13.2111 12.5 12.7361M9.5 7.5C9.5 5.84315 10.8431 4.5 12.5 4.5C14.1569 4.5 15.5 5.84315 15.5 7.5M17.5 10.5C17.5 12.1569 16.1569 13.5 14.5 13.5C12.8431 13.5 11.5 12.1569 11.5 10.5C11.5 8.84315 12.8431 7.5 14.5 7.5C16.1569 7.5 17.5 8.84315 17.5 10.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ImageIcon = forwardRef(function ImageIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "image",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M5.5 15.5L8.79289 12.2071C9.18342 11.8166 9.81658 11.8166 10.2071 12.2071L12.8867 14.8867C13.2386 15.2386 13.7957 15.2782 14.1938 14.9796L15.1192 14.2856C15.3601 14.1049 15.6696 14.0424 15.9618 14.1154L19.5 15M5.5 6.5H19.5V18.5H5.5V6.5ZM15.5 10.5C15.5 11.0523 15.0523 11.5 14.5 11.5C13.9477 11.5 13.5 11.0523 13.5 10.5C13.5 9.94772 13.9477 9.5 14.5 9.5C15.0523 9.5 15.5 9.94772 15.5 10.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ImageRemoveIcon = forwardRef(function ImageRemoveIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "image-remove",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M5.5 11V6.5H19.5V11M5.5 14V18.5H19.5V14M3 12.5H22",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ImagesIcon = forwardRef(function ImagesIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "images",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M18.5 7.5H20.5V19.5H6.5V17.5M4.5 14.5L7.79289 11.2071C8.18342 10.8166 8.81658 10.8166 9.20711 11.2071L11.8867 13.8867C12.2386 14.2386 12.7957 14.2782 13.1938 13.9796L14.1192 13.2856C14.3601 13.1049 14.6696 13.0424 14.9618 13.1154L18.5 14M4.5 5.5H18.5V17.5H4.5V5.5ZM14.5 9.5C14.5 10.0523 14.0523 10.5 13.5 10.5C12.9477 10.5 12.5 10.0523 12.5 9.5C12.5 8.94772 12.9477 8.5 13.5 8.5C14.0523 8.5 14.5 8.94772 14.5 9.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const InfoFilledIcon = forwardRef(function InfoFilledIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "info-filled",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M21 12.5C21 17.1944 17.1944 21 12.5 21C7.80558 21 4 17.1944 4 12.5C4 7.80558 7.80558 4 12.5 4C17.1944 4 21 7.80558 21 12.5ZM12 10.5V9H13V10.5H12ZM13 16V12H12V16H13Z",
      fill: "currentColor"
    })
  });
});
const InfoOutlineIcon = forwardRef(function InfoOutlineIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "info-outline",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M12.5 10.5V9M12.5 12V16M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const InlineElementIcon = forwardRef(function InlineElementIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "inline-element",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M5.5 5V20M19.5 5V20M8.5 6.5H16.5V18.5H8.5V6.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const InlineIcon = forwardRef(function InlineIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "inline",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M12.5 6.5H19.5V18.5H12.5M12.5 6.5H5.5V18.5H12.5M12.5 6.5V18.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const InsertAboveIcon = forwardRef(function InsertAboveIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "insert-above",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M14.5 10.5556L10.5 10.5556M12.5 12.5L12.5 8.5M18.5 5.5L6.5 5.5M18.5 19.5L6.5 19.5L6.5 15.5L18.5 15.5L18.5 19.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinecap: "square",
      strokeLinejoin: "round"
    })
  });
});
const InsertBelowIcon = forwardRef(function InsertBelowIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "insert-below",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M10.5 14.5H14.5M12.5 12.5V16.5M6.5 19.5H18.5M6.5 5.5H18.5V9.5H6.5V5.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinecap: "square",
      strokeLinejoin: "round"
    })
  });
});
const ItalicIcon = forwardRef(function ItalicIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "italic",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M10.43 18H11.7276L13.4551 9.86763H12.1576L10.43 18ZM13.3043 8.29849C13.8022 8.29849 14.2095 7.89112 14.2095 7.39322C14.2095 6.89532 13.8022 6.48795 13.3043 6.48795C12.8064 6.48795 12.399 6.89532 12.399 7.39322C12.399 7.89112 12.8064 8.29849 13.3043 8.29849Z",
      fill: "currentColor"
    })
  });
});
const JoystickIcon = forwardRef(function JoystickIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "joystick",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M9.5 16V14.5H15.5V16M13.5 10.5V14.5M11.5 10.5V14.5M15.5 7.5C15.5 9.15685 14.1569 10.5 12.5 10.5C10.8431 10.5 9.5 9.15685 9.5 7.5C9.5 5.84315 10.8431 4.5 12.5 4.5C14.1569 4.5 15.5 5.84315 15.5 7.5ZM18.5 19.5H6.5C5.94772 19.5 5.5 19.0523 5.5 18.5V17.5C5.5 16.9477 5.94772 16.5 6.5 16.5H18.5C19.0523 16.5 19.5 16.9477 19.5 17.5V18.5C19.5 19.0523 19.0523 19.5 18.5 19.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const LaunchIcon = forwardRef(function LaunchIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "launch",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M14 6.5H5.5V19.5H18.5V11M20.5 4.5L10.5 14.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M16 4.5H20.5V9",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const LeaveIcon = forwardRef(function LeaveIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "leave",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M15.5 15V18.5H5.5V6.5H15.5V10M9 12.5H21.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M18.5 9.5L21.5 12.5L18.5 15.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const LemonIcon = forwardRef(function LemonIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "lemon",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M10.6569 10.3431L6.41422 14.5858C7.58579 15.7574 9.12132 16.3431 10.6569 16.3431M10.6569 10.3431L14.8995 6.1005C16.0711 7.27208 16.6569 8.80761 16.6569 10.3431M10.6569 10.3431L10.6569 16.3431M10.6569 10.3431L16.6569 10.3431M10.6569 10.3431L14.8995 14.5858M14.8995 14.5858C13.7279 15.7574 12.1924 16.3431 10.6569 16.3431M14.8995 14.5858C16.0711 13.4142 16.6569 11.8787 16.6569 10.3431M16.3137 4.68629C19.4379 7.81049 19.4379 12.8758 16.3137 16C13.1895 19.1242 8.12419 19.1242 5 16L16.3137 4.68629Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const LinkIcon = forwardRef(function LinkIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "link",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M11 12.5L12.5 14C13.281 14.781 14.719 14.781 15.5 14L18.5 11C19.281 10.219 19.281 8.78105 18.5 8L18 7.5C17.2189 6.71895 15.781 6.71895 15 7.5L13 9.5M12 15.5L10 17.5C9.21895 18.281 7.78105 18.281 7 17.5L6.5 17C5.71895 16.219 5.71896 14.781 6.5 14L9.50001 11C10.2811 10.219 11.719 10.2189 12.5 11L14 12.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const LinkRemovedIcon = forwardRef(function LinkRemovedIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "link-removed",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M18.5 11C19.281 10.219 19.281 8.78108 18.5 8.00003L18 7.50003C17.2189 6.71898 15.781 6.71898 15 7.50003L13 9.50003M15.5 14C14.7189 14.7811 13.281 14.7811 12.5 14M6.5 14C5.71895 14.7811 5.71894 16.219 6.49999 17L6.99999 17.5C7.78104 18.2811 9.21894 18.2811 9.99999 17.5L12 15.5M12.5 11C11.719 10.219 10.281 10.219 9.5 11M3 12.5H22",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const LockIcon = forwardRef(function LockIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "lock",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M15.5 11.5V8.5C15.5 6.5 14 5.5 12.5 5.5C11 5.5 9.5 6.5 9.5 8.5V11.5M7.5 11.5H17.5V19.5H7.5V11.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const LogoJsIcon = forwardRef(function LogoJsIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "logo-js",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M20 5H5V20H20V5ZM12.5254 16.1572C12.5254 17.4189 11.7742 18.1536 10.4792 18.1536C9.24243 18.1536 8.49121 17.4189 8.45801 16.2942V16.261H9.67407V16.2859C9.69897 16.7466 9.9729 17.0703 10.4626 17.0703C10.9939 17.0703 11.272 16.7507 11.272 16.1489V12.011H12.5254V16.1572ZM18.2893 16.2153C18.2893 17.4023 17.3679 18.1536 15.8738 18.1536C14.4419 18.1536 13.5371 17.4688 13.4666 16.4062L13.4624 16.3398H14.6702L14.6743 16.3813C14.72 16.8296 15.2056 17.1326 15.907 17.1326C16.5752 17.1326 17.0359 16.813 17.0359 16.3523V16.3481C17.0359 15.9539 16.7412 15.7339 15.9983 15.5803L15.3674 15.4517C14.1223 15.1985 13.5869 14.6174 13.5869 13.7085V13.7043C13.5869 12.592 14.5415 11.8574 15.8696 11.8574C17.2683 11.8574 18.0901 12.5962 18.1689 13.5964L18.1731 13.6504H16.9944L16.9861 13.6006C16.9155 13.1731 16.5005 12.8743 15.8696 12.8743C15.2512 12.8784 14.8403 13.1606 14.8403 13.6089V13.613C14.8403 14.0032 15.1309 14.2356 15.8364 14.3809L16.4714 14.5095C17.7373 14.771 18.2893 15.2773 18.2893 16.2112V16.2153Z",
      fill: "currentColor"
    })
  });
});
const LogoTsIcon = forwardRef(function LogoTsIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "logo-ts",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M20 5H5V20H20V5ZM11.0769 18H9.82349V13.0444H8.02637V12.011H12.874V13.0444H11.0769V18ZM18.2893 16.2153C18.2893 17.4023 17.3679 18.1536 15.8738 18.1536C14.4419 18.1536 13.5371 17.4688 13.4666 16.4062L13.4624 16.3398H14.6702L14.6743 16.3813C14.72 16.8296 15.2056 17.1326 15.907 17.1326C16.5752 17.1326 17.0359 16.813 17.0359 16.3523V16.3481C17.0359 15.9539 16.7412 15.7339 15.9983 15.5803L15.3674 15.4517C14.1223 15.1985 13.5869 14.6174 13.5869 13.7085V13.7043C13.5869 12.592 14.5415 11.8574 15.8696 11.8574C17.2683 11.8574 18.0901 12.5962 18.1689 13.5964L18.1731 13.6504H16.9944L16.9861 13.6006C16.9155 13.1731 16.5005 12.8743 15.8696 12.8743C15.2512 12.8784 14.8403 13.1606 14.8403 13.6089V13.613C14.8403 14.0032 15.1309 14.2356 15.8364 14.3809L16.4714 14.5095C17.7373 14.771 18.2893 15.2773 18.2893 16.2112V16.2153Z",
      fill: "currentColor"
    })
  });
});
const MasterDetailIcon = forwardRef(function MasterDetailIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "master-detail",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M7 9.5H10M11.5 6.5V18.5M7 12.5H10M13 9.5H18M7 15.5H10M5.5 6.5H19.5V18.5H5.5V6.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const MenuIcon = forwardRef(function MenuIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "menu",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M6 7.5H19M6 17.5H19M6 12.5H19",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const MobileDeviceIcon = forwardRef(function MobileDeviceIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "mobile-device",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M7.5 6.5C7.5 5.39543 8.39543 4.5 9.5 4.5H15.5C16.6046 4.5 17.5 5.39543 17.5 6.5V18.5C17.5 19.6046 16.6046 20.5 15.5 20.5H9.5C8.39543 20.5 7.5 19.6046 7.5 18.5V6.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M13.5 17.5C13.5 18.0523 13.0523 18.5 12.5 18.5C11.9477 18.5 11.5 18.0523 11.5 17.5C11.5 16.9477 11.9477 16.5 12.5 16.5C13.0523 16.5 13.5 16.9477 13.5 17.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const MoonIcon = forwardRef(function MoonIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "moon",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M19.6065 16.1775C18.9417 16.387 18.234 16.5 17.5 16.5C13.634 16.5 10.5 13.366 10.5 9.5C10.5 7.54163 11.3042 5.77109 12.6004 4.50062C12.567 4.50021 12.5335 4.5 12.5 4.5C8.08172 4.5 4.5 8.08172 4.5 12.5C4.5 16.9183 8.08172 20.5 12.5 20.5C15.5924 20.5 18.275 18.7454 19.6065 16.1775Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const NumberIcon = forwardRef(function NumberIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "number",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M21.0165 17.6336H3.83636V16.4336H21.0165V17.6336Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M7.09808 13.3967V7.508H5.74066L3.83636 8.78241V10.091L5.65277 8.88495H5.74066V13.3967H3.84125V14.5539H8.89984V13.3967H7.09808Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M9.81781 9.63202V9.66132H11.1069V9.62714C11.1069 8.95331 11.5756 8.49432 12.2739 8.49432C12.9575 8.49432 13.4018 8.89471 13.4018 9.50507C13.4018 9.9787 13.1528 10.3498 12.1909 11.3117L9.89594 13.5822V14.5539H14.8618V13.3869H11.7807V13.299L13.1577 11.9855C14.3491 10.843 14.7543 10.1838 14.7543 9.41229C14.7543 8.19159 13.7729 7.36639 12.3178 7.36639C10.8383 7.36639 9.81781 8.28436 9.81781 9.63202Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M17.6694 11.4631H18.5092C19.3198 11.4631 19.8422 11.8683 19.8422 12.4982C19.8422 13.1183 19.3295 13.5139 18.5239 13.5139C17.767 13.5139 17.2592 13.133 17.2104 12.5324H15.9262C15.9897 13.8508 17.0248 14.6955 18.5629 14.6955C20.1401 14.6955 21.2192 13.841 21.2192 12.591C21.2192 11.6584 20.6528 11.0334 19.7006 10.9211V10.8332C20.4721 10.6769 20.9457 10.0666 20.9457 9.23651C20.9457 8.12323 19.9741 7.36639 18.5434 7.36639C17.0541 7.36639 16.1118 8.17694 16.0629 9.50018H17.2983C17.3422 8.88007 17.8061 8.48456 18.4995 8.48456C19.2075 8.48456 19.6567 8.85565 19.6567 9.44159C19.6567 10.0324 19.1977 10.4182 18.4946 10.4182H17.6694V11.4631Z",
      fill: "currentColor"
    })]
  });
});
const OkHandIcon = forwardRef(function OkHandIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "ok-hand",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M15.9957 11.5C14.8197 10.912 11.9957 9 10.4957 9C8.9957 9 5.17825 11.7674 6 13C7 14.5 9.15134 11.7256 10.4957 12C11.8401 12.2744 13 13.5 13 14.5C13 15.5 11.8401 16.939 10.4957 16.5C9.15134 16.061 8.58665 14.3415 7.4957 14C6.21272 13.5984 5.05843 14.6168 5.5 15.5C5.94157 16.3832 7.10688 17.6006 8.4957 19C9.74229 20.2561 11.9957 21.5 14.9957 20C17.9957 18.5 18.5 16.2498 18.5 13C18.5 11.5 13.7332 5.36875 11.9957 4.5C10.9957 4 10 5 10.9957 6.5C11.614 7.43149 13.5 9.27705 14 10.3751M15.5 8C15.5 8 15.3707 7.5 14.9957 6C14.4957 4 15.9957 3.5 16.4957 4.5C17.1281 5.76491 18.2872 10.9147 18.4957 13",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const OlistIcon = forwardRef(function OlistIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "olist",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M10 7.5H19M10 12.5H19M10 17.5H19M5 18.5H7.5L7 17.5L7.5 16.5H5M5 6.5H6.5V8.5M5 8.5H6.5M6.5 8.5H8M8 13.5H6L7 11.5H5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const OverageIcon = forwardRef(function OverageIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "overage",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M18.5 11V6.5H14",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M6.5 18.5L9 16L12 13L18.5 6.5M3 13.5H22",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const PackageIcon = forwardRef(function PackageIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "package",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M12.5 13V22M12.5 13L4.5 8M12.5 13L20.5 8M8.5 5.5L16.5 10.5M4.5 8L12.5 3L20.5 8V17L12.5 22L4.5 17V8Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const PauseIcon = forwardRef(function PauseIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "pause",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M10.5 7.5H8.5V17.5H10.5V7.5Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M16.5 7.5H14.5V17.5H16.5V7.5Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M10.5 7.5H8.5V17.5H10.5V7.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2
    }), /* @__PURE__ */jsx("path", {
      d: "M16.5 7.5H14.5V17.5H16.5V7.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2
    })]
  });
});
const PinIcon = forwardRef(function PinIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "pin",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M6.5 10.5C6.5 7 9 4.5 12.5 4.5C16 4.5 18.5 7 18.5 10.5C18.5 14 15.5 17.5 12.5 20.5C9.5 17.5 6.5 14 6.5 10.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M14 10.5C14 11.3284 13.3284 12 12.5 12C11.6716 12 11 11.3284 11 10.5C11 9.67157 11.6716 9 12.5 9C13.3284 9 14 9.67157 14 10.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const PinRemovedIcon = forwardRef(function PinRemovedIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "pin-removed",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M7.39787 14C8.51075 16.2897 10.5054 18.5054 12.5 20.5C14.4946 18.5054 16.4892 16.2897 17.6021 14M6.52009 11C6.50681 10.8334 6.5 10.6667 6.5 10.5C6.5 7 9 4.5 12.5 4.5C16 4.5 18.5 7 18.5 10.5C18.5 10.6667 18.4932 10.8334 18.4799 11M3 12.5H22",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const PlayIcon = forwardRef(function PlayIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "play",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M7.5 18.5V6.5L17.5 12.5L7.5 18.5Z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const PlugIcon = forwardRef(function PlugIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "plug",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M13.25 8.5L16.75 5M16.25 11.5L19.75 8M9.25 15.5L5.25 19.5M7.75 14L9.75 12C8.25 10 8.75 9 9.75 8C10.15 7.6 11.25 6.5 11.25 6.5L18.25 13.5C18.25 13.5 17.3825 14.3675 16.75 15C15.75 16 14.75 16.5 12.75 15L10.75 17L7.75 14Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const PresentationIcon = forwardRef(function PresentationIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "presentation",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M10.5 18H5.5V8.5H19.5V18H14.5M10.5 18L9 22M10.5 18H14.5M14.5 18L16 22M4.5 8.5H20.5V6.5H4.5V8.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const PublishIcon = forwardRef(function PublishIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "publish",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M4.99997 5.50006H20M12.5 9.00005V20",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M7.5 14L12.5 9.00006L17.5 14",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const ReadOnlyIcon = forwardRef(function ReadOnlyIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "read-only",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M15 7L18 10M10 12L7 15L6 19L10 18L13 15M12 10L17 5L20 8L15 13M19 19L5 5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const RemoveCircleIcon = forwardRef(function RemoveCircleIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "remove-circle",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M8 12.4H17M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const RemoveIcon = forwardRef(function RemoveIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "remove",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M5 12.5H20",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ResetIcon = forwardRef(function ResetIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "reset",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M4.56189 13.5L4.14285 13.9294C4.25676 14.0406 4.41017 14.1019 4.56932 14.1C4.72847 14.098 4.88032 14.0329 4.99144 13.9189L4.56189 13.5ZM9.92427 15.9243L15.9243 9.92427L15.0757 9.07574L9.07574 15.0757L9.92427 15.9243ZM9.07574 9.92426L15.0757 15.9243L15.9243 15.0757L9.92426 9.07574L9.07574 9.92426ZM19.9 12.5C19.9 16.5869 16.5869 19.9 12.5 19.9V21.1C17.2496 21.1 21.1 17.2496 21.1 12.5H19.9ZM5.1 12.5C5.1 8.41309 8.41309 5.1 12.5 5.1V3.9C7.75035 3.9 3.9 7.75035 3.9 12.5H5.1ZM12.5 5.1C16.5869 5.1 19.9 8.41309 19.9 12.5H21.1C21.1 7.75035 17.2496 3.9 12.5 3.9V5.1ZM5.15728 13.4258C5.1195 13.1227 5.1 12.8138 5.1 12.5H3.9C3.9 12.8635 3.92259 13.2221 3.9665 13.5742L5.15728 13.4258ZM12.5 19.9C9.9571 19.9 7.71347 18.6179 6.38048 16.6621L5.38888 17.3379C6.93584 19.6076 9.54355 21.1 12.5 21.1V19.9ZM4.99144 13.9189L7.42955 11.4189L6.57045 10.5811L4.13235 13.0811L4.99144 13.9189ZM4.98094 13.0706L2.41905 10.5706L1.58095 11.4294L4.14285 13.9294L4.98094 13.0706Z",
      fill: "currentColor"
    })
  });
});
const RestoreIcon = forwardRef(function RestoreIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "restore",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M5.88468 17C7.32466 19.1128 9.75033 20.5 12.5 20.5C16.9183 20.5 20.5 16.9183 20.5 12.5C20.5 8.08172 16.9183 4.5 12.5 4.5C8.08172 4.5 4.5 8.08172 4.5 12.5V13.5M12.5 8V12.5L15.5 15.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M7 11L4.5 13.5L2 11",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const RetrieveIcon = forwardRef(function RetrieveIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "retrieve",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M16 14L12.5 10.5L9 14M5.5 7.5H19.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M12.5 10.5L12.5 17.5M19.5 7.5V19.5H5.5V7.5L7.5 5.5H17.5L19.5 7.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const RetryIcon = forwardRef(function RetryIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "retry",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M20 9L10 9C7.51472 9 5.5 11.0147 5.5 13.5C5.5 15.9853 7.51472 18 10 18H20",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M16 13L20 9L16 5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const RevertIcon = forwardRef(function RevertIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "revert",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M5 9L15 9C17.4853 9 19.5 11.0147 19.5 13.5C19.5 15.9853 17.4853 18 15 18H5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M9 13L5 9L9 5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const RobotIcon = forwardRef(function RobotIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "robot",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M12.5 15.5V17.5M12.5 8.5V6.5M12.5 6.5C13.3284 6.5 14 5.82843 14 5C14 4.17157 13.3284 3.5 12.5 3.5C11.6716 3.5 11 4.17157 11 5C11 5.82843 11.6716 6.5 12.5 6.5ZM20.5 20.5V19.5C20.5 18.3954 19.6046 17.5 18.5 17.5H6.5C5.39543 17.5 4.5 18.3954 4.5 19.5V20.5H20.5ZM11.5 12C11.5 12.5523 11.0523 13 10.5 13C9.94772 13 9.5 12.5523 9.5 12C9.5 11.4477 9.94772 11 10.5 11C11.0523 11 11.5 11.4477 11.5 12ZM15.5 12C15.5 12.5523 15.0523 13 14.5 13C13.9477 13 13.5 12.5523 13.5 12C13.5 11.4477 13.9477 11 14.5 11C15.0523 11 15.5 11.4477 15.5 12ZM8.5 15.5H16.5C17.6046 15.5 18.5 14.6046 18.5 13.5V10.5C18.5 9.39543 17.6046 8.5 16.5 8.5H8.5C7.39543 8.5 6.5 9.39543 6.5 10.5V13.5C6.5 14.6046 7.39543 15.5 8.5 15.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const RocketIcon = forwardRef(function RocketIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "rocket",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M12.5 20.5L15.5 14M11 9.49999L4.5 12.5M9 14C9 14 7.54688 14.9531 6.5 16C5.5 17 4.5 20.5 4.5 20.5C4.5 20.5 8 19.5 9 18.5C10 17.5 11 16 11 16M9 14C9 14 10.1 9.9 12.5 7.5C15.5 4.5 20.5 4.5 20.5 4.5C20.5 4.5 20.5 9.5 17.5 12.5C15.7492 14.2508 11 16 11 16L9 14ZM16.5 9.99999C16.5 10.8284 15.8284 11.5 15 11.5C14.1716 11.5 13.5 10.8284 13.5 9.99999C13.5 9.17157 14.1716 8.49999 15 8.49999C15.8284 8.49999 16.5 9.17157 16.5 9.99999Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const SchemaIcon = forwardRef(function SchemaIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "schema",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M12.5 9.5V12.5M12.5 12.5H8.5V15.5M12.5 12.5H16.5V15.5M10.5 5.5H14.5V9.5H10.5V5.5ZM6.5 15.5H10.5V19.5H6.5V15.5ZM14.5 15.5H18.5V19.5H14.5V15.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const SearchIcon = forwardRef(function SearchIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "search",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M15.0355 15.0355L19 19M16.5 11.5C16.5 14.2614 14.2614 16.5 11.5 16.5C8.73858 16.5 6.5 14.2614 6.5 11.5C6.5 8.73858 8.73858 6.5 11.5 6.5C14.2614 6.5 16.5 8.73858 16.5 11.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const SelectIcon = forwardRef(function SelectIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "select",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M16.5 15.5L12.5 19.5L8.5 15.5M8.5 9.5L12.5 5.5L16.5 9.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ShareIcon = forwardRef(function ShareIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "share",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M15 9.5H18.5V19.5H6.5L6.5 9.5H10M12.5 16V3.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M9.5 6.5L12.5 3.5L15.5 6.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const SortIcon = forwardRef(function SortIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "sort",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M8.5 18.5V6M16.5 19V6.5M12 15L8.5 18.5L5 15M13 10L16.5 6.5L20 10",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const SparkleIcon = forwardRef(function SparkleIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "sparkle",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M10.5 10.5C8.5 12.5 5 12.5 5 12.5C5 12.5 8.5 12.5 10.5 14.5C12.5 16.5 12.5 20 12.5 20C12.5 20 12.5 16.5 14.5 14.5C16.5 12.5 20 12.5 20 12.5C20 12.5 16.5 12.5 14.5 10.5C12.5 8.5 12.5 5 12.5 5C12.5 5 12.5 8.5 10.5 10.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const SparklesIcon = forwardRef(function SparklesIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "sparkles",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M11 3.5V5M11 5V6.5M11 5H12.5M11 5H9.5M9.5 15C9.5 15 12.2308 14.7692 13.5 13.5C14.7692 12.2308 15 9.5 15 9.5C15 9.5 15.2308 12.2308 16.5 13.5C17.7692 14.7692 20.5 15 20.5 15C20.5 15 17.7692 15.2308 16.5 16.5C15.2308 17.7692 15 20.5 15 20.5C15 20.5 14.7692 17.7692 13.5 16.5C12.2308 15.2308 9.5 15 9.5 15ZM4.5 10C4.5 10 5.72308 9.87692 6.3 9.3C6.87692 8.72308 7 7.5 7 7.5C7 7.5 7.12308 8.72308 7.7 9.3C8.27692 9.87692 9.5 10 9.5 10C9.5 10 8.27692 10.1231 7.7 10.7C7.12308 11.2769 7 12.5 7 12.5C7 12.5 6.87692 11.2769 6.3 10.7C5.72308 10.1231 4.5 10 4.5 10Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })
  });
});
const SpinnerIcon = forwardRef(function SpinnerIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "spinner",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M4.5 12.5C4.5 16.9183 8.08172 20.5 12.5 20.5C16.9183 20.5 20.5 16.9183 20.5 12.5C20.5 8.08172 16.9183 4.5 12.5 4.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const SplitHorizontalIcon = forwardRef(function SplitHorizontalIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "split-horizontal",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M19.5 10.5V20.5H5.5V10.5M19.5 10.5H5.5M19.5 10.5V4.5H5.5V10.5M12.5 13V15.5M12.5 18V15.5M12.5 15.5H15M12.5 15.5H10",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const SplitVerticalIcon = forwardRef(function SplitVerticalIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "split-vertical",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M10.5 5.5V19.5M13 12.5H15.5M18 12.5H15.5M15.5 12.5V15M15.5 12.5V10M4.5 5.5H20.5V19.5H4.5V5.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const SquareIcon = forwardRef(function SquareIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "square",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("rect", {
      x: 5.5,
      y: 5.5,
      width: 14,
      height: 14,
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const StackCompactIcon = forwardRef(function StackCompactIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "stack-compact",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M5.5 15.5V18.5H19.5V15.5M5.5 15.5H19.5M5.5 15.5V9.5M19.5 15.5V9.5M5.5 9.5V6.5H19.5V9.5M5.5 9.5H19.5M5.5 12.5H19.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const StackIcon = forwardRef(function StackIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "stack",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M5.5 12.5H19.5M5.5 18.5H19.5V6.5H5.5V18.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const StarIcon = forwardRef(function StarIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "star",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M13 4L15.2747 9.8691L21.5595 10.2188L16.6806 14.1959L18.2901 20.2812L13 16.87L7.70993 20.2812L9.31941 14.1959L4.44049 10.2188L10.7253 9.8691L13 4Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const StopIcon = forwardRef(function StopIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "stop",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("rect", {
      x: 7.5,
      y: 7.5,
      width: 10,
      height: 10,
      fill: "currentColor",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const StrikethroughIcon = forwardRef(function StrikethroughIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "strikethrough",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M12.5656 7.73438C11.0656 7.73438 10.0734 8.48438 10.0734 9.625C10.0734 10.2317 10.3649 10.6613 11.0519 11H8.90358C8.71703 10.6199 8.62813 10.1801 8.62813 9.67188C8.62813 7.75781 10.2297 6.46094 12.6125 6.46094C14.7922 6.46094 16.4172 7.75781 16.5344 9.57812H15.1203C14.925 8.42188 13.9719 7.73438 12.5656 7.73438Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M12.4875 18.2656C10.0969 18.2656 8.44844 17 8.3 15.0547H9.72188C9.89375 16.2344 11.0188 16.9844 12.6203 16.9844C14.1359 16.9844 15.2531 16.1641 15.2531 15.0469C15.2531 14.6375 15.1255 14.292 14.8589 14H16.5912C16.6638 14.266 16.6984 14.5566 16.6984 14.875C16.6984 16.9453 15.0656 18.2656 12.4875 18.2656Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M7 13.1H18V11.9H7V13.1Z",
      fill: "currentColor"
    })]
  });
});
const StringIcon = forwardRef(function StringIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "string",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M11.6748 15.5227H13.1855L9.87842 6.36304H8.34863L5.0415 15.5227H6.50146L7.3457 13.0916H10.8369L11.6748 15.5227ZM9.04053 8.02612H9.14844L10.4751 11.8982H7.70752L9.04053 8.02612Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M16.8101 14.488C16.0674 14.488 15.5278 14.1262 15.5278 13.5042C15.5278 12.8948 15.9595 12.571 16.9116 12.5076L18.6001 12.3997V12.9773C18.6001 13.8342 17.8384 14.488 16.8101 14.488ZM16.4609 15.637C17.3687 15.637 18.124 15.2434 18.5366 14.5515H18.6445V15.5227H19.9585V10.8C19.9585 9.34009 18.981 8.47681 17.248 8.47681C15.6802 8.47681 14.563 9.23853 14.4233 10.4255H15.7437C15.896 9.93677 16.4229 9.65747 17.1846 9.65747C18.1177 9.65747 18.6001 10.0701 18.6001 10.8V11.3967L16.7275 11.5046C15.0835 11.6062 14.1567 12.3235 14.1567 13.5676C14.1567 14.8308 15.1279 15.637 16.4609 15.637Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M19.9585 18.637L5.0415 18.637V17.437L19.9585 17.437V18.637Z",
      fill: "currentColor"
    })]
  });
});
const SunIcon = forwardRef(function SunIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "sun",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M19 12.5H22M3 12.5H6M12.5 6V3M12.5 22V19M17.3891 7.61091L19.5104 5.48959M5.48959 19.5104L7.61091 17.3891M7.61091 7.61091L5.48959 5.48959M19.5104 19.5104L17.3891 17.3891M16 12.5C16 14.433 14.433 16 12.5 16C10.567 16 9 14.433 9 12.5C9 10.567 10.567 9 12.5 9C14.433 9 16 10.567 16 12.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const SyncIcon = forwardRef(function SyncIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "sync",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M13.5 4.5H12.5C8.08172 4.5 4.5 8.08172 4.5 12.5C4.5 15.6631 6.33576 18.3975 9 19.6958M11.5 20.5H12.5C16.9183 20.5 20.5 16.9183 20.5 12.5C20.5 9.33688 18.6642 6.60253 16 5.30423",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M14 17.5619L11.5 20.5L14.5 23.0619M11 7.43811L13.5 4.50001L10.5 1.93811",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const TagIcon$1 = forwardRef(function TagIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "tag",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M12.5 20L5 20L5 12.5L12.5 5L20 12.5L12.5 20Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M11 15.5C11 16.3284 10.3284 17 9.5 17C8.67157 17 8 16.3284 8 15.5C8 14.6716 8.67157 14 9.5 14C10.3284 14 11 14.6716 11 15.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const TagsIcon = forwardRef(function TagsIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "tags",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M12.1562 7.93179L13.9717 6.11633L20.3553 12.5L13.9717 18.8836L10.6855 18.8836M11.0283 18.8836L17.4119 12.5L11.0283 6.11633L4.64462 12.5L4.64462 18.8836L11.0283 18.8836ZM9.75153 15.0534C9.75153 15.7585 9.17992 16.3302 8.47481 16.3302C7.76969 16.3302 7.19808 15.7585 7.19808 15.0534C7.19808 14.3483 7.76969 13.7767 8.47481 13.7767C9.17992 13.7767 9.75153 14.3483 9.75153 15.0534Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const TerminalIcon = forwardRef(function TerminalIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "terminal",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M8.5 9.5L11.5 12.5L8.5 15.5M13 15.5H17M5.5 6.5H19.5V18.5H5.5V6.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ThLargeIcon = forwardRef(function ThLargeIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "th-large",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M12.5 6.5V12.5M12.5 12.5V18.5M12.5 12.5H20.5M12.5 12.5H4.5M4.5 6.5H20.5V18.5H4.5V6.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ThListIcon = forwardRef(function ThListIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "th-list",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M9.5 6.5V10.5M9.5 10.5V14.5M9.5 10.5H20.5M9.5 10.5H4.5M9.5 14.5V18.5M9.5 14.5H20.5M9.5 14.5H4.5M4.5 6.5H20.5V18.5H4.5V6.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const TiersIcon = forwardRef(function TiersIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "tiers",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M16.5 14.5L20.5 16.5L12.5 20.5L4.5 16.5L8.5 14.5M16.5 10.5L20.5 12.5L12.5 16.5L4.5 12.5L8.5 10.5M12.5 12.5L20.5 8.5L12.5 4.5L4.5 8.5L12.5 12.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const ToggleArrowRightIcon = forwardRef(function ToggleArrowRightIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "toggle-arrow-right",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M10 16.5V8.5L16 12.5L10 16.5Z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeLinejoin: "round"
    })
  });
});
const TokenIcon = forwardRef(function TokenIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "token",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M17.5711 12.5C17.5711 15.2614 15.3325 17.5 12.5711 17.5M7.57107 12.5C7.57107 9.73858 9.80964 7.5 12.5711 7.5M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const TransferIcon = forwardRef(function TransferIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "transfer",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M19.5 16.5H6M5.5 8.5L19 8.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M16 13L19.5 16.5L16 20M9 12L5.5 8.5L9 5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const TranslateIcon = forwardRef(function TranslateIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "translate",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M9.4 5.4H4V6.6H13.2189C13.1612 6.78478 13.0895 6.99578 13.0025 7.22211C12.7032 8.00031 12.2402 8.91125 11.5757 9.57574L10 11.1515L9.42426 10.5757C8.72102 9.8725 8.25297 9.16987 7.96199 8.64611C7.81668 8.38455 7.71617 8.16874 7.65305 8.02146C7.62151 7.94787 7.59937 7.89154 7.5857 7.85534C7.57886 7.83725 7.57415 7.8242 7.57144 7.81657L7.56886 7.80922C7.56886 7.80922 7.56921 7.81026 7 8C6.43079 8.18974 6.43091 8.19009 6.43091 8.19009L6.43133 8.19135L6.43206 8.19351L6.4341 8.19948L6.44052 8.21786C6.44587 8.23292 6.45336 8.25357 6.46313 8.27942C6.48266 8.33112 6.5113 8.40369 6.55008 8.49416C6.62758 8.67501 6.74582 8.92795 6.91301 9.22889C7.24703 9.83013 7.77898 10.6275 8.57574 11.4243L9.15147 12L4.57964 16.5718L4.57655 16.5749L4.57577 16.5757L5.4243 17.4242L5.42688 17.4216L10.0368 12.8117L12.6159 14.9609L13.3841 14.0391L10.8888 11.9597L12.4243 10.4243C13.2598 9.58875 13.7968 8.49969 14.1225 7.65289C14.2818 7.23863 14.395 6.87072 14.4696 6.6H16V5.4H10.6V4H9.4V5.4ZM17.4405 10L21.553 19.7672H20.2509L19.1279 17.1H14.8721L13.7491 19.7672H12.447L16.5595 10H17.4405ZM15.3773 15.9H18.6227L17 12.0462L15.3773 15.9Z",
      fill: "currentColor"
    })
  });
});
const TrashIcon = forwardRef(function TrashIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "trash",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M5 6.5H20M10 6.5V4.5C10 3.94772 10.4477 3.5 11 3.5H14C14.5523 3.5 15 3.94772 15 4.5V6.5M12.5 9V17M15.5 9L15 17M9.5 9L10 17M18.5 6.5L17.571 18.5767C17.5309 19.0977 17.0965 19.5 16.574 19.5H8.42603C7.90349 19.5 7.46905 19.0977 7.42898 18.5767L6.5 6.5H18.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const TrendUpwardIcon = forwardRef(function TrendUpwardIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "trend-upward",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M4.5 18.5L11.5 10.5L13.5 14.5L20.5 6.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M20.5 11V6.5H16",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const TriangleOutlineIcon = forwardRef(function TriangleOutlineIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "triangle-outline",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M20.5 18.5H4.5L12.5 5.5L20.5 18.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const TrolleyIcon = forwardRef(function TrolleyIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "trolley",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M8 17.5L5.81763 6.26772C5.71013 5.81757 5.30779 5.5 4.84498 5.5H3M8 17.5H17M8 17.5C8.82843 17.5 9.5 18.1716 9.5 19C9.5 19.8284 8.82843 20.5 8 20.5C7.17157 20.5 6.5 19.8284 6.5 19C6.5 18.1716 7.17157 17.5 8 17.5ZM17 17.5C17.8284 17.5 18.5 18.1716 18.5 19C18.5 19.8284 17.8284 20.5 17 20.5C16.1716 20.5 15.5 19.8284 15.5 19C15.5 18.1716 16.1716 17.5 17 17.5ZM7.78357 14.5H17.5L19 7.5H6",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const TruncateIcon = forwardRef(function TruncateIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "truncate",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M5 12.5H20M8.5 19.5L12.5 15.5L16.5 19.5M16.5 5.5L12.5 9.5L8.5 5.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const TwitterIcon = forwardRef(function TwitterIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "twitter",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M18.8738 6.65751C18.1994 5.9447 17.2445 5.5 16.1857 5.5C14.1423 5.5 12.4857 7.15655 12.4857 9.2C12.4857 9.55263 12.535 9.89374 12.6272 10.2168C7.0826 9.56422 4.55703 6.02857 4.55703 6.02857C4.55703 6.02857 4.02846 9.2 6.14274 11.3143C5.08571 11.3143 4.55703 10.7857 4.55703 10.7857C4.55703 10.7857 4.55703 13.4286 7.19989 14.4857C6.67143 15.0143 5.61417 14.4857 5.61417 14.4857C5.97533 15.9303 7.45606 16.8562 8.82133 17.1358C6.67298 19.1676 3.5 18.7143 3.5 18.7143C5.14562 19.771 7.21334 20.3 9.31429 20.3C16.1214 20.3 19.8162 15.6315 19.8848 9.37762C20.8722 8.58943 22 7.08571 22 7.08571C22 7.08571 21.277 7.45458 19.6913 7.98315C21.277 6.92601 21.4714 5.5 21.4714 5.5C21.4714 5.5 20.4135 6.55789 18.8738 6.65751Z",
      fill: "currentColor"
    })
  });
});
const UlistIcon = forwardRef(function UlistIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "ulist",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M7.10153 17.5001C7.10153 17.8323 6.83221 18.1016 6.5 18.1016C6.16778 18.1016 5.89847 17.8323 5.89847 17.5001C5.89847 17.1678 6.16778 16.8985 6.5 16.8985C6.83221 16.8985 7.10153 17.1678 7.10153 17.5001Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M7.10153 7.5C7.10153 7.83221 6.83221 8.10153 6.5 8.10153C6.16778 8.10153 5.89847 7.83221 5.89847 7.5C5.89847 7.16778 6.16778 6.89847 6.5 6.89847C6.83221 6.89847 7.10153 7.16778 7.10153 7.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M7.10153 12.5C7.10153 12.8322 6.83221 13.1015 6.5 13.1015C6.16778 13.1015 5.89847 12.8322 5.89847 12.5C5.89847 12.1678 6.16778 11.8985 6.5 11.8985C6.83221 11.8985 7.10153 12.1678 7.10153 12.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M10 7.5H19M10 17.5H19M10 12.5H19",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const UnderlineIcon = forwardRef(function UnderlineIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "underline",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M9.52791 7.11407H8.17V14.2582C8.17 16.5817 9.79195 18.2565 12.4927 18.2565C15.1934 18.2565 16.8154 16.5817 16.8154 14.2582V7.11407H15.4574V14.1677C15.4574 15.8122 14.3787 17.0042 12.4927 17.0042C10.6067 17.0042 9.52791 15.8122 9.52791 14.1677V7.11407Z",
      fill: "currentColor"
    }), /* @__PURE__ */jsx("path", {
      d: "M7 20.5H18",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const UndoIcon = forwardRef(function UndoIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "undo",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M5.88468 17C7.32466 19.1128 9.75033 20.5 12.5 20.5C16.9183 20.5 20.5 16.9183 20.5 12.5C20.5 8.08172 16.9183 4.5 12.5 4.5C8.08172 4.5 4.5 8.08172 4.5 12.5V13.5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M7 11L4.5 13.5L2 11",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const UnknownIcon = forwardRef(function UnknownIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "unknown",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M12.5 13C12.5 11 14 11.5 14 10C14 9.34375 13.5 8.5 12.5 8.5C11.5 8.5 11 9 10.5 9.5M12.5 16V14.5M5.5 5.5H19.5V19.5H5.5V5.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const UnlockIcon = forwardRef(function UnlockIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "unlock",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M9.5 11.5V8.5C9.5 6.5 8 5.5 6.5 5.5C5 5.5 3.5 6.5 3.5 8.5V11.5M7.5 11.5H17.5V19.5H7.5V11.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const UnpublishIcon = forwardRef(function UnpublishIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "unpublish",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M5 19.5H20M12.5 16V5",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M17.5 11L12.5 16L7.5 11",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const UploadIcon = forwardRef(function UploadIcon2(props, ref) {
  return /* @__PURE__ */jsxs("svg", {
    "data-sanity-icon": "upload",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: [/* @__PURE__ */jsx("path", {
      d: "M12.5 6.00003V15.5M5.5 15.5H19.5V19.5H5.5V15.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    }), /* @__PURE__ */jsx("path", {
      d: "M7.5 11L12.5 6.00003L17.5 11",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })]
  });
});
const UserIcon = forwardRef(function UserIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "user",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M8 14.5C7 15 5.5 16 5.5 19.5H19.5C19.5 16 18.3416 15.1708 17 14.5C16 14 14 14 14 12.5C14 11 15 10.25 15 8.25C15 6.25 14 5.25 12.5 5.25C11 5.25 10 6.25 10 8.25C10 10.25 11 11 11 12.5C11 14 9 14 8 14.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const UsersIcon = forwardRef(function UsersIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "users",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M17.5 18.5H21.5C21.5 15 20.8416 14.1708 19.5 13.5C18.5 13 16.5 12.5 16.5 11C16.5 9.5 17.5 9 17.5 7C17.5 5 16.5 4 15 4C13.6628 4 12.723 4.79472 12.5347 6.38415M4.5 20.5C4.5 17 5.5 16 6.5 15.5C7.5 15 9.5 14.5 9.5 13C9.5 11.5 8.5 11 8.5 9C8.5 7 9.5 6 11 6C12.5 6 13.5 7 13.5 9C13.5 11 12.5 11.5 12.5 13C12.5 14.5 14.5 15 15.5 15.5C16.8416 16.1708 17.5 17 17.5 20.5H4.5Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const WarningFilledIcon = forwardRef(function WarningFilledIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "warning-filled",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14.741 5.12637C13.7357 3.41737 11.2643 3.41737 10.259 5.12637L3.7558 16.1818C2.73624 17.915 3.98595 20.1 5.99683 20.1H19.0032C21.014 20.1 22.2637 17.915 21.2442 16.1818L14.741 5.12637ZM11.9 9V13H13.1V9H11.9ZM13.1 16V14.5H11.9V16H13.1Z",
      fill: "currentColor"
    })
  });
});
const WarningOutlineIcon = forwardRef(function WarningOutlineIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "warning-outline",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M12.5 9V13M12.5 16V14.5M14.2239 5.43058L20.727 16.486C21.5113 17.8192 20.55 19.5 19.0032 19.5H5.99683C4.45 19.5 3.48869 17.8192 4.27297 16.486L10.7761 5.43058C11.5494 4.11596 13.4506 4.11596 14.2239 5.43058Z",
      stroke: "currentColor",
      strokeWidth: 1.2,
      strokeLinejoin: "round"
    })
  });
});
const WrenchIcon = forwardRef(function WrenchIcon2(props, ref) {
  return /* @__PURE__ */jsx("svg", {
    "data-sanity-icon": "wrench",
    width: "1em",
    height: "1em",
    viewBox: "0 0 25 25",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    ...props,
    children: /* @__PURE__ */jsx("path", {
      d: "M17.0407 5.14624L17.4649 5.57051C17.6166 5.41887 17.6757 5.19783 17.6202 4.99071C17.5646 4.78359 17.4027 4.62189 17.1955 4.56656L17.0407 5.14624ZM14.4013 7.7856L13.977 7.36134C13.8288 7.50959 13.7687 7.72447 13.8185 7.92813L14.4013 7.7856ZM12.8778 6.26211L12.4535 5.83784V5.83784L12.8778 6.26211ZM11.8309 10.6568L12.2552 11.0811C12.4152 10.9211 12.4716 10.6847 12.401 10.4697L11.8309 10.6568ZM5.63925 16.8485L5.21498 16.4242H5.21498L5.63925 16.8485ZM5.63925 19.935L6.06351 19.5108H6.06351L5.63925 19.935ZM8.72581 19.935L9.15007 20.3593L8.72581 19.935ZM15.1184 13.5425L15.2301 12.953C15.0351 12.916 14.8344 12.9779 14.6941 13.1182L15.1184 13.5425ZM18.9718 12.3561L19.3961 12.7804L18.9718 12.3561ZM20.0877 8.19324L20.6674 8.03843C20.612 7.83125 20.4503 7.66934 20.2432 7.61375C20.0361 7.55816 19.815 7.61734 19.6634 7.76898L20.0877 8.19324ZM17.4483 10.8326L17.3058 11.4154C17.5094 11.4652 17.7243 11.4051 17.8726 11.2569L17.4483 10.8326ZM15 10.2339L14.4172 10.3764C14.4704 10.5938 14.6401 10.7635 14.8575 10.8167L15 10.2339ZM16.6164 4.72198L13.977 7.36134L14.8256 8.20986L17.4649 5.57051L16.6164 4.72198ZM13.3021 6.68637C14.2723 5.71612 15.6467 5.39501 16.8859 5.72593L17.1955 4.56656C15.5595 4.12966 13.7389 4.55245 12.4535 5.83784L13.3021 6.68637ZM12.401 10.4697C11.9779 9.18109 12.2794 7.70907 13.3021 6.68637L12.4535 5.83784C11.0985 7.19284 10.7021 9.14218 11.2608 10.844L12.401 10.4697ZM11.4066 10.2326L5.21498 16.4242L6.06351 17.2727L12.2552 11.0811L11.4066 10.2326ZM5.21498 16.4242C4.12834 17.5109 4.12834 19.2727 5.21498 20.3593L6.06351 19.5108C5.4455 18.8928 5.4455 17.8908 6.06351 17.2727L5.21498 16.4242ZM5.21498 20.3593C6.30163 21.446 8.06343 21.446 9.15007 20.3593L8.30155 19.5108C7.68353 20.1288 6.68153 20.1288 6.06351 19.5108L5.21498 20.3593ZM9.15007 20.3593L15.5426 13.9668L14.6941 13.1182L8.30155 19.5108L9.15007 20.3593ZM18.5475 11.9318C17.6463 12.8331 16.3968 13.1742 15.2301 12.953L15.0066 14.132C16.5466 14.4239 18.2023 13.9741 19.3961 12.7804L18.5475 11.9318ZM19.508 8.34804C19.8389 9.58721 19.5178 10.9616 18.5475 11.9318L19.3961 12.7804C20.6815 11.495 21.1043 9.67445 20.6674 8.03843L19.508 8.34804ZM17.8726 11.2569L20.5119 8.6175L19.6634 7.76898L17.024 10.4083L17.8726 11.2569ZM14.8575 10.8167L17.3058 11.4154L17.5908 10.2498L15.1426 9.65106L14.8575 10.8167ZM13.8185 7.92813L14.4172 10.3764L15.5829 10.0914L14.9841 7.64307L13.8185 7.92813Z",
      fill: "currentColor"
    })
  });
});
const icons = {
  "access-denied": AccessDeniedIcon,
  activity: ActivityIcon,
  "add-circle": AddCircleIcon,
  add: AddIcon,
  api: ApiIcon,
  archive: ArchiveIcon,
  "arrow-down": ArrowDownIcon,
  "arrow-left": ArrowLeftIcon,
  "arrow-right": ArrowRightIcon,
  "arrow-top-right": ArrowTopRightIcon,
  "arrow-up": ArrowUpIcon,
  "bar-chart": BarChartIcon,
  basket: BasketIcon,
  bell: BellIcon,
  bill: BillIcon,
  "binary-document": BinaryDocumentIcon,
  "block-content": BlockContentIcon,
  "block-element": BlockElementIcon,
  blockquote: BlockquoteIcon,
  bold: BoldIcon,
  book: BookIcon,
  bottle: BottleIcon,
  "bulb-filled": BulbFilledIcon,
  "bulb-outline": BulbOutlineIcon,
  calendar: CalendarIcon,
  case: CaseIcon,
  "chart-upward": ChartUpwardIcon,
  "checkmark-circle": CheckmarkCircleIcon,
  checkmark: CheckmarkIcon,
  "chevron-down": ChevronDownIcon,
  "chevron-left": ChevronLeftIcon,
  "chevron-right": ChevronRightIcon,
  "chevron-up": ChevronUpIcon,
  circle: CircleIcon,
  clipboard: ClipboardIcon,
  "clipboard-image": ClipboardImageIcon,
  clock: ClockIcon,
  "close-circle": CloseCircleIcon,
  close: CloseIcon,
  "code-block": CodeBlockIcon,
  code: CodeIcon,
  cog: CogIcon,
  collapse: CollapseIcon,
  "color-wheel": ColorWheelIcon,
  comment: CommentIcon,
  component: ComponentIcon,
  compose: ComposeIcon,
  controls: ControlsIcon,
  copy: CopyIcon,
  "credit-card": CreditCardIcon,
  crop: CropIcon,
  dashboard: DashboardIcon,
  database: DatabaseIcon,
  desktop: DesktopIcon,
  document: DocumentIcon,
  "document-pdf": DocumentPdfIcon,
  "document-remove": DocumentRemoveIcon,
  "document-sheet": DocumentSheetIcon,
  "document-text": DocumentTextIcon,
  "document-video": DocumentVideoIcon,
  "document-word": DocumentWordIcon,
  "document-zip": DocumentZipIcon,
  documents: DocumentsIcon,
  dot: DotIcon,
  "double-chevron-down": DoubleChevronDownIcon,
  "double-chevron-left": DoubleChevronLeftIcon,
  "double-chevron-right": DoubleChevronRightIcon,
  "double-chevron-up": DoubleChevronUpIcon,
  download: DownloadIcon,
  "drag-handle": DragHandleIcon,
  drop: DropIcon,
  "earth-americas": EarthAmericasIcon,
  "earth-globe": EarthGlobeIcon,
  edit: EditIcon,
  "ellipsis-horizontal": EllipsisHorizontalIcon,
  "ellipsis-vertical": EllipsisVerticalIcon,
  enter: EnterIcon,
  "enter-right": EnterRightIcon,
  envelope: EnvelopeIcon,
  equal: EqualIcon,
  "error-filled": ErrorFilledIcon,
  "error-outline": ErrorOutlineIcon,
  expand: ExpandIcon,
  "eye-closed": EyeClosedIcon,
  "eye-open": EyeOpenIcon,
  filter: FilterIcon,
  folder: FolderIcon,
  generate: GenerateIcon,
  groq: GroqIcon,
  "heart-filled": HeartFilledIcon,
  heart: HeartIcon,
  "help-circle": HelpCircleIcon,
  home: HomeIcon,
  "ice-cream": IceCreamIcon,
  image: ImageIcon,
  "image-remove": ImageRemoveIcon,
  images: ImagesIcon,
  "info-filled": InfoFilledIcon,
  "info-outline": InfoOutlineIcon,
  "inline-element": InlineElementIcon,
  inline: InlineIcon,
  "insert-above": InsertAboveIcon,
  "insert-below": InsertBelowIcon,
  italic: ItalicIcon,
  joystick: JoystickIcon,
  launch: LaunchIcon,
  leave: LeaveIcon,
  lemon: LemonIcon,
  link: LinkIcon,
  "link-removed": LinkRemovedIcon,
  lock: LockIcon,
  "logo-js": LogoJsIcon,
  "logo-ts": LogoTsIcon,
  "master-detail": MasterDetailIcon,
  menu: MenuIcon,
  "mobile-device": MobileDeviceIcon,
  moon: MoonIcon,
  number: NumberIcon,
  "ok-hand": OkHandIcon,
  olist: OlistIcon,
  overage: OverageIcon,
  package: PackageIcon,
  pause: PauseIcon,
  pin: PinIcon,
  "pin-removed": PinRemovedIcon,
  play: PlayIcon,
  plug: PlugIcon,
  presentation: PresentationIcon,
  publish: PublishIcon,
  "read-only": ReadOnlyIcon,
  "remove-circle": RemoveCircleIcon,
  remove: RemoveIcon,
  reset: ResetIcon,
  restore: RestoreIcon,
  retrieve: RetrieveIcon,
  retry: RetryIcon,
  revert: RevertIcon,
  robot: RobotIcon,
  rocket: RocketIcon,
  schema: SchemaIcon,
  search: SearchIcon,
  select: SelectIcon,
  share: ShareIcon,
  sort: SortIcon,
  sparkle: SparkleIcon,
  sparkles: SparklesIcon,
  spinner: SpinnerIcon,
  "split-horizontal": SplitHorizontalIcon,
  "split-vertical": SplitVerticalIcon,
  square: SquareIcon,
  "stack-compact": StackCompactIcon,
  stack: StackIcon,
  star: StarIcon,
  stop: StopIcon,
  strikethrough: StrikethroughIcon,
  string: StringIcon,
  sun: SunIcon,
  sync: SyncIcon,
  tag: TagIcon$1,
  tags: TagsIcon,
  terminal: TerminalIcon,
  "th-large": ThLargeIcon,
  "th-list": ThListIcon,
  tiers: TiersIcon,
  "toggle-arrow-right": ToggleArrowRightIcon,
  token: TokenIcon,
  transfer: TransferIcon,
  translate: TranslateIcon,
  trash: TrashIcon,
  "trend-upward": TrendUpwardIcon,
  "triangle-outline": TriangleOutlineIcon,
  trolley: TrolleyIcon,
  truncate: TruncateIcon,
  twitter: TwitterIcon,
  ulist: UlistIcon,
  underline: UnderlineIcon,
  undo: UndoIcon,
  unknown: UnknownIcon,
  unlock: UnlockIcon,
  unpublish: UnpublishIcon,
  upload: UploadIcon,
  user: UserIcon,
  users: UsersIcon,
  "warning-filled": WarningFilledIcon,
  "warning-outline": WarningOutlineIcon,
  wrench: WrenchIcon
};
const Icon = forwardRef(function Icon2(props, ref) {
  const {
    symbol,
    ...restProps
  } = props;
  const iconComponent = icons[symbol];
  if (!iconComponent) {
    return null;
  }
  return createElement(iconComponent, {
    ...restProps,
    ref
  });
});
const useKeyPress = (hotkey, onPress) => {
  const keyPressed = useRef(false);
  const downHandler = useCallback(e => {
    if (isHotkey(hotkey, e)) {
      keyPressed.current = true;
      if (onPress) {
        onPress();
      }
    }
  }, [hotkey, onPress]);
  const upHandler = useCallback(() => {
    keyPressed.current = false;
  }, []);
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [downHandler, upHandler]);
  return keyPressed;
};
var __freeze$q = Object.freeze;
var __defProp$r = Object.defineProperty;
var __template$q = (cooked, raw) => __freeze$q(__defProp$r(cooked, "raw", {
  value: __freeze$q(raw || cooked.slice())
}));
var _a$q, _b$g, _c$4, _d$2;
const divider = {
  type: "divider"
};
const inputs = {
  altText: {
    assetTypes: ["file", "image"],
    field: "altText",
    name: "altText",
    operatorType: "empty",
    operatorTypes: ["empty", "notEmpty", null, "includes", "doesNotInclude"],
    title: "Alt text",
    type: "string",
    value: ""
  },
  description: {
    assetTypes: ["file", "image"],
    field: "description",
    name: "description",
    operatorType: "empty",
    operatorTypes: ["empty", "notEmpty", null, "includes", "doesNotInclude"],
    title: "Description",
    type: "string",
    value: ""
  },
  fileName: {
    assetTypes: ["file", "image"],
    field: "originalFilename",
    name: "filename",
    operatorType: "includes",
    operatorTypes: ["includes", "doesNotInclude"],
    title: "File name",
    type: "string",
    value: ""
  },
  height: {
    assetTypes: ["image"],
    field: "metadata.dimensions.height",
    name: "height",
    operatorType: "greaterThan",
    operatorTypes: ["greaterThan", "greaterThanOrEqualTo", "lessThan", "lessThanOrEqualTo", null, "equalTo"],
    title: "Height",
    type: "number",
    value: 400
  },
  inCurrentDocument: {
    assetTypes: ["file", "image"],
    name: "inCurrentDocument",
    operatorType: "is",
    options: [{
      name: "true",
      title: "True",
      value: groq(_a$q || (_a$q = __template$q(["_id in $documentAssetIds"])))
    }, {
      name: "false",
      title: "False",
      value: groq(_b$g || (_b$g = __template$q(["!(_id in $documentAssetIds)"])))
    }],
    selectOnly: true,
    title: "In use in current document",
    type: "select",
    value: "true"
  },
  inUse: {
    assetTypes: ["file", "image"],
    name: "inUse",
    operatorType: "is",
    options: [{
      name: "true",
      title: "True",
      value: groq(_c$4 || (_c$4 = __template$q(["count(*[references(^._id)]) > 0"])))
    }, {
      name: "false",
      title: "False",
      value: groq(_d$2 || (_d$2 = __template$q(["count(*[references(^._id)]) == 0"])))
    }],
    title: "In use",
    type: "select",
    value: "true"
  },
  isOpaque: {
    assetTypes: ["image"],
    field: "metadata.isOpaque",
    name: "isOpaque",
    operatorType: "equalTo",
    options: [{
      name: "true",
      title: "True",
      value: "false"
    }, {
      name: "false",
      title: "False",
      value: "true"
    }],
    title: "Has transparency",
    type: "select",
    value: "true"
  },
  orientation: {
    assetTypes: ["image"],
    name: "orientation",
    operatorType: "is",
    operatorTypes: ["is", "isNot"],
    options: [{
      name: "portrait",
      title: "Portrait",
      value: "metadata.dimensions.aspectRatio < 1"
    }, {
      name: "landscape",
      title: "Landscape",
      value: "metadata.dimensions.aspectRatio > 1"
    }, {
      name: "square",
      title: "Square",
      value: "metadata.dimensions.aspectRatio == 1"
    }],
    title: "Orientation",
    type: "select",
    value: "portrait"
  },
  size: {
    assetTypes: ["file", "image"],
    field: "size",
    modifier: "kb",
    modifiers: [{
      name: "kb",
      title: "KB",
      fieldModifier: fieldName => "round(".concat(fieldName, " / 1000)")
    }, {
      name: "mb",
      title: "MB",
      fieldModifier: fieldName => "round(".concat(fieldName, " / 1000000)")
    }],
    name: "size",
    operatorType: "greaterThan",
    operatorTypes: ["greaterThan", "greaterThanOrEqualTo", "lessThan", "lessThanOrEqualTo", null, "equalTo"],
    title: "File size",
    type: "number",
    value: 0
  },
  tag: {
    assetTypes: ["file", "image"],
    field: "opt.media.tags",
    name: "tag",
    operatorType: "references",
    operatorTypes: ["references", "doesNotReference", null, "empty", "notEmpty"],
    title: "Tags",
    type: "searchable"
  },
  season: {
    assetTypes: ["file", "image"],
    field: "season",
    name: "season",
    operatorType: "references",
    operatorTypes: ["references", "doesNotReference", null, "empty", "notEmpty"],
    title: "Seasons",
    type: "searchable"
  },
  title: {
    assetTypes: ["file", "image"],
    field: "title",
    name: "title",
    operatorType: "empty",
    operatorTypes: ["empty", "notEmpty", null, "includes", "doesNotInclude"],
    title: "Title",
    type: "string",
    value: ""
  },
  type: {
    assetTypes: ["file", "image"],
    name: "type",
    operatorType: "is",
    operatorTypes: ["is", "isNot"],
    options: [{
      name: "image",
      title: "Image",
      value: 'mimeType match "image*"'
    }, {
      name: "video",
      title: "Video",
      value: 'mimeType match "video*"'
    }, {
      name: "audio",
      title: "Audio",
      value: 'mimeType match "audio*"'
    }, {
      name: "pdf",
      title: "PDF",
      value: 'mimeType == "application/pdf"'
    }],
    title: "File type",
    type: "select",
    value: "image"
  },
  width: {
    assetTypes: ["image"],
    field: "metadata.dimensions.width",
    name: "width",
    operatorType: "greaterThan",
    operatorTypes: ["greaterThan", "greaterThanOrEqualTo", "lessThan", "lessThanOrEqualTo", null, "equalTo"],
    title: "Width",
    type: "number",
    value: 400
  }
};
const operators = {
  doesNotInclude: {
    fn: (value, field) => value ? "!(".concat(field, " match '*").concat(value, "*')") : void 0,
    label: "does not include"
  },
  doesNotReference: {
    fn: (value, _field) => value ? "!references('".concat(value, "')") : void 0,
    label: "does not include"
  },
  empty: {
    fn: (_value, field) => "!defined(".concat(field, ")"),
    hideInput: true,
    label: "is empty"
  },
  equalTo: {
    fn: (value, field) => value ? "".concat(field, " == ").concat(value) : void 0,
    label: "is equal to"
  },
  greaterThan: {
    fn: (value, field) => value ? "".concat(field, " > ").concat(value) : void 0,
    label: "is greater than"
  },
  greaterThanOrEqualTo: {
    fn: (value, field) => value ? "".concat(field, " >= ").concat(value) : void 0,
    label: "is greater than or equal to"
  },
  includes: {
    fn: (value, field) => value ? "".concat(field, " match '*").concat(value, "*'") : void 0,
    label: "includes"
  },
  is: {
    fn: (value, _field) => "".concat(value),
    label: "is"
  },
  isNot: {
    fn: (value, _field) => "!(".concat(value, ")"),
    label: "is not"
  },
  lessThan: {
    fn: (value, field) => value ? "".concat(field, " < ").concat(value) : void 0,
    label: "is less than"
  },
  lessThanOrEqualTo: {
    fn: (value, field) => value ? "".concat(field, " <= ").concat(value) : void 0,
    label: "is less than or equal to"
  },
  notEmpty: {
    fn: (_value, field) => "defined(".concat(field, ")"),
    hideInput: true,
    label: "is not empty"
  },
  references: {
    fn: (value, _field) => value ? "references('".concat(value, "')") : void 0,
    label: "includes"
  }
};
const ORDER_OPTIONS = [{
  direction: "desc",
  field: "_createdAt"
}, {
  direction: "asc",
  field: "_createdAt"
},
// Divider
null, {
  direction: "desc",
  field: "_updatedAt"
}, {
  direction: "asc",
  field: "_updatedAt"
},
// Divider
null, {
  direction: "asc",
  field: "originalFilename"
}, {
  direction: "desc",
  field: "originalFilename"
},
// Divider
null, {
  direction: "desc",
  field: "size"
}, {
  direction: "asc",
  field: "size"
}];
const FACETS = [inputs.tag, divider, inputs.inUse, inputs.inCurrentDocument, divider, inputs.title, inputs.altText, inputs.description, divider, inputs.isOpaque, divider, inputs.fileName, inputs.size, inputs.type, divider, inputs.orientation, inputs.width, inputs.height];
const GRID_TEMPLATE_COLUMNS = {
  SMALL: "3rem 100px auto 1.5rem",
  LARGE: "3rem 100px auto 5.5rem 5.5rem 3.5rem 8.5rem 4.75rem 2rem"
};
const PANEL_HEIGHT = 32;
const TAG_DOCUMENT_NAME = "media.tag";
const TAGS_PANEL_WIDTH = 250;
const SEASONS_DOCUMENT_NAME = "seasons";
const COLLABORATION_DOCUMENT_NAME = "collaborations";
const AssetSourceDispatchContext = createContext(void 0);
const AssetBrowserDispatchProvider = props => {
  const {
    children,
    onSelect
  } = props;
  const contextValue = {
    onSelect
  };
  return /* @__PURE__ */jsx(AssetSourceDispatchContext.Provider, {
    value: contextValue,
    children
  });
};
const useAssetSourceActions = () => {
  const context = useContext(AssetSourceDispatchContext);
  if (context === void 0) {
    throw new Error("useAssetSourceActions must be used within an AssetSourceDispatchProvider");
  }
  return context;
};
const useVersionedClient = () => useClient({
  apiVersion: "2022-10-01"
});
const ORDER_DICTIONARY = {
  _createdAt: {
    asc: "Last created: Oldest first",
    desc: "Last created: Newest first"
  },
  _updatedAt: {
    asc: "Last updated: Oldest first",
    desc: "Last updated: Newest first"
  },
  mimeType: {
    asc: "MIME type: A to Z",
    desc: "MIME type: Z to A"
  },
  originalFilename: {
    asc: "File name: A to Z",
    desc: "File name: Z to A"
  },
  size: {
    asc: "File size: Smallest first",
    desc: "File size: Largest first"
  }
};
const getOrderTitle = (field, direction) => {
  return ORDER_DICTIONARY[field][direction];
};
const debugThrottle = throttled => {
  return function (source) {
    return iif(() => !!throttled, source.pipe(delay(3e3), mergeMap(v => {
      if (Math.random() > 0.5) {
        return throwError({
          message: "Test error",
          statusCode: 500
        });
      }
      return of(v);
    })), source);
  };
};
var __freeze$p = Object.freeze;
var __defProp$q = Object.defineProperty;
var __template$p = (cooked, raw) => __freeze$p(__defProp$q(cooked, "raw", {
  value: __freeze$p(raw || cooked.slice())
}));
var _a$p, _b$f;
const constructFilter = _ref => {
  let {
    assetTypes,
    searchFacets,
    searchQuery
  } = _ref;
  const documentAssetTypes = assetTypes.map(type => "sanity.".concat(type, "Asset"));
  const baseFilter = groq(_a$p || (_a$p = __template$p(["\n    _type in ", ' && !(_id in path("drafts.**"))\n  '])), JSON.stringify(documentAssetTypes));
  const searchFacetFragments = searchFacets.reduce((acc, facet) => {
    var _a2;
    if (facet.type === "number") {
      const {
        field,
        modifier,
        modifiers,
        operatorType,
        value
      } = facet;
      const operator = operators[operatorType];
      const currentModifier = modifiers == null ? void 0 : modifiers.find(m => m.name === modifier);
      const facetField = (currentModifier == null ? void 0 : currentModifier.fieldModifier) ? currentModifier.fieldModifier(field) : field;
      const fragment = operator.fn(value, facetField);
      if (fragment) {
        acc.push(fragment);
      }
    }
    if (facet.type === "searchable") {
      const {
        field,
        operatorType,
        value
      } = facet;
      const operator = operators[operatorType];
      const fragment = operator.fn(value == null ? void 0 : value.value, field);
      if (fragment) {
        acc.push(fragment);
      }
    }
    if (facet.type === "select") {
      const {
        field,
        operatorType,
        options,
        value
      } = facet;
      const operator = operators[operatorType];
      const currentOptionValue = (_a2 = options == null ? void 0 : options.find(l => l.name === value)) == null ? void 0 : _a2.value;
      const fragment = operator.fn(currentOptionValue, field);
      if (fragment) {
        acc.push(fragment);
      }
    }
    if (facet.type === "string") {
      const {
        field,
        operatorType,
        value
      } = facet;
      const operator = operators[operatorType];
      const fragment = operator.fn(value, field);
      if (fragment) {
        acc.push(fragment);
      }
    }
    return acc;
  }, []);
  const constructedQuery = [
  // Base filter
  baseFilter,
  // Search query (if present)
  // NOTE: Currently this only searches direct fields on sanity.fileAsset/sanity.imageAsset and NOT referenced tags
  // It's possible to add this by adding the following line to the searchQuery, but it's quite slow
  // references(*[_type == "media.tag" && name.current == "${searchQuery.trim()}"]._id)
  ...(searchQuery ? [groq(_b$f || (_b$f = __template$p(["[_id, altText, assetId, description, originalFilename, title, url] match '*", "*'"])), searchQuery.trim())] : []),
  // Search facets
  ...searchFacetFragments].join(" && ");
  return constructedQuery;
};
var __freeze$o = Object.freeze;
var __defProp$p = Object.defineProperty;
var __template$o = (cooked, raw) => __freeze$o(__defProp$p(cooked, "raw", {
  value: __freeze$o(raw || cooked.slice())
}));
var _a$o, _b$e, _c$3;
const checkTagName = (client, name) => {
  return function (source) {
    return source.pipe(mergeMap(() => {
      return from(client.fetch(groq(_a$o || (_a$o = __template$o(['count(*[_type == "', '" && name.current == $name])'])), TAG_DOCUMENT_NAME), {
        name
      }));
    }), mergeMap(existingTagCount => {
      if (existingTagCount > 0) {
        return throwError({
          message: "Tag already exists",
          statusCode: 409
        });
      }
      return of(true);
    }));
  };
};
const checkSeasonName = (client, name) => {
  return function (source) {
    return source.pipe(mergeMap(() => {
      return from(client.fetch(groq(_b$e || (_b$e = __template$o(['count(*[_type == "', '" && name.current == $name])'])), SEASONS_DOCUMENT_NAME), {
        name
      }));
    }), mergeMap(existingSeasonCount => {
      if (existingSeasonCount > 0) {
        return throwError({
          message: "Season already exists",
          statusCode: 409
        });
      }
      return of(true);
    }));
  };
};
const checkCollaborationName = (client, name) => {
  return function (source) {
    return source.pipe(mergeMap(() => {
      return from(client.fetch(groq(_c$3 || (_c$3 = __template$o(['count(*[_type == "', '" && name.current == $name])'])), COLLABORATION_DOCUMENT_NAME), {
        name
      }));
    }), mergeMap(existingCollaborationCount => {
      if (existingCollaborationCount > 0) {
        return throwError({
          message: "Collaboration already exists",
          statusCode: 409
        });
      }
      return of(true);
    }));
  };
};
const getTagSelectOptions = tags => {
  return tags.reduce((acc, val) => {
    var _a;
    const tag = val == null ? void 0 : val.tag;
    if (tag) {
      acc.push({
        label: (_a = tag == null ? void 0 : tag.name) == null ? void 0 : _a.current,
        value: tag == null ? void 0 : tag._id
      });
    }
    return acc;
  }, []);
};
const ASSETS_ACTIONS = {
  tagsAddComplete: createAction("actions/tagsAddComplete", function prepare(_ref2) {
    let {
      assets,
      tag
    } = _ref2;
    return {
      payload: {
        assets,
        tag
      }
    };
  }),
  tagsAddError: createAction("actions/tagsAddError", function prepare2(_ref3) {
    let {
      assets,
      error,
      tag
    } = _ref3;
    return {
      payload: {
        assets,
        error,
        tag
      }
    };
  }),
  tagsAddRequest: createAction("actions/tagsAddRequest", function prepare3(_ref4) {
    let {
      assets,
      tag
    } = _ref4;
    return {
      payload: {
        assets,
        tag
      }
    };
  }),
  tagsRemoveComplete: createAction("actions/tagsRemoveComplete", function prepare4(_ref5) {
    let {
      assets,
      tag
    } = _ref5;
    return {
      payload: {
        assets,
        tag
      }
    };
  }),
  tagsRemoveError: createAction("actions/tagsRemoveError", function prepare5(_ref6) {
    let {
      assets,
      error,
      tag
    } = _ref6;
    return {
      payload: {
        assets,
        error,
        tag
      }
    };
  }),
  tagsRemoveRequest: createAction("actions/tagsRemoveRequest", function prepare6(_ref7) {
    let {
      assets,
      tag
    } = _ref7;
    return {
      payload: {
        assets,
        tag
      }
    };
  }),
  seasonsRemoveRequest: createAction("actions/seasonsRemoveRequest", function prepare7(_ref8) {
    let {
      assets,
      season
    } = _ref8;
    return {
      payload: {
        assets,
        season
      }
    };
  }),
  seasonsAddRequest: createAction("actions/seasonsAddRequest", function prepare8(_ref9) {
    let {
      assets,
      season
    } = _ref9;
    return {
      payload: {
        assets,
        season
      }
    };
  }),
  collaborationsRemoveRequest: createAction("actions/collaborationsRemoveRequest", function prepare9(_ref10) {
    let {
      assets,
      collaboration
    } = _ref10;
    return {
      payload: {
        assets,
        collaboration
      }
    };
  }),
  collaborationsAddRequest: createAction("actions/collaborationsAddRequest", function prepare10(_ref11) {
    let {
      assets,
      collaboration
    } = _ref11;
    return {
      payload: {
        assets,
        collaboration
      }
    };
  })
};
const DIALOG_ACTIONS = {
  showTagCreate: createAction("dialog/showTagCreate"),
  showSeasonCreate: createAction("dialog/showSeasonCreate"),
  showCollaborationCreate: createAction("dialog/showCollaborationCreate"),
  showMassEdit: createAction("dialog/showMassEdit"),
  showTagEdit: createAction("dialog/showTagEdit", function prepare(_ref12) {
    let {
      tagId
    } = _ref12;
    return {
      payload: {
        tagId
      }
    };
  }),
  showCollaborationEdit: createAction("dialog/showCollaborationEdit", function prepare2(_ref13) {
    let {
      collaborationId
    } = _ref13;
    return {
      payload: {
        collaborationId
      }
    };
  }),
  showSeasonEdit: createAction("dialog/showSeasonEdit", function prepare3(_ref14) {
    let {
      seasonId
    } = _ref14;
    return {
      payload: {
        seasonId
      }
    };
  })
};
var __freeze$n = Object.freeze;
var __defProp$o = Object.defineProperty;
var __template$n = (cooked, raw) => __freeze$n(__defProp$o(cooked, "raw", {
  value: __freeze$n(raw || cooked.slice())
}));
var _a$n, _b$d;
const initialState$9 = {
  allIds: [],
  byIds: {},
  creating: false,
  creatingError: void 0,
  fetchCount: -1,
  fetching: false,
  fetchingError: void 0,
  panelVisible: true
};
const tagsSlice = createSlice({
  name: "tags",
  initialState: initialState$9,
  extraReducers: builder => {
    builder.addCase(DIALOG_ACTIONS.showTagCreate, state => {
      delete state.creatingError;
    }).addCase(DIALOG_ACTIONS.showTagEdit, (state, action) => {
      const {
        tagId
      } = action.payload;
      delete state.byIds[tagId].error;
    }).addMatcher(action => [ASSETS_ACTIONS.tagsAddComplete.type, ASSETS_ACTIONS.tagsAddError.type, ASSETS_ACTIONS.tagsRemoveComplete.type, ASSETS_ACTIONS.tagsRemoveError.type].includes(action.type), (state, action) => {
      const {
        tag
      } = action.payload;
      state.byIds[tag._id].updating = false;
    }).addMatcher(action => [ASSETS_ACTIONS.tagsAddRequest.type,
    //
    ASSETS_ACTIONS.tagsRemoveRequest.type].includes(action.type), (state, action) => {
      const {
        tag
      } = action.payload;
      state.byIds[tag._id].updating = true;
    });
  },
  reducers: {
    createComplete(state, action) {
      const {
        tag
      } = action.payload;
      state.creating = false;
      if (!state.allIds.includes(tag._id)) {
        state.allIds.push(tag._id);
      }
      state.byIds[tag._id] = {
        _type: "tag",
        picked: false,
        tag,
        updating: false
      };
    },
    createError(state, action) {
      state.creating = false;
      state.creatingError = action.payload.error;
    },
    createRequest(state, _action) {
      state.creating = true;
      delete state.creatingError;
    },
    deleteComplete(state, action) {
      const {
        tagId
      } = action.payload;
      const deleteIndex = state.allIds.indexOf(tagId);
      if (deleteIndex >= 0) {
        state.allIds.splice(deleteIndex, 1);
      }
      delete state.byIds[tagId];
    },
    deleteError(state, action) {
      const {
        error,
        tag
      } = action.payload;
      const tagId = tag == null ? void 0 : tag._id;
      state.byIds[tagId].error = error;
      state.byIds[tagId].updating = false;
    },
    deleteRequest(state, action) {
      var _a2, _b2;
      const tagId = (_b2 = (_a2 = action.payload) == null ? void 0 : _a2.tag) == null ? void 0 : _b2._id;
      state.byIds[tagId].picked = false;
      state.byIds[tagId].updating = true;
      Object.keys(state.byIds).forEach(key => {
        delete state.byIds[key].error;
      });
    },
    fetchComplete(state, action) {
      const {
        tags
      } = action.payload;
      tags == null ? void 0 : tags.forEach(tag => {
        state.allIds.push(tag._id);
        state.byIds[tag._id] = {
          _type: "tag",
          picked: false,
          tag,
          updating: false
        };
      });
      state.fetching = false;
      state.fetchCount = tags.length || 0;
      delete state.fetchingError;
    },
    fetchError(state, action) {
      const {
        error
      } = action.payload;
      state.fetching = false;
      state.fetchingError = error;
    },
    fetchRequest: {
      reducer: (state, _action) => {
        state.fetching = true;
        delete state.fetchingError;
      },
      prepare: () => {
        const query = groq(_a$n || (_a$n = __template$n(['\n          {\n            "items": *[\n              _type == "', '"\n              && !(_id in path("drafts.**"))\n            ] {\n              _createdAt,\n              _updatedAt,\n              _id,\n              _rev,\n              _type,\n              name\n            } | order(name.current asc),\n          }\n        '])), TAG_DOCUMENT_NAME);
        return {
          payload: {
            query
          }
        };
      }
    },
    // Queue batch tag creation
    listenerCreateQueue(_state, _action) {},
    // Apply created tags (via sanity real-time events)
    listenerCreateQueueComplete(state, action) {
      const {
        tags
      } = action.payload;
      tags == null ? void 0 : tags.forEach(tag => {
        state.byIds[tag._id] = {
          _type: "tag",
          picked: false,
          tag,
          updating: false
        };
        if (!state.allIds.includes(tag._id)) {
          state.allIds.push(tag._id);
        }
      });
    },
    // Queue batch tag deletion
    listenerDeleteQueue(_state, _action) {},
    // Apply deleted tags (via sanity real-time events)
    listenerDeleteQueueComplete(state, action) {
      const {
        tagIds
      } = action.payload;
      tagIds == null ? void 0 : tagIds.forEach(tagId => {
        const deleteIndex = state.allIds.indexOf(tagId);
        if (deleteIndex >= 0) {
          state.allIds.splice(deleteIndex, 1);
        }
        delete state.byIds[tagId];
      });
    },
    // Queue batch tag updates
    listenerUpdateQueue(_state, _action) {},
    // Apply updated tags (via sanity real-time events)
    listenerUpdateQueueComplete(state, action) {
      const {
        tags
      } = action.payload;
      tags == null ? void 0 : tags.forEach(tag => {
        if (state.byIds[tag._id]) {
          state.byIds[tag._id].tag = tag;
        }
      });
    },
    // Set tag panel visibility
    panelVisibleSet(state, action) {
      const {
        panelVisible
      } = action.payload;
      state.panelVisible = panelVisible;
    },
    // Sort all tags by name
    sort(state) {
      state.allIds.sort((a, b) => {
        const tagA = state.byIds[a].tag.name.current;
        const tagB = state.byIds[b].tag.name.current;
        if (tagA < tagB) {
          return -1;
        } else if (tagA > tagB) {
          return 1;
        }
        return 0;
      });
    },
    updateComplete(state, action) {
      const {
        tag
      } = action.payload;
      state.byIds[tag._id].tag = tag;
      state.byIds[tag._id].updating = false;
    },
    updateError(state, action) {
      const {
        error,
        tag
      } = action.payload;
      const tagId = tag == null ? void 0 : tag._id;
      state.byIds[tagId].error = error;
      state.byIds[tagId].updating = false;
    },
    updateRequest(state, action) {
      const {
        tag
      } = action.payload;
      state.byIds[tag == null ? void 0 : tag._id].updating = true;
    }
  }
});
const tagsCreateEpic = (action$, state$, _ref15) => {
  let {
    client
  } = _ref15;
  return action$.pipe(filter(tagsSlice.actions.createRequest.match), withLatestFrom(state$), mergeMap(_ref16 => {
    let [action, state] = _ref16;
    const {
      assetId,
      name
    } = action.payload;
    return of(action).pipe(debugThrottle(state.debug.badConnection), checkTagName(client, name), mergeMap(() => client.observable.create({
      _type: TAG_DOCUMENT_NAME,
      name: {
        _type: "slug",
        current: name
      }
    })), mergeMap(result => of(tagsSlice.actions.createComplete({
      assetId,
      tag: result
    }))), catchError(error => of(tagsSlice.actions.createError({
      error: {
        message: (error == null ? void 0 : error.message) || "Internal error",
        statusCode: (error == null ? void 0 : error.statusCode) || 500
      },
      name
    }))));
  }));
};
const tagsDeleteEpic = (action$, state$, _ref17) => {
  let {
    client
  } = _ref17;
  return action$.pipe(filter(tagsSlice.actions.deleteRequest.match), withLatestFrom(state$), mergeMap(_ref18 => {
    let [action, state] = _ref18;
    const {
      tag
    } = action.payload;
    return of(action).pipe(
    // Optionally throttle
    debugThrottle(state.debug.badConnection),
    // Fetch assets which reference this tag
    mergeMap(() => client.observable.fetch(groq(_b$d || (_b$d = __template$n(['*[\n              _type in ["sanity.fileAsset", "sanity.imageAsset"]\n              && references(*[_type == "media.tag" && name.current == $tagName]._id)\n            ] {\n              _id,\n              _rev,\n              opt\n            }']))), {
      tagName: tag.name.current
    })),
    // Create transaction which remove tag references from all matched assets and delete tag
    mergeMap(assets => {
      const patches = assets.map(asset => ({
        id: asset._id,
        patch: {
          // this will cause the transaction to fail if the document has been modified since it was fetched.
          ifRevisionID: asset._rev,
          unset: ['opt.media.tags[_ref == "'.concat(tag._id, '"]')]
        }
      }));
      const transaction = patches.reduce((tx, patch) => tx.patch(patch.id, patch.patch), client.transaction());
      transaction.delete(tag._id);
      return from(transaction.commit());
    }),
    // Dispatch complete action
    mergeMap(() => of(tagsSlice.actions.deleteComplete({
      tagId: tag._id
    }))), catchError(error => of(tagsSlice.actions.deleteError({
      error: {
        message: (error == null ? void 0 : error.message) || "Internal error",
        statusCode: (error == null ? void 0 : error.statusCode) || 500
      },
      tag
    }))));
  }));
};
const tagsFetchEpic = (action$, state$, _ref19) => {
  let {
    client
  } = _ref19;
  return action$.pipe(filter(tagsSlice.actions.fetchRequest.match), withLatestFrom(state$), switchMap(_ref20 => {
    let [action, state] = _ref20;
    const {
      query
    } = action.payload;
    return of(action).pipe(
    // Optionally throttle
    debugThrottle(state.debug.badConnection),
    // Fetch tags
    mergeMap(() => client.observable.fetch(query)),
    // Dispatch complete action
    mergeMap(result => {
      const {
        items
      } = result;
      return of(tagsSlice.actions.fetchComplete({
        tags: items
      }));
    }), catchError(error => of(tagsSlice.actions.fetchError({
      error: {
        message: (error == null ? void 0 : error.message) || "Internal error",
        statusCode: (error == null ? void 0 : error.statusCode) || 500
      }
    }))));
  }));
};
const tagsListenerCreateQueueEpic = action$ => action$.pipe(filter(tagsSlice.actions.listenerCreateQueue.match), bufferTime(2e3), filter(actions => actions.length > 0), mergeMap(actions => {
  const tags = actions == null ? void 0 : actions.map(action => action.payload.tag);
  return of(tagsSlice.actions.listenerCreateQueueComplete({
    tags
  }));
}));
const tagsListenerDeleteQueueEpic = action$ => action$.pipe(filter(tagsSlice.actions.listenerDeleteQueue.match), bufferTime(2e3), filter(actions => actions.length > 0), mergeMap(actions => {
  const tagIds = actions == null ? void 0 : actions.map(action => action.payload.tagId);
  return of(tagsSlice.actions.listenerDeleteQueueComplete({
    tagIds
  }));
}));
const tagsListenerUpdateQueueEpic = action$ => action$.pipe(filter(tagsSlice.actions.listenerUpdateQueue.match), bufferTime(2e3), filter(actions => actions.length > 0), mergeMap(actions => {
  const tags = actions == null ? void 0 : actions.map(action => action.payload.tag);
  return of(tagsSlice.actions.listenerUpdateQueueComplete({
    tags
  }));
}));
const tagsSortEpic = action$ => action$.pipe(ofType(tagsSlice.actions.listenerCreateQueueComplete.type, tagsSlice.actions.listenerUpdateQueueComplete.type), bufferTime(1e3), filter(actions => actions.length > 0), mergeMap(() => of(tagsSlice.actions.sort())));
const tagsUpdateEpic = (action$, state$, _ref21) => {
  let {
    client
  } = _ref21;
  return action$.pipe(filter(tagsSlice.actions.updateRequest.match), withLatestFrom(state$), mergeMap(_ref22 => {
    let [action, state] = _ref22;
    var _a2;
    const {
      closeDialogId,
      formData,
      tag
    } = action.payload;
    return of(action).pipe(
    // Optionally throttle
    debugThrottle(state.debug.badConnection),
    // Check if tag name is available, throw early if not
    checkTagName(client, (_a2 = formData == null ? void 0 : formData.name) == null ? void 0 : _a2.current),
    // Patch document (Update tag)
    mergeMap(() => from(client.patch(tag._id).set({
      name: {
        _type: "slug",
        current: formData == null ? void 0 : formData.name.current
      }
    }).commit())),
    // Dispatch complete action
    mergeMap(updatedTag => {
      return of(tagsSlice.actions.updateComplete({
        closeDialogId,
        tag: updatedTag
      }));
    }), catchError(error => of(tagsSlice.actions.updateError({
      error: {
        message: (error == null ? void 0 : error.message) || "Internal error",
        statusCode: (error == null ? void 0 : error.statusCode) || 500
      },
      tag
    }))));
  }));
};
const selectTagsByIds = state => state.tags.byIds;
const selectTagsAllIds = state => state.tags.allIds;
const selectTags = createSelector([selectTagsByIds, selectTagsAllIds], (byIds, allIds) => allIds.map(id => byIds[id]));
const selectTagById = createSelector([selectTagsByIds, (_state, tagId) => tagId], (byIds, tagId) => byIds[tagId]);
const selectTagSelectOptions = asset => state => {
  var _a2, _b2, _c;
  const tags = (_c = (_b2 = (_a2 = asset == null ? void 0 : asset.opt) == null ? void 0 : _a2.media) == null ? void 0 : _b2.tags) == null ? void 0 : _c.reduce((acc, v) => {
    const tagItem = state.tags.byIds[v._ref];
    if (tagItem == null ? void 0 : tagItem.tag) {
      acc.push(tagItem);
    }
    return acc;
  }, []);
  if (tags && (tags == null ? void 0 : tags.length) > 0) {
    return getTagSelectOptions(tags);
  }
  return null;
};
const tagsActions = tagsSlice.actions;
var tagsReducer = tagsSlice.reducer;
const initialState$8 = {
  facets: [],
  query: ""
};
const searchSlice = createSlice({
  name: "search",
  initialState: initialState$8,
  reducers: {
    // Add search facet
    facetsAdd(state, action) {
      state.facets.push({
        ...action.payload.facet,
        id: uuid()
      });
    },
    // Clear all search facets
    facetsClear(state) {
      state.facets = [];
    },
    // Remove search facet by name
    facetsRemoveByName(state, action) {
      state.facets = state.facets.filter(facet => facet.name !== action.payload.facetName);
    },
    // Remove search facet by name
    facetsRemoveByTag(state, action) {
      state.facets = state.facets.filter(facet => {
        var _a;
        return !(facet.name === "tag" && facet.type === "searchable" && (facet.operatorType === "references" || facet.operatorType === "doesNotReference") && ((_a = facet.value) == null ? void 0 : _a.value) === action.payload.tagId);
      });
    },
    facetsRemoveBySeason(state, action) {
      state.facets = state.facets.filter(facet => {
        var _a;
        return !(facet.name === "season" && facet.type === "searchable" && (facet.operatorType === "references" || facet.operatorType === "doesNotReference") && ((_a = facet.value) == null ? void 0 : _a.value) === action.payload.seasonId);
      });
    },
    // Remove search facet by name
    facetsRemoveById(state, action) {
      state.facets = state.facets.filter(facet => facet.id !== action.payload.facetId);
    },
    // Update an existing search facet
    facetsUpdate(state, action) {
      const {
        modifier,
        name,
        operatorType,
        value
      } = action.payload;
      const facet = state.facets.find(f => f.name === name);
      if (!facet) {
        return;
      }
      if (facet.type === "number" && modifier) {
        facet.modifier = modifier;
      }
      if (operatorType) {
        facet.operatorType = operatorType;
      }
      if (typeof value !== "undefined") {
        facet.value = value;
      }
      state.facets = state.facets.filter(f => f.name !== facet.name || f.id === facet.id);
    },
    // Update an existing search facet
    facetsUpdateById(state, action) {
      const {
        modifier,
        id,
        operatorType,
        value
      } = action.payload;
      state.facets.forEach((facet, index) => {
        if (facet.id === id) {
          if (facet.type === "number" && modifier) {
            facet.modifier = modifier;
          }
          if (operatorType) {
            facet.operatorType = operatorType;
          }
          if (typeof value !== "undefined") {
            state.facets[index].value = value;
          }
        }
      });
    },
    // Update existing search query
    querySet(state, action) {
      var _a;
      state.query = (_a = action.payload) == null ? void 0 : _a.searchQuery;
    }
  }
});
const searchFacetTagUpdateEpic = (action$, state$) => action$.pipe(filter(tagsActions.updateComplete.match), withLatestFrom(state$), mergeMap(_ref23 => {
  let [action, state] = _ref23;
  var _a, _b, _c, _d, _e;
  const {
    tag
  } = action.payload;
  const currentSearchFacetTag = (_a = state.search.facets) == null ? void 0 : _a.find(facet => facet.name === "tag");
  const tagItem = state.tags.byIds[tag._id];
  if ((currentSearchFacetTag == null ? void 0 : currentSearchFacetTag.type) === "searchable") {
    if (((_b = currentSearchFacetTag.value) == null ? void 0 : _b.value) === tag._id) {
      return of(searchSlice.actions.facetsUpdate({
        name: "tag",
        value: {
          label: (_d = (_c = tagItem == null ? void 0 : tagItem.tag) == null ? void 0 : _c.name) == null ? void 0 : _d.current,
          value: (_e = tagItem == null ? void 0 : tagItem.tag) == null ? void 0 : _e._id
        }
      }));
    }
  }
  return empty();
}));
const selectIsSearchFacetTag = createSelector([state => state.search.facets, (_state, tagId) => tagId], (searchFacets, tagId) => searchFacets.some(facet => {
  var _a;
  return facet.name === "tag" && facet.type === "searchable" && (facet.operatorType === "references" || facet.operatorType === "doesNotReference") && ((_a = facet.value) == null ? void 0 : _a.value) === tagId;
}));
const searchActions = searchSlice.actions;
var searchReducer = searchSlice.reducer;
const UPLOADS_ACTIONS = {
  uploadComplete: createAction("uploads/uploadComplete", function prepare(_ref24) {
    let {
      asset
    } = _ref24;
    return {
      payload: {
        asset
      }
    };
  })
};
var __freeze$m = Object.freeze;
var __defProp$n = Object.defineProperty;
var __template$m = (cooked, raw) => __freeze$m(__defProp$n(cooked, "raw", {
  value: __freeze$m(raw || cooked.slice())
}));
var _a$m, _b$c, _c$2, _d$1, _e;
const defaultOrder = ORDER_OPTIONS[0];
const initialState$7 = {
  allIds: [],
  assetTypes: [],
  byIds: {},
  fetchCount: -1,
  fetching: false,
  fetchingError: void 0,
  lastPicked: void 0,
  order: {
    direction: defaultOrder.direction,
    field: defaultOrder.field,
    title: getOrderTitle(defaultOrder.field, defaultOrder.direction)
  },
  pageIndex: 0,
  pageSize: 100,
  // totalCount: -1,
  view: "grid"
};
const assetsSlice = createSlice({
  name: "assets",
  initialState: initialState$7,
  extraReducers: builder => {
    builder.addCase(UPLOADS_ACTIONS.uploadComplete, (state, action) => {
      const {
        asset
      } = action.payload;
      state.byIds[asset._id] = {
        _type: "asset",
        asset,
        picked: false,
        updating: false
      };
    }).addCase(ASSETS_ACTIONS.tagsAddComplete, (state, action) => {
      const {
        assets
      } = action.payload;
      assets.forEach(asset => {
        state.byIds[asset.asset._id].updating = false;
      });
    }).addCase(ASSETS_ACTIONS.tagsAddError, (state, action) => {
      const {
        assets
      } = action.payload;
      assets.forEach(asset => {
        state.byIds[asset.asset._id].updating = false;
      });
    }).addCase(ASSETS_ACTIONS.tagsAddRequest, (state, action) => {
      const {
        assets
      } = action.payload;
      assets.forEach(asset => {
        state.byIds[asset.asset._id].updating = true;
      });
    }).addCase(ASSETS_ACTIONS.tagsRemoveComplete, (state, action) => {
      const {
        assets
      } = action.payload;
      assets.forEach(asset => {
        state.byIds[asset.asset._id].updating = false;
      });
    }).addCase(ASSETS_ACTIONS.tagsRemoveError, (state, action) => {
      const {
        assets
      } = action.payload;
      assets.forEach(asset => {
        state.byIds[asset.asset._id].updating = false;
      });
    }).addCase(ASSETS_ACTIONS.tagsRemoveRequest, (state, action) => {
      const {
        assets
      } = action.payload;
      assets.forEach(asset => {
        state.byIds[asset.asset._id].updating = true;
      });
    });
  },
  reducers: {
    // Clear asset order
    clear(state) {
      state.allIds = [];
    },
    // Remove assets and update page index
    deleteComplete(state, action) {
      const {
        assetIds
      } = action.payload;
      assetIds == null ? void 0 : assetIds.forEach(id => {
        const deleteIndex = state.allIds.indexOf(id);
        if (deleteIndex >= 0) {
          state.allIds.splice(deleteIndex, 1);
        }
        delete state.byIds[id];
      });
      state.pageIndex = Math.floor(state.allIds.length / state.pageSize) - 1;
    },
    deleteError(state, action) {
      var _a2, _b2, _c2, _d2;
      const {
        assetIds,
        error
      } = action.payload;
      const itemErrors = (_d2 = (_c2 = (_b2 = (_a2 = error == null ? void 0 : error.response) == null ? void 0 : _a2.body) == null ? void 0 : _b2.error) == null ? void 0 : _c2.items) == null ? void 0 : _d2.map(item => item.error);
      assetIds == null ? void 0 : assetIds.forEach(id => {
        state.byIds[id].updating = false;
      });
      itemErrors == null ? void 0 : itemErrors.forEach(item => {
        state.byIds[item.id].error = item.description;
      });
    },
    deleteRequest(state, action) {
      const {
        assets
      } = action.payload;
      assets.forEach(asset => {
        state.byIds[asset == null ? void 0 : asset._id].updating = true;
      });
      Object.keys(state.byIds).forEach(key => {
        delete state.byIds[key].error;
      });
    },
    fetchComplete(state, action) {
      var _a2;
      const assets = ((_a2 = action.payload) == null ? void 0 : _a2.assets) || [];
      if (assets) {
        assets.forEach(asset => {
          if (!state.allIds.includes(asset._id)) {
            state.allIds.push(asset._id);
          }
          state.byIds[asset._id] = {
            _type: "asset",
            asset,
            picked: false,
            updating: false
          };
        });
      }
      state.fetching = false;
      state.fetchCount = assets.length || 0;
      delete state.fetchingError;
    },
    fetchError(state, action) {
      const error = action.payload;
      state.fetching = false;
      state.fetchingError = error;
    },
    fetchRequest: {
      reducer: (state, _action) => {
        state.fetching = true;
        delete state.fetchingError;
      },
      prepare: _ref25 => {
        let {
          params = {},
          queryFilter,
          selector = "",
          sort = groq(_a$m || (_a$m = __template$m(["order(_updatedAt desc)"])))
        } = _ref25;
        const pipe = sort || selector ? "|" : "";
        const query = groq(_b$c || (_b$c = __template$m(['\n          {\n            "items": *[', "] {\n              _id,\n              _type,\n              _createdAt,\n              _updatedAt,\n              altText,\n              description,\n              extension,\n              metadata {\n                dimensions,\n                exif,\n                isOpaque,\n              },\n              mimeType,\n              opt {\n                media\n              },\n              originalFilename,\n              size,\n              title,\n              products,\n              primaryProducts,\n              secondaryProducts,  \n              collaboration, \n              season,\n              name,\n              url\n            } ", " ", " ", ",\n          }\n        "])), queryFilter, pipe, sort, selector);
        return {
          payload: {
            params,
            query
          }
        };
      }
    },
    insertUploads(state, action) {
      const {
        results
      } = action.payload;
      Object.entries(results).forEach(_ref26 => {
        let [hash, assetId] = _ref26;
        if (assetId && !state.allIds.includes(hash)) {
          state.allIds.push(assetId);
        }
      });
    },
    listenerCreateQueue(_state, _action) {},
    listenerCreateQueueComplete(state, action) {
      const {
        assets
      } = action.payload;
      assets == null ? void 0 : assets.forEach(asset => {
        var _a2;
        if ((_a2 = state.byIds[asset == null ? void 0 : asset._id]) == null ? void 0 : _a2.asset) {
          state.byIds[asset._id].asset = asset;
        }
      });
    },
    listenerDeleteQueue(_state, _action) {},
    listenerDeleteQueueComplete(state, action) {
      const {
        assetIds
      } = action.payload;
      assetIds == null ? void 0 : assetIds.forEach(assetId => {
        const deleteIndex = state.allIds.indexOf(assetId);
        if (deleteIndex >= 0) {
          state.allIds.splice(deleteIndex, 1);
        }
        delete state.byIds[assetId];
      });
    },
    listenerUpdateQueue(_state, _action) {},
    listenerUpdateQueueComplete(state, action) {
      const {
        assets
      } = action.payload;
      assets == null ? void 0 : assets.forEach(asset => {
        var _a2;
        if ((_a2 = state.byIds[asset == null ? void 0 : asset._id]) == null ? void 0 : _a2.asset) {
          state.byIds[asset._id].asset = asset;
        }
      });
    },
    loadNextPage() {},
    loadPageIndex(state, action) {
      state.pageIndex = action.payload.pageIndex;
    },
    orderSet(state, action) {
      var _a2;
      state.order = (_a2 = action.payload) == null ? void 0 : _a2.order;
      state.pageIndex = 0;
    },
    pick(state, action) {
      const {
        assetId,
        picked
      } = action.payload;
      state.byIds[assetId].picked = picked;
      state.lastPicked = picked ? assetId : void 0;
    },
    pickAll(state) {
      state.allIds.forEach(id => {
        state.byIds[id].picked = true;
      });
    },
    pickClear(state) {
      state.lastPicked = void 0;
      Object.values(state.byIds).forEach(asset => {
        state.byIds[asset.asset._id].picked = false;
      });
    },
    pickRange(state, action) {
      const startIndex = state.allIds.findIndex(id => id === action.payload.startId);
      const endIndex = state.allIds.findIndex(id => id === action.payload.endId);
      const indices = [startIndex, endIndex].sort((a, b) => a - b);
      state.allIds.slice(indices[0], indices[1] + 1).forEach(key => {
        state.byIds[key].picked = true;
      });
      state.lastPicked = state.allIds[endIndex];
    },
    sort(state) {
      state.allIds.sort((a, b) => {
        const tagA = state.byIds[a].asset[state.order.field];
        const tagB = state.byIds[b].asset[state.order.field];
        if (tagA < tagB) {
          return state.order.direction === "asc" ? -1 : 1;
        } else if (tagA > tagB) {
          return state.order.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    },
    updateComplete(state, action) {
      const {
        asset
      } = action.payload;
      state.byIds[asset._id].updating = false;
      state.byIds[asset._id].asset = asset;
    },
    updateError(state, action) {
      const {
        asset,
        error
      } = action.payload;
      const assetId = asset == null ? void 0 : asset._id;
      state.byIds[assetId].error = error.message;
      state.byIds[assetId].updating = false;
    },
    updateRequest(state, action) {
      var _a2, _b2;
      const assetId = (_b2 = (_a2 = action.payload) == null ? void 0 : _a2.asset) == null ? void 0 : _b2._id;
      state.byIds[assetId].updating = true;
    },
    massUpdateRequest(state, action) {
      var _a2, _b2;
      const assetIds = (_b2 = (_a2 = action.payload) == null ? void 0 : _a2.assets) == null ? void 0 : _b2.map(asset => asset._id);
      for (const assetId of assetIds) {
        state.byIds[assetId].updating = true;
      }
    },
    viewSet(state, action) {
      var _a2;
      state.view = (_a2 = action.payload) == null ? void 0 : _a2.view;
    }
  }
});
const assetsDeleteEpic = (action$, _state$, _ref27) => {
  let {
    client
  } = _ref27;
  return action$.pipe(filter(assetsActions.deleteRequest.match), mergeMap(action => {
    const {
      assets
    } = action.payload;
    const assetIds = assets.map(asset => asset._id);
    return of(assets).pipe(mergeMap(() => client.observable.delete({
      query: groq(_c$2 || (_c$2 = __template$m(["*[_id in ", "]"])), JSON.stringify(assetIds))
    })), mergeMap(() => of(assetsActions.deleteComplete({
      assetIds
    }))), catchError(error => {
      return of(assetsActions.deleteError({
        assetIds,
        error
      }));
    }));
  }));
};
const assetsFetchEpic = (action$, state$, _ref28) => {
  let {
    client
  } = _ref28;
  return action$.pipe(filter(assetsActions.fetchRequest.match), withLatestFrom(state$), switchMap(_ref29 => {
    let [action, state] = _ref29;
    var _a2, _b2;
    const params = (_a2 = action.payload) == null ? void 0 : _a2.params;
    const query = (_b2 = action.payload) == null ? void 0 : _b2.query;
    return of(action).pipe(debugThrottle(state.debug.badConnection), mergeMap(() => client.observable.fetch(query, params)), mergeMap(result => {
      const {
        items
        // totalCount
      } = result;
      return of(assetsActions.fetchComplete({
        assets: items
      }));
    }), catchError(error => of(assetsActions.fetchError({
      message: (error == null ? void 0 : error.message) || "Internal error",
      statusCode: (error == null ? void 0 : error.statusCode) || 500
    }))));
  }));
};
const assetsFetchPageIndexEpic = (action$, state$) => action$.pipe(filter(assetsActions.loadPageIndex.match), withLatestFrom(state$), switchMap(_ref30 => {
  let [action, state] = _ref30;
  var _a2, _b2, _c2, _d2, _e2, _f;
  const pageSize = state.assets.pageSize;
  const start = action.payload.pageIndex * pageSize;
  const end = start + pageSize;
  const documentId = (_a2 = state == null ? void 0 : state.selected.document) == null ? void 0 : _a2._id;
  const documentAssetIds = (_b2 = state == null ? void 0 : state.selected) == null ? void 0 : _b2.documentAssetIds;
  const constructedFilter = constructFilter({
    assetTypes: state.assets.assetTypes,
    searchFacets: state.search.facets,
    searchQuery: state.search.query
  });
  const params = {
    ...(documentId ? {
      documentId
    } : {}),
    documentAssetIds
  };
  return of(assetsActions.fetchRequest({
    params,
    queryFilter: constructedFilter,
    selector: groq(_d$1 || (_d$1 = __template$m(["[", "...", "]"])), start, end),
    sort: groq(_e || (_e = __template$m(["order(", " ", ")"])), (_d2 = (_c2 = state.assets) == null ? void 0 : _c2.order) == null ? void 0 : _d2.field, (_f = (_e2 = state.assets) == null ? void 0 : _e2.order) == null ? void 0 : _f.direction)
  }));
}));
const assetsFetchNextPageEpic = (action$, state$) => action$.pipe(filter(assetsActions.loadNextPage.match), withLatestFrom(state$), switchMap(_ref31 => {
  let [_action, state] = _ref31;
  return of(assetsActions.loadPageIndex({
    pageIndex: state.assets.pageIndex + 1
  }));
}));
const assetsFetchAfterDeleteAllEpic = (action$, state$) => action$.pipe(filter(assetsActions.deleteComplete.match), withLatestFrom(state$), switchMap(_ref32 => {
  let [_action, state] = _ref32;
  if (state.assets.allIds.length === 0) {
    const nextPageIndex = Math.floor(state.assets.allIds.length / state.assets.pageSize);
    return of(assetsActions.loadPageIndex({
      pageIndex: nextPageIndex
    }));
  }
  return empty();
}));
const filterAssetWithoutTag = tag => asset => {
  var _a2, _b2, _c2, _d2, _e2;
  const tagIndex = (_e2 = (_d2 = (_c2 = (_b2 = (_a2 = asset == null ? void 0 : asset.asset) == null ? void 0 : _a2.opt) == null ? void 0 : _b2.media) == null ? void 0 : _c2.tags) == null ? void 0 : _d2.findIndex(t => t._ref === (tag == null ? void 0 : tag._id))) != null ? _e2 : -1;
  return tagIndex < 0;
};
const patchOperationTagAppend = _ref33 => {
  let {
    tag
  } = _ref33;
  return patch => patch.setIfMissing({
    opt: {}
  }).setIfMissing({
    "opt.media": {}
  }).setIfMissing({
    "opt.media.tags": []
  }).append("opt.media.tags", [{
    _key: nanoid(),
    _ref: tag == null ? void 0 : tag._id,
    _type: "reference",
    _weak: true
  }]);
};
const patchOperationTagUnset = _ref34 => {
  let {
    asset,
    tag
  } = _ref34;
  return patch => {
    var _a2;
    return patch.ifRevisionId((_a2 = asset == null ? void 0 : asset.asset) == null ? void 0 : _a2._rev).unset(['opt.media.tags[_ref == "'.concat(tag._id, '"]')]);
  };
};
const assetsOrderSetEpic = action$ => action$.pipe(filter(assetsActions.orderSet.match), mergeMap(() => {
  return of(assetsActions.clear(),
  //
  assetsActions.loadPageIndex({
    pageIndex: 0
  }));
}));
const assetsSearchEpic = action$ => action$.pipe(ofType(searchActions.facetsAdd.type, searchActions.facetsClear.type, searchActions.facetsRemoveById.type, searchActions.facetsRemoveByName.type, searchActions.facetsRemoveByTag.type, searchActions.facetsUpdate.type, searchActions.facetsUpdateById.type, searchActions.querySet.type), debounceTime(400), mergeMap(() => {
  return of(assetsActions.clear(),
  //
  assetsActions.loadPageIndex({
    pageIndex: 0
  }));
}));
const assetsListenerCreateQueueEpic = action$ => action$.pipe(filter(assetsActions.listenerCreateQueue.match), bufferTime(2e3), filter(actions => actions.length > 0), mergeMap(actions => {
  const assets = actions == null ? void 0 : actions.map(action => action.payload.asset);
  return of(assetsActions.listenerCreateQueueComplete({
    assets
  }));
}));
const assetsListenerDeleteQueueEpic = action$ => action$.pipe(filter(assetsActions.listenerDeleteQueue.match), bufferTime(2e3), filter(actions => actions.length > 0), mergeMap(actions => {
  const assetIds = actions == null ? void 0 : actions.map(action => action.payload.assetId);
  return of(assetsActions.listenerDeleteQueueComplete({
    assetIds
  }));
}));
const assetsListenerUpdateQueueEpic = action$ => action$.pipe(filter(assetsActions.listenerUpdateQueue.match), bufferTime(2e3), filter(actions => actions.length > 0), mergeMap(actions => {
  const assets = actions == null ? void 0 : actions.map(action => action.payload.asset);
  return of(assetsActions.listenerUpdateQueueComplete({
    assets
  }));
}));
const assetsSortEpic = action$ => action$.pipe(ofType(assetsActions.insertUploads.type, assetsActions.listenerUpdateQueueComplete.type, assetsActions.updateComplete.type), mergeMap(() => of(assetsActions.sort())));
const assetsTagsAddEpic = (action$, state$, _ref35) => {
  let {
    client
  } = _ref35;
  return action$.pipe(filter(ASSETS_ACTIONS.tagsAddRequest.match), withLatestFrom(state$), mergeMap(_ref36 => {
    let [action, state] = _ref36;
    const {
      assets,
      tag
    } = action.payload;
    return of(action).pipe(
    // Optionally throttle
    debugThrottle(state.debug.badConnection),
    // Add tag references to all picked assets
    mergeMap(() => {
      const pickedAssets = selectAssetsPicked(state);
      const pickedAssetsFiltered = pickedAssets == null ? void 0 : pickedAssets.filter(filterAssetWithoutTag(tag));
      const transaction = pickedAssetsFiltered.reduce((tx, pickedAsset) => {
        var _a2;
        return tx.patch((_a2 = pickedAsset == null ? void 0 : pickedAsset.asset) == null ? void 0 : _a2._id, patchOperationTagAppend({
          tag
        }));
      }, client.transaction());
      return from(transaction.commit());
    }),
    // Dispatch complete action
    mergeMap(() => of(ASSETS_ACTIONS.tagsAddComplete({
      assets,
      tag
    }))), catchError(error => of(ASSETS_ACTIONS.tagsAddError({
      assets,
      error: {
        message: (error == null ? void 0 : error.message) || "Internal error",
        statusCode: (error == null ? void 0 : error.statusCode) || 500
      },
      tag
    }))));
  }));
};
const assetsTagsRemoveEpic = (action$, state$, _ref37) => {
  let {
    client
  } = _ref37;
  return action$.pipe(filter(ASSETS_ACTIONS.tagsRemoveRequest.match), withLatestFrom(state$), mergeMap(_ref38 => {
    let [action, state] = _ref38;
    const {
      assets,
      tag
    } = action.payload;
    return of(action).pipe(
    // Optionally throttle
    debugThrottle(state.debug.badConnection),
    // Remove tag references from all picked assets
    mergeMap(() => {
      const pickedAssets = selectAssetsPicked(state);
      const transaction = pickedAssets.reduce((tx, pickedAsset) => {
        var _a2;
        return tx.patch((_a2 = pickedAsset == null ? void 0 : pickedAsset.asset) == null ? void 0 : _a2._id, patchOperationTagUnset({
          asset: pickedAsset,
          tag
        }));
      }, client.transaction());
      return from(transaction.commit());
    }),
    // Dispatch complete action
    mergeMap(() => of(ASSETS_ACTIONS.tagsRemoveComplete({
      assets,
      tag
    }))), catchError(error => of(ASSETS_ACTIONS.tagsRemoveError({
      assets,
      error: {
        message: (error == null ? void 0 : error.message) || "Internal error",
        statusCode: (error == null ? void 0 : error.statusCode) || 500
      },
      tag
    }))));
  }));
};
const assetsUnpickEpic = action$ => action$.pipe(ofType(assetsActions.orderSet.type, assetsActions.viewSet.type, searchActions.facetsAdd.type, searchActions.facetsClear.type, searchActions.facetsRemoveById.type, searchActions.facetsRemoveByName.type, searchActions.facetsRemoveByTag.type, searchActions.facetsUpdate.type, searchActions.facetsUpdateById.type, searchActions.querySet.type), mergeMap(() => {
  return of(assetsActions.pickClear());
}));
const assetsUpdateEpic = (action$, state$, _ref39) => {
  let {
    client
  } = _ref39;
  return action$.pipe(filter(assetsActions.updateRequest.match), withLatestFrom(state$), mergeMap(_ref40 => {
    let [action, state] = _ref40;
    const {
      asset,
      closeDialogId,
      formData
    } = action.payload;
    return of(action).pipe(debugThrottle(state.debug.badConnection), mergeMap(() => from(client.patch(asset._id).setIfMissing({
      opt: {}
    }).setIfMissing({
      "opt.media": {}
    }).set(formData).commit())), mergeMap(updatedAsset => of(assetsActions.updateComplete({
      asset: updatedAsset,
      closeDialogId
    }))), catchError(error => of(assetsActions.updateError({
      asset,
      error: {
        message: (error == null ? void 0 : error.message) || "Internal error",
        statusCode: (error == null ? void 0 : error.statusCode) || 500
      }
    }))));
  }));
};
const assetsMassUpdateEpic = (action$, state$, _ref41) => {
  let {
    client
  } = _ref41;
  return action$.pipe(filter(assetsActions.massUpdateRequest.match), withLatestFrom(state$), mergeMap(_ref42 => {
    let [action] = _ref42;
    const {
      assets,
      formData
    } = action.payload;
    const updateObservables = assets.map(asset => {
      const formDataWithoutEmptyValues = Object.entries(formData).reduce((acc, _ref43) => {
        let [key, value] = _ref43;
        return value ? {
          ...acc,
          [key]: value
        } : acc;
      }, {});
      return from(client.patch(asset._id).setIfMissing({
        opt: {}
      }).setIfMissing({
        "opt.media": {}
      }).set({
        ...formDataWithoutEmptyValues
      }).commit()).pipe(mergeMap(updatedAsset => of(assetsActions.updateComplete({
        asset: updatedAsset
      }))), catchError(error => {
        return of(assetsActions.updateError({
          asset,
          error: {
            message: (error == null ? void 0 : error.message) || "Internal error",
            statusCode: (error == null ? void 0 : error.statusCode) || 500
          }
        }));
      }));
    });
    return merge(...updateObservables);
  }));
};
const selectAssetsByIds = state => state.assets.byIds;
const selectAssetsAllIds = state => state.assets.allIds;
const selectAssetById = createSelector([state => state.assets.byIds, (_state, assetId) => assetId], (byIds, assetId) => {
  const asset = byIds[assetId];
  return asset ? asset : void 0;
});
const selectAssets = createSelector([selectAssetsByIds, selectAssetsAllIds], (byIds, allIds) => allIds.map(id => byIds[id]));
const selectAssetsLength = createSelector([selectAssets], assets => assets.length);
const selectAssetsPicked = createSelector([selectAssets], assets => assets.filter(item => item == null ? void 0 : item.picked));
const selectAssetsPickedLength = createSelector([selectAssetsPicked], assetsPicked => assetsPicked.length);
const assetsActions = assetsSlice.actions;
var assetsReducer = assetsSlice.reducer;
var __freeze$l = Object.freeze;
var __defProp$m = Object.defineProperty;
var __template$l = (cooked, raw) => __freeze$l(__defProp$m(cooked, "raw", {
  value: __freeze$l(raw || cooked.slice())
}));
var _a$l, _b$b;
const customScrollbar = css(_a$l || (_a$l = __template$l(["\n  ::-webkit-scrollbar {\n    width: 14px;\n  }\n\n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    border: 4px solid rgba(0, 0, 0, 0);\n    background: var(--card-border-color);\n    background-clip: padding-box;\n\n    &:hover {\n      background: var(--card-muted-fg-color);\n      background-clip: padding-box;\n    }\n  }\n"])));
const GlobalStyle = createGlobalStyle(_b$b || (_b$b = __template$l(["\n  .media__custom-scrollbar {\n    ", '\n  }\n\n  // @sanity/ui overrides\n\n  // Custom scrollbar on Box (used in Dialogs)\n  div[data-ui="Box"] {\n    ', '\n  }\n\n  // Dialog background color\n  div[data-ui="Dialog"] {\n    background-color: rgba(15, 17, 18, 0.9);\n  }\n\n'])), customScrollbar, customScrollbar);
const useTypedSelector = useSelector;
var __freeze$k = Object.freeze;
var __defProp$l = Object.defineProperty;
var __template$k = (cooked, raw) => __freeze$k(__defProp$l(cooked, "raw", {
  value: __freeze$k(raw || cooked.slice())
}));
var _a$k, _b$a;
const initialState$6 = {
  creating: false,
  fetching: false,
  fetchingError: void 0,
  creatingError: void 0,
  byIds: {},
  panelVisible: false,
  fetchCount: -1,
  allIds: []
};
const seasonsSlice = createSlice({
  name: "seasons",
  initialState: initialState$6,
  reducers: {
    // Create season
    createRequest(state, _action) {
      state.creating = true;
      delete state.creatingError;
    },
    createComplete(state, action) {
      const {
        season
      } = action.payload;
      state.creating = false;
      state.byIds[season._id] = {
        _type: "seasonItem",
        error: void 0,
        picked: false,
        season,
        updating: false
      };
    },
    createError(state, action) {
      state.creating = false;
      state.creatingError = action.payload.error;
    },
    // Queue batch tag creation
    listenerCreateQueue(_state, _action) {},
    // Fetch seasons
    fetchRequest: {
      reducer: (state, _action) => {
        state.fetching = true;
        delete state.fetchingError;
      },
      prepare: () => {
        const query = groq(_a$k || (_a$k = __template$k(['\n          {\n            "items": *[\n              _type == "', '"\n              && !(_id in path("drafts.**"))\n            ] {\n              _createdAt,\n              _updatedAt,\n              _id,\n              _rev,\n              _type,\n              name\n            } | order(name.current asc),\n          }\n        '])), SEASONS_DOCUMENT_NAME);
        return {
          payload: {
            query
          }
        };
      }
    },
    fetchComplete(state, action) {
      state.fetching = false;
      state.fetchingError = void 0;
      const seasons = action.payload.seasons;
      state.byIds = action.payload.seasons.reduce((acc, season) => {
        acc[season._id] = {
          _type: "seasonItem",
          error: void 0,
          picked: false,
          season,
          updating: false
        };
        return acc;
      }, {});
      seasons == null ? void 0 : seasons.forEach(season => {
        state.allIds.push(season._id);
        state.byIds[season._id] = {
          _type: "seasonItem",
          picked: false,
          season,
          updating: false
        };
      });
      state.fetching = false;
      state.fetchCount = seasons.length || 0;
      delete state.fetchingError;
    },
    fetchError(state, action) {
      const {
        error
      } = action.payload;
      state.fetching = false;
      state.fetchingError = error;
    },
    listenerCreateQueueComplete(state, action) {
      const {
        seasons
      } = action.payload;
      seasons == null ? void 0 : seasons.forEach(season => {
        state.byIds[season._id] = {
          _type: "seasonItem",
          picked: false,
          season,
          updating: false
        };
      });
    },
    // Update season
    updateRequest(state, action) {
      const {
        season
      } = action.payload;
      state.byIds[season._id].updating = true;
    },
    updateSeasonItemRequest(state, action) {
      const {
        season
      } = action.payload;
      state.byIds[season == null ? void 0 : season._id].updating = true;
    },
    updateComplete(state, action) {
      const {
        season
      } = action.payload;
      state.byIds[season._id].updating = false;
      state.byIds[season._id].season = season;
    },
    updateError(state, action) {
      const {
        error,
        season
      } = action.payload;
      const seasonId = season == null ? void 0 : season._id;
      state.byIds[seasonId].error = error;
      state.byIds[seasonId].updating = false;
    },
    deleteRequest(state, action) {
      var _a2, _b2;
      const seasonId = (_b2 = (_a2 = action.payload) == null ? void 0 : _a2.season) == null ? void 0 : _b2._id;
      state.byIds[seasonId].picked = false;
      state.byIds[seasonId].updating = true;
      Object.keys(state.byIds).forEach(key => {
        delete state.byIds[key].error;
      });
    },
    deleteComplete(state, action) {
      const {
        seasonId
      } = action.payload;
      const deleteIndex = state.allIds.indexOf(seasonId);
      if (deleteIndex >= 0) {
        state.allIds.splice(deleteIndex, 1);
      }
      delete state.byIds[seasonId];
    },
    deleteError(state, action) {
      const {
        error,
        season
      } = action.payload;
      const seasonId = season == null ? void 0 : season._id;
      state.byIds[seasonId].error = error;
      state.byIds[seasonId].updating = false;
    },
    // Set tag panel visibility
    panelVisibleSet(state, action) {
      const {
        panelVisible
      } = action.payload;
      state.panelVisible = panelVisible;
    }
  }
});
const seasonsFetchEpic = (action$, state$, _ref44) => {
  let {
    client
  } = _ref44;
  return action$.pipe(filter(seasonsSlice.actions.fetchRequest.match), withLatestFrom(state$), switchMap(_ref45 => {
    let [action, state] = _ref45;
    const {
      query
    } = action.payload;
    return of(action).pipe(
    // Optionally throttle
    debugThrottle(state.debug.badConnection),
    // Fetch seasons
    mergeMap(() => client.observable.fetch(query)),
    // Dispatch complete action
    mergeMap(result => {
      const {
        items
      } = result;
      return of(seasonsSlice.actions.fetchComplete({
        seasons: items
      }));
    }), catchError(error => of(seasonsSlice.actions.fetchError({
      error: {
        message: (error == null ? void 0 : error.message) || "Internal error",
        statusCode: (error == null ? void 0 : error.statusCode) || 500
      }
    }))));
  }));
};
const seasonsCreateEpic = (action$, state$, _ref46) => {
  let {
    client
  } = _ref46;
  return action$.pipe(filter(seasonsSlice.actions.createRequest.match), withLatestFrom(state$), mergeMap(_ref47 => {
    let [action, state] = _ref47;
    const {
      name
    } = action.payload;
    return of(action).pipe(debugThrottle(state.debug.badConnection), mergeMap(() => client.observable.create({
      _type: SEASONS_DOCUMENT_NAME,
      name: {
        _type: "slug",
        current: name
      }
    })), mergeMap(result => of(seasonsSlice.actions.createComplete({
      season: result
    }))), catchError(error => of(seasonsSlice.actions.createError({
      error: {
        message: (error == null ? void 0 : error.message) || "Internal error",
        statusCode: (error == null ? void 0 : error.statusCode) || 500
      },
      name
    }))));
  }));
};
const seasonsUpdateEpic = (action$, state$, _ref48) => {
  let {
    client
  } = _ref48;
  return action$.pipe(filter(seasonsSlice.actions.updateSeasonItemRequest.match), withLatestFrom(state$), mergeMap(_ref49 => {
    let [action, state] = _ref49;
    var _a2;
    const {
      closeDialogId,
      formData,
      season
    } = action.payload;
    return of(action).pipe(
    // Optionally throttle
    debugThrottle(state.debug.badConnection),
    // Check if tag name is available, throw early if not
    checkSeasonName(client, (_a2 = formData == null ? void 0 : formData.name) == null ? void 0 : _a2.current),
    // Patch document (Update tag)
    mergeMap(() => from(client.patch(season._id).set({
      name: {
        _type: "slug",
        current: formData == null ? void 0 : formData.name.current
      }
    }).commit())),
    // Dispatch complete action
    mergeMap(updatedSeason => {
      return of(seasonsSlice.actions.updateComplete({
        closeDialogId,
        season: updatedSeason
      }));
    }), catchError(error => of(seasonsSlice.actions.updateError({
      error: {
        message: (error == null ? void 0 : error.message) || "Internal error",
        statusCode: (error == null ? void 0 : error.statusCode) || 500
      },
      season
    }))));
  }));
};
const seasonsDeleteEpic = (action$, state$, _ref50) => {
  let {
    client
  } = _ref50;
  return action$.pipe(filter(seasonActions.deleteRequest.match), withLatestFrom(state$), mergeMap(_ref51 => {
    let [action, state] = _ref51;
    const {
      season
    } = action.payload;
    return of(action).pipe(
    // Optionally throttle
    debugThrottle(state.debug.badConnection),
    // Fetch assets which reference this tag
    mergeMap(() => client.observable.fetch(groq(_b$a || (_b$a = __template$k(['*[\n              _type in ["sanity.fileAsset", "sanity.imageAsset"]\n              && references(*[_type == "season" && name.current == $seasonName]._id)\n            ] {\n              _id,\n              _rev,\n              opt\n            }']))), {
      seasonName: season.name.current
    })),
    // Create transaction which remove tag references from all matched assets and delete tag
    mergeMap(assets => {
      const patches = assets.map(asset => ({
        id: asset._id,
        patch: {
          // this will cause the transaction to fail if the document has been modified since it was fetched.
          ifRevisionID: asset._rev,
          unset: ['season[_ref == "'.concat(season._id, '"]')]
        }
      }));
      const transaction = patches.reduce((tx, patch) => tx.patch(patch.id, patch.patch), client.transaction());
      transaction.delete(season._id);
      return from(transaction.commit());
    }),
    // Dispatch complete action
    mergeMap(() => of(seasonsSlice.actions.deleteComplete({
      seasonId: season._id
    }))), catchError(error => of(seasonsSlice.actions.deleteError({
      error: {
        message: (error == null ? void 0 : error.message) || "Internal error",
        statusCode: (error == null ? void 0 : error.statusCode) || 500
      },
      season
    }))));
  }));
};
const selectSeasonsByIds = state => state.seasons.byIds;
const selectSeasonById = createSelector([selectSeasonsByIds, (_state, seasonId) => seasonId], (byIds, seasonId) => byIds[seasonId]);
const selectSeasons = createSelector(selectSeasonsByIds, byIds => Object.values(byIds));
const selectInitialSelectedSeasons = asset => createSelector(selectSeasons, seasons => {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const selectedCollaboration = (_c = (_a2 = asset == null ? void 0 : asset.season) == null ? void 0 : _a2._ref) != null ? _c : (_b2 = asset == null ? void 0 : asset.season) == null ? void 0 : _b2._id;
  const season = seasons.find(seasonItem => seasonItem.season._id === selectedCollaboration);
  if (((_e = (_d = season == null ? void 0 : season.season) == null ? void 0 : _d.name) == null ? void 0 : _e.current) && ((_f = season == null ? void 0 : season.season) == null ? void 0 : _f._id)) {
    return {
      label: (_i = (_h = (_g = season == null ? void 0 : season.season) == null ? void 0 : _g.name) == null ? void 0 : _h.current) != null ? _i : "",
      value: (_k = (_j = season == null ? void 0 : season.season) == null ? void 0 : _j._id) != null ? _k : ""
    };
  }
  return null;
});
createSelector(selectSeasonsByIds, byIds => byIds);
const seasonActions = seasonsSlice.actions;
var seasonsReducer = seasonsSlice.reducer;
var __freeze$j = Object.freeze;
var __defProp$k = Object.defineProperty;
var __template$j = (cooked, raw) => __freeze$j(__defProp$k(cooked, "raw", {
  value: __freeze$j(raw || cooked.slice())
}));
var _a$j, _b$9;
const initialState$5 = {
  creating: false,
  fetching: false,
  fetchingError: void 0,
  creatingError: void 0,
  byIds: {},
  panelVisible: false,
  fetchCount: -1,
  allIds: []
};
const collaborationSlice = createSlice({
  name: "collaborations",
  initialState: initialState$5,
  reducers: {
    // Create collaboration
    createRequest(state, _action) {
      state.creating = true;
      delete state.creatingError;
    },
    createComplete(state, action) {
      const {
        collaboration
      } = action.payload;
      state.creating = false;
      state.byIds[collaboration._id] = {
        _type: "collaborationItem",
        error: void 0,
        picked: false,
        collaboration,
        updating: false
      };
    },
    createError(state, action) {
      state.creating = false;
      state.creatingError = action.payload.error;
    },
    // Queue batch tag creation
    listenerCreateQueue(_state, _action) {},
    // Fetch collaborations
    fetchRequest: {
      reducer: (state, _action) => {
        state.fetching = true;
        delete state.fetchingError;
      },
      prepare: () => {
        const query = groq(_a$j || (_a$j = __template$j(['\n          {\n            "items": *[\n              _type == "', '"\n              && !(_id in path("drafts.**"))\n            ] {\n              _createdAt,\n              _updatedAt,\n              _id,\n              _rev,\n              _type,\n              name\n            } | order(name.current asc),\n          }\n        '])), COLLABORATION_DOCUMENT_NAME);
        return {
          payload: {
            query
          }
        };
      }
    },
    fetchComplete(state, action) {
      state.fetching = false;
      state.fetchingError = void 0;
      const {
        collaborations
      } = action.payload;
      state.byIds = action.payload.collaborations.reduce((acc, collaboration) => {
        acc[collaboration._id] = {
          _type: "collaborationItem",
          error: void 0,
          picked: false,
          collaboration,
          updating: false
        };
        return acc;
      }, {});
      collaborations == null ? void 0 : collaborations.forEach(collaboration => {
        state.allIds.push(collaboration._id);
        state.byIds[collaboration._id] = {
          _type: "collaborationItem",
          picked: false,
          collaboration,
          updating: false
        };
      });
      state.fetching = false;
      state.fetchCount = collaborations.length || 0;
      delete state.fetchingError;
    },
    fetchError(state, action) {
      const {
        error
      } = action.payload;
      state.fetching = false;
      state.fetchingError = error;
    },
    listenerCreateQueueComplete(state, action) {
      const {
        collaborations
      } = action.payload;
      collaborations == null ? void 0 : collaborations.forEach(collaboration => {
        state.byIds[collaboration._id] = {
          _type: "collaborationItem",
          picked: false,
          collaboration,
          updating: false
        };
      });
    },
    // Update collaboration
    updateRequest(state, action) {
      const {
        collaboration
      } = action.payload;
      state.byIds[collaboration._id].updating = true;
    },
    updateCollaborationItemRequest(state, action) {
      const {
        collaboration
      } = action.payload;
      state.byIds[collaboration == null ? void 0 : collaboration._id].updating = true;
    },
    updateComplete(state, action) {
      const {
        collaboration
      } = action.payload;
      state.byIds[collaboration._id].updating = false;
      state.byIds[collaboration._id].collaboration = collaboration;
    },
    updateError(state, action) {
      const {
        error,
        collaboration
      } = action.payload;
      const collaborationId = collaboration == null ? void 0 : collaboration._id;
      state.byIds[collaborationId].error = error;
      state.byIds[collaborationId].updating = false;
    },
    deleteRequest(state, action) {
      var _a2, _b2;
      const collaborationId = (_b2 = (_a2 = action.payload) == null ? void 0 : _a2.collaboration) == null ? void 0 : _b2._id;
      state.byIds[collaborationId].picked = false;
      state.byIds[collaborationId].updating = true;
      Object.keys(state.byIds).forEach(key => {
        delete state.byIds[key].error;
      });
    },
    deleteComplete(state, action) {
      const {
        collaborationId
      } = action.payload;
      const deleteIndex = state.allIds.indexOf(collaborationId);
      if (deleteIndex >= 0) {
        state.allIds.splice(deleteIndex, 1);
      }
      delete state.byIds[collaborationId];
    },
    deleteError(state, action) {
      const {
        error,
        collaboration
      } = action.payload;
      const collaborationId = collaboration == null ? void 0 : collaboration._id;
      state.byIds[collaborationId].error = error;
      state.byIds[collaborationId].updating = false;
    },
    // Set tag panel visibility
    panelVisibleSet(state, action) {
      const {
        panelVisible
      } = action.payload;
      state.panelVisible = panelVisible;
    }
  }
});
const collaborationFetchEpic = (action$, state$, _ref52) => {
  let {
    client
  } = _ref52;
  return action$.pipe(filter(collaborationSlice.actions.fetchRequest.match), withLatestFrom(state$), switchMap(_ref53 => {
    let [action, state] = _ref53;
    const {
      query
    } = action.payload;
    return of(action).pipe(
    // Optionally throttle
    debugThrottle(state.debug.badConnection),
    // Fetch collaborations
    mergeMap(() => client.observable.fetch(query)),
    // Dispatch complete action
    mergeMap(result => {
      const {
        items
      } = result;
      return of(collaborationSlice.actions.fetchComplete({
        collaborations: items
      }));
    }), catchError(error => of(collaborationSlice.actions.fetchError({
      error: {
        message: (error == null ? void 0 : error.message) || "Internal error",
        statusCode: (error == null ? void 0 : error.statusCode) || 500
      }
    }))));
  }));
};
const collaborationsCreateEpic = (action$, state$, _ref54) => {
  let {
    client
  } = _ref54;
  return action$.pipe(filter(collaborationSlice.actions.createRequest.match), withLatestFrom(state$), mergeMap(_ref55 => {
    let [action, state] = _ref55;
    const {
      name
    } = action.payload;
    return of(action).pipe(debugThrottle(state.debug.badConnection), mergeMap(() => client.observable.create({
      _type: COLLABORATION_DOCUMENT_NAME,
      name: {
        _type: "slug",
        current: name
      }
    })), mergeMap(result => of(collaborationSlice.actions.createComplete({
      collaboration: result
    }))), catchError(error => of(collaborationSlice.actions.createError({
      error: {
        message: (error == null ? void 0 : error.message) || "Internal error",
        statusCode: (error == null ? void 0 : error.statusCode) || 500
      },
      name
    }))));
  }));
};
const collaborationUpdateEpic = (action$, state$, _ref56) => {
  let {
    client
  } = _ref56;
  return action$.pipe(filter(collaborationSlice.actions.updateCollaborationItemRequest.match), withLatestFrom(state$), mergeMap(_ref57 => {
    let [action, state] = _ref57;
    var _a2;
    const {
      closeDialogId,
      formData,
      collaboration
    } = action.payload;
    return of(action).pipe(
    // Optionally throttle
    debugThrottle(state.debug.badConnection),
    // Check if collaboration name is available, throw early if not
    checkCollaborationName(client, (_a2 = formData == null ? void 0 : formData.name) == null ? void 0 : _a2.current),
    // Patch document (Update collaboration)
    mergeMap(() => from(client.patch(collaboration._id).set({
      name: {
        _type: "slug",
        current: formData == null ? void 0 : formData.name.current
      }
    }).commit())),
    // Dispatch complete action
    mergeMap(updatedCollaboration => {
      return of(collaborationSlice.actions.updateComplete({
        closeDialogId,
        collaboration: updatedCollaboration
      }));
    }), catchError(error => of(collaborationSlice.actions.updateError({
      error: {
        message: (error == null ? void 0 : error.message) || "Internal error",
        statusCode: (error == null ? void 0 : error.statusCode) || 500
      },
      collaboration
    }))));
  }));
};
const collaborationsDeleteEpic = (action$, state$, _ref58) => {
  let {
    client
  } = _ref58;
  return action$.pipe(filter(collaborationActions.deleteRequest.match), withLatestFrom(state$), mergeMap(_ref59 => {
    let [action, state] = _ref59;
    const {
      collaboration
    } = action.payload;
    return of(action).pipe(
    // Optionally throttle
    debugThrottle(state.debug.badConnection),
    // Fetch assets which reference this tag
    mergeMap(() => {
      var _a2, _b2;
      return client.observable.fetch(groq(_b$9 || (_b$9 = __template$j(['*[\n              _type in ["sanity.fileAsset", "sanity.imageAsset"]\n              && references(*[_type == "collaboration" && name.current == $collaboration]._id)\n            ] {\n              _id,\n              _rev,\n              opt\n            }']))), {
        collaboration: (_b2 = (_a2 = collaboration == null ? void 0 : collaboration.name) == null ? void 0 : _a2.current) != null ? _b2 : null
      });
    }),
    // Create transaction which remove collaboration references from all matched assets and delete tag
    mergeMap(assets => {
      const patches = assets.map(asset => ({
        id: asset._id,
        patch: {
          // this will cause the transaction to fail if the document has been modified since it was fetched.
          ifRevisionID: asset._rev,
          unset: ['collaboration[_ref == "'.concat(collaboration._id, '"]')],
          set: {
            collaboration: null
          }
        }
      }));
      const transaction = patches.reduce((tx, patch) => tx.patch(patch.id, patch.patch), client.transaction());
      transaction.delete(collaboration._id);
      return from(transaction.commit());
    }),
    // Dispatch complete action
    mergeMap(() => of(collaborationSlice.actions.deleteComplete({
      collaborationId: collaboration._id
    }))), catchError(error => of(collaborationSlice.actions.deleteError({
      error: {
        message: (error == null ? void 0 : error.message) || "Internal error",
        statusCode: (error == null ? void 0 : error.statusCode) || 500
      },
      collaboration
    }))));
  }));
};
const selectCollaborationsByIds = state => state.collaborations.byIds;
const selectCollaborationById = createSelector([selectCollaborationsByIds, (_state, collaborationId) => collaborationId], (byIds, collaborationId) => byIds[collaborationId]);
const selectCollaborations = createSelector(selectCollaborationsByIds, byIds => Object.values(byIds));
const selectInitialSelectedCollaboration = asset => createSelector(selectCollaborations, collaborations => {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const selectedCollaboration = (_c = (_a2 = asset == null ? void 0 : asset.collaboration) == null ? void 0 : _a2._ref) != null ? _c : (_b2 = asset == null ? void 0 : asset.collaboration) == null ? void 0 : _b2._id;
  const collaboration = collaborations.find(collaborationItem => collaborationItem.collaboration._id === selectedCollaboration);
  if (((_e = (_d = collaboration == null ? void 0 : collaboration.collaboration) == null ? void 0 : _d.name) == null ? void 0 : _e.current) && ((_f = collaboration == null ? void 0 : collaboration.collaboration) == null ? void 0 : _f._id)) {
    return {
      label: (_i = (_h = (_g = collaboration == null ? void 0 : collaboration.collaboration) == null ? void 0 : _g.name) == null ? void 0 : _h.current) != null ? _i : "",
      value: (_k = (_j = collaboration == null ? void 0 : collaboration.collaboration) == null ? void 0 : _j._id) != null ? _k : ""
    };
  }
  return null;
});
createSelector(selectCollaborationsByIds, byIds => byIds);
const collaborationActions = collaborationSlice.actions;
var collaborationsReducer = collaborationSlice.reducer;
const initialState$4 = {
  items: []
};
const dialogSlice = createSlice({
  name: "dialog",
  initialState: initialState$4,
  extraReducers: builder => {
    builder.addCase(DIALOG_ACTIONS.showTagCreate, state => {
      state.items.push({
        id: "tagCreate",
        type: "tagCreate"
      });
    });
    builder.addCase(DIALOG_ACTIONS.showSeasonCreate, state => {
      state.items.push({
        id: "seasonCreate",
        type: "seasonCreate"
      });
    });
    builder.addCase(DIALOG_ACTIONS.showCollaborationCreate, state => {
      state.items.push({
        id: "collaborationCreate",
        type: "collaborationCreate"
      });
    });
    builder.addCase(DIALOG_ACTIONS.showMassEdit, state => {
      state.items.push({
        id: "massEdit",
        type: "massEdit"
      });
    });
    builder.addCase(DIALOG_ACTIONS.showTagEdit, (state, action) => {
      const {
        tagId
      } = action.payload;
      state.items.push({
        id: tagId,
        tagId,
        type: "tagEdit"
      });
    });
    builder.addCase(DIALOG_ACTIONS.showSeasonEdit, (state, action) => {
      const {
        seasonId
      } = action.payload;
      state.items.push({
        id: seasonId,
        seasonId,
        type: "seasonEdit"
      });
    });
    builder.addCase(DIALOG_ACTIONS.showCollaborationEdit, (state, action) => {
      const {
        collaborationId
      } = action.payload;
      state.items.push({
        id: collaborationId,
        collaborationId,
        type: "collaborationEdit"
      });
    });
  },
  reducers: {
    // Clear all dialogs
    clear(state) {
      state.items = [];
    },
    // Add newly created inline tag to assetEdit dialog
    inlineTagCreate(state, action) {
      const {
        assetId,
        tag
      } = action.payload;
      state.items.forEach(item => {
        if (item.type === "assetEdit" && item.assetId === assetId) {
          item.lastCreatedTag = {
            label: tag.name.current,
            value: tag._id
          };
        }
      });
    },
    // Remove inline tags from assetEdit dialog
    inlineTagRemove(state, action) {
      const {
        tagIds
      } = action.payload;
      state.items.forEach(item => {
        if (item.type === "assetEdit") {
          item.lastRemovedTagIds = tagIds;
        }
      });
    },
    // Remove dialog by id
    remove(state, action) {
      var _a;
      const id = (_a = action.payload) == null ? void 0 : _a.id;
      state.items = state.items.filter(item => item.id !== id);
    },
    showConfirmAssetsTagAdd(state, action) {
      const {
        assetsPicked,
        closeDialogId,
        tag
      } = action.payload;
      const suffix = "".concat(assetsPicked.length, " ").concat(pluralize("asset", assetsPicked.length));
      state.items.push({
        closeDialogId,
        confirmCallbackAction: ASSETS_ACTIONS.tagsAddRequest({
          assets: assetsPicked,
          tag
        }),
        confirmText: "Yes, add tag to ".concat(suffix),
        title: "Add tag ".concat(tag.name.current, " to ").concat(suffix, "?"),
        id: "confirm",
        headerTitle: "Confirm tag addition",
        tone: "primary",
        type: "confirm"
      });
    },
    showConfirmAssetsSeasonAdd(state, action) {
      const {
        assetsPicked,
        closeDialogId,
        season
      } = action.payload;
      const suffix = "".concat(assetsPicked.length, " ").concat(pluralize("asset", assetsPicked.length));
      state.items.push({
        closeDialogId,
        confirmCallbackAction: ASSETS_ACTIONS.seasonsAddRequest({
          assets: assetsPicked,
          season
        }),
        confirmText: "Yes, add season to ".concat(suffix),
        title: "Add tag ".concat(season.name.current, " to ").concat(suffix, "?"),
        id: "confirm",
        headerTitle: "Confirm season addition",
        tone: "primary",
        type: "confirm"
      });
    },
    showConfirmAssetsCollaborationsAdd(state, action) {
      const {
        assetsPicked,
        closeDialogId,
        collaboration
      } = action.payload;
      const suffix = "".concat(assetsPicked.length, " ").concat(pluralize("asset", assetsPicked.length));
      state.items.push({
        closeDialogId,
        confirmCallbackAction: ASSETS_ACTIONS.collaborationsAddRequest({
          assets: assetsPicked,
          collaboration
        }),
        confirmText: "Yes, add collaboration to ".concat(suffix),
        title: "Add tag ".concat(collaboration.name.current, " to ").concat(suffix, "?"),
        id: "confirm",
        headerTitle: "Confirm collaboration addition",
        tone: "primary",
        type: "confirm"
      });
    },
    showConfirmAssetsTagRemove(state, action) {
      const {
        assetsPicked,
        closeDialogId,
        tag
      } = action.payload;
      const suffix = "".concat(assetsPicked.length, " ").concat(pluralize("asset", assetsPicked.length));
      state.items.push({
        closeDialogId,
        confirmCallbackAction: ASSETS_ACTIONS.tagsRemoveRequest({
          assets: assetsPicked,
          tag
        }),
        confirmText: "Yes, remove tag from ".concat(suffix),
        headerTitle: "Confirm tag removal",
        id: "confirm",
        title: "Remove tag ".concat(tag.name.current, " from ").concat(suffix, "?"),
        tone: "critical",
        type: "confirm"
      });
    },
    showConfirmAssetsSeasonRemove(state, action) {
      const {
        assetsPicked,
        closeDialogId,
        season
      } = action.payload;
      const suffix = "".concat(assetsPicked.length, " ").concat(pluralize("asset", assetsPicked.length));
      state.items.push({
        closeDialogId,
        confirmCallbackAction: ASSETS_ACTIONS.seasonsRemoveRequest({
          assets: assetsPicked,
          season
        }),
        confirmText: "Yes, remove season from ".concat(suffix),
        headerTitle: "Confirm season removal",
        id: "confirm",
        title: "Remove season ".concat(season.name.current, " from ").concat(suffix, "?"),
        tone: "critical",
        type: "confirm"
      });
    },
    showConfirmAssetsCollaborationRemove(state, action) {
      const {
        assetsPicked,
        closeDialogId,
        collaboration
      } = action.payload;
      const suffix = "".concat(assetsPicked.length, " ").concat(pluralize("asset", assetsPicked.length));
      state.items.push({
        closeDialogId,
        confirmCallbackAction: ASSETS_ACTIONS.collaborationsRemoveRequest({
          assets: assetsPicked,
          collaboration
        }),
        confirmText: "Yes, remove collaboration from ".concat(suffix),
        headerTitle: "Confirm collaboration removal",
        id: "confirm",
        title: "Remove collaboration ".concat(collaboration.name.current, " from ").concat(suffix, "?"),
        tone: "critical",
        type: "confirm"
      });
    },
    showConfirmDeleteAssets(state, action) {
      const {
        assets,
        closeDialogId
      } = action.payload;
      const suffix = "".concat(assets.length, " ").concat(pluralize("asset", assets.length));
      state.items.push({
        closeDialogId,
        confirmCallbackAction: assetsActions.deleteRequest({
          assets: assets.map(assetItem => assetItem.asset)
        }),
        confirmText: "Yes, delete ".concat(suffix),
        description: "This operation cannot be reversed. Are you sure you want to continue?",
        title: "Permanently delete ".concat(suffix, "?"),
        id: "confirm",
        headerTitle: "Confirm deletion",
        tone: "critical",
        type: "confirm"
      });
    },
    showConfirmDeleteTag(state, action) {
      const {
        closeDialogId,
        tag
      } = action.payload;
      const suffix = "tag";
      state.items.push({
        closeDialogId,
        confirmCallbackAction: tagsActions.deleteRequest({
          tag
        }),
        confirmText: "Yes, delete ".concat(suffix),
        description: "This operation cannot be reversed. Are you sure you want to continue?",
        title: "Permanently delete ".concat(suffix, "?"),
        id: "confirm",
        headerTitle: "Confirm deletion",
        tone: "critical",
        type: "confirm"
      });
    },
    showConfirmDeleteSeason(state, action) {
      const {
        closeDialogId,
        season
      } = action.payload;
      const suffix = "season";
      state.items.push({
        closeDialogId,
        confirmCallbackAction: seasonActions.deleteRequest({
          season
        }),
        confirmText: "Yes, delete ".concat(suffix),
        description: "This operation cannot be reversed. Are you sure you want to continue?",
        title: "Permanently delete ".concat(suffix, "?"),
        id: "confirm",
        headerTitle: "Confirm deletion",
        tone: "critical",
        type: "confirm"
      });
    },
    showConfirmDeleteCollaboration(state, action) {
      const {
        closeDialogId,
        collaboration
      } = action.payload;
      const suffix = "collaboration";
      state.items.push({
        closeDialogId,
        confirmCallbackAction: collaborationActions.deleteRequest({
          collaboration
        }),
        confirmText: "Yes, delete ".concat(suffix),
        description: "This operation cannot be reversed. Are you sure you want to continue?",
        title: "Permanently delete ".concat(suffix, "?"),
        id: "confirm",
        headerTitle: "Confirm deletion",
        tone: "critical",
        type: "confirm"
      });
    },
    showAssetEdit(state, action) {
      const {
        assetId
      } = action.payload;
      state.items.push({
        assetId,
        id: assetId,
        type: "assetEdit"
      });
    },
    showMassAssetEdit(state) {
      state.items.push({
        id: "massEdit",
        type: "massEdit",
        closeDialogId: "massEdit"
      });
    },
    showSearchFacets(state) {
      state.items.push({
        id: "searchFacets",
        type: "searchFacets"
      });
    },
    showTags(state) {
      state.items.push({
        id: "tags",
        type: "tags"
      });
    },
    showSeasons(state) {
      state.items.push({
        id: "seasons",
        type: "seasons"
      });
    }
  }
});
const dialogClearOnAssetUpdateEpic = action$ => action$.pipe(ofType(assetsActions.deleteComplete.type, assetsActions.updateComplete.type, tagsActions.deleteComplete.type, tagsActions.updateComplete.type, seasonActions.deleteComplete.type, seasonActions.updateComplete.type, collaborationActions.deleteComplete.type, collaborationActions.updateComplete.type), filter(action => {
  var _a;
  return !!((_a = action == null ? void 0 : action.payload) == null ? void 0 : _a.closeDialogId);
}), mergeMap(action => {
  var _a;
  const dialogId = (_a = action == null ? void 0 : action.payload) == null ? void 0 : _a.closeDialogId;
  if (dialogId) {
    return of(dialogSlice.actions.remove({
      id: dialogId
    }));
  }
  return empty();
}));
const dialogTagCreateEpic = action$ => action$.pipe(filter(tagsActions.createComplete.match), mergeMap(action => {
  const {
    assetId,
    tag
  } = action == null ? void 0 : action.payload;
  if (assetId) {
    return of(dialogSlice.actions.inlineTagCreate({
      tag,
      assetId
    }));
  }
  if (tag._id) {
    return of(dialogSlice.actions.remove({
      id: "tagCreate"
    }));
  }
  return empty();
}));
const dialogTagDeleteEpic = action$ => action$.pipe(filter(tagsActions.listenerDeleteQueueComplete.match), mergeMap(action => {
  const {
    tagIds
  } = action == null ? void 0 : action.payload;
  return of(dialogSlice.actions.inlineTagRemove({
    tagIds
  }));
}));
const dialogActions = dialogSlice.actions;
var dialogReducer = dialogSlice.reducer;
const ButtonViewGroup = () => {
  const dispatch = useDispatch();
  const view = useTypedSelector(state => state.assets.view);
  return /* @__PURE__ */jsxs(Inline, {
    space: 0,
    style: {
      whiteSpace: "nowrap"
    },
    children: [/* @__PURE__ */jsx(Button, {
      fontSize: 1,
      icon: ThLargeIcon,
      mode: view === "grid" ? "default" : "ghost",
      onClick: () => dispatch(assetsActions.viewSet({
        view: "grid"
      })),
      style: {
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0
      }
    }), /* @__PURE__ */jsx(Button, {
      fontSize: 1,
      icon: ThListIcon,
      mode: view === "table" ? "default" : "ghost",
      onClick: () => dispatch(assetsActions.viewSet({
        view: "table"
      })),
      style: {
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0
      }
    })]
  });
};
function usePortalPopoverProps() {
  const portal = usePortal();
  return {
    constrainSize: true,
    floatingBoundary: portal.element,
    portal: true,
    referenceBoundary: portal.element
  };
}
const OrderSelect = () => {
  var _a;
  const dispatch = useDispatch();
  const order = useTypedSelector(state => state.assets.order);
  const popoverProps = usePortalPopoverProps();
  return /* @__PURE__ */jsx(MenuButton, {
    button: /* @__PURE__ */jsx(Button, {
      fontSize: 1,
      icon: SortIcon,
      mode: "bleed",
      padding: 3,
      text: getOrderTitle(order.field, order.direction)
    }),
    id: "order",
    menu: /* @__PURE__ */jsx(Menu$2, {
      children: (_a = ORDER_OPTIONS) == null ? void 0 : _a.map((item, index) => {
        if (item) {
          const selected = order.field === item.field && order.direction === item.direction;
          return /* @__PURE__ */jsx(MenuItem, {
            disabled: selected,
            fontSize: 1,
            iconRight: selected,
            onClick: () => dispatch(assetsActions.orderSet({
              order: {
                direction: item.direction,
                field: item.field
              }
            })),
            padding: 2,
            selected,
            space: 4,
            style: {
              minWidth: "200px"
            },
            text: getOrderTitle(item.field, item.direction)
          }, index);
        }
        return /* @__PURE__ */jsx(MenuDivider, {}, index);
      })
    }),
    popover: popoverProps
  });
};
const Progress = props => {
  const {
    loading
  } = props;
  const {
    animationDuration,
    isFinished,
    progress
  } = useNProgress({
    animationDuration: 300,
    isAnimating: loading
  });
  return /* @__PURE__ */jsx(Box, {
    style: {
      opacity: isFinished ? 0 : 1,
      transition: "opacity ".concat(animationDuration, "ms linear")
    },
    children: /* @__PURE__ */jsx(Box, {
      style: {
        height: "1px",
        background: "rgba(255, 255, 255, 0.5)",
        position: "absolute",
        left: 0,
        top: 0,
        transition: "width ".concat(animationDuration, "ms linear"),
        width: "".concat(progress * 100, "%")
      }
    })
  });
};
const white$1 = "#fff";
const gray = {
  "50": {
    title: "Gray 50",
    hex: "#f2f3f5"
  },
  "100": {
    title: "Gray 100",
    hex: "#e6e8ec"
  },
  "200": {
    title: "Gray 200",
    hex: "#ced2d9"
  },
  "300": {
    title: "Gray 300",
    hex: "#b6bcc6"
  },
  "400": {
    title: "Gray 400",
    hex: "#9ea6b3"
  },
  "500": {
    title: "Gray 500",
    hex: "#8690a0"
  },
  "600": {
    title: "Gray 600",
    hex: "#6e7683"
  },
  "700": {
    title: "Gray 700",
    hex: "#565d67"
  },
  "800": {
    title: "Gray 800",
    hex: "#3f434a"
  },
  "900": {
    title: "Gray 900",
    hex: "#272a2e"
  },
  "950": {
    title: "Gray 950",
    hex: "#1b1d20"
  }
};
const blue = {
  "50": {
    title: "Blue 50",
    hex: "#e8f1fe"
  },
  "100": {
    title: "Blue 100",
    hex: "#d2e3fe"
  },
  "200": {
    title: "Blue 200",
    hex: "#a6c8fd"
  },
  "300": {
    title: "Blue 300",
    hex: "#7aacfd"
  },
  "400": {
    title: "Blue 400",
    hex: "#4e91fc"
  },
  "500": {
    title: "Blue 500",
    hex: "#2276fc"
  },
  "600": {
    title: "Blue 600",
    hex: "#1e61cd"
  },
  "700": {
    title: "Blue 700",
    hex: "#1a4d9e"
  },
  "800": {
    title: "Blue 800",
    hex: "#17396f"
  },
  "900": {
    title: "Blue 900",
    hex: "#132540"
  },
  "950": {
    title: "Blue 950",
    hex: "#111b29"
  }
};
const purple = {
  "50": {
    title: "Purple 50",
    hex: "#f8e9fe"
  },
  "100": {
    title: "Purple 100",
    hex: "#f2d3fe"
  },
  "200": {
    title: "Purple 200",
    hex: "#e6a7fd"
  },
  "300": {
    title: "Purple 300",
    hex: "#d97bfd"
  },
  "400": {
    title: "Purple 400",
    hex: "#cd4efc"
  },
  "500": {
    title: "Purple 500",
    hex: "#c123fc"
  },
  "600": {
    title: "Purple 600",
    hex: "#9d1fcd"
  },
  "700": {
    title: "Purple 700",
    hex: "#7a1b9e"
  },
  "800": {
    title: "Purple 800",
    hex: "#56186f"
  },
  "900": {
    title: "Purple 900",
    hex: "#331440"
  },
  "950": {
    title: "Purple 950",
    hex: "#211229"
  }
};
const magenta = {
  "50": {
    title: "Magenta 50",
    hex: "#fcebf5"
  },
  "100": {
    title: "Magenta 100",
    hex: "#f9d7eb"
  },
  "200": {
    title: "Magenta 200",
    hex: "#f4afd8"
  },
  "300": {
    title: "Magenta 300",
    hex: "#ef87c4"
  },
  "400": {
    title: "Magenta 400",
    hex: "#ea5fb1"
  },
  "500": {
    title: "Magenta 500",
    hex: "#e5389e"
  },
  "600": {
    title: "Magenta 600",
    hex: "#ba3082"
  },
  "700": {
    title: "Magenta 700",
    hex: "#8f2866"
  },
  "800": {
    title: "Magenta 800",
    hex: "#65204a"
  },
  "900": {
    title: "Magenta 900",
    hex: "#3a182d"
  },
  "950": {
    title: "Magenta 950",
    hex: "#25141f"
  }
};
const red = {
  "50": {
    title: "Red 50",
    hex: "#fdebea"
  },
  "100": {
    title: "Red 100",
    hex: "#fcd8d5"
  },
  "200": {
    title: "Red 200",
    hex: "#f9b1ab"
  },
  "300": {
    title: "Red 300",
    hex: "#f68b82"
  },
  "400": {
    title: "Red 400",
    hex: "#f36458"
  },
  "500": {
    title: "Red 500",
    hex: "#f03e2f"
  },
  "600": {
    title: "Red 600",
    hex: "#c33529"
  },
  "700": {
    title: "Red 700",
    hex: "#962c23"
  },
  "800": {
    title: "Red 800",
    hex: "#69231d"
  },
  "900": {
    title: "Red 900",
    hex: "#3c1a17"
  },
  "950": {
    title: "Red 950",
    hex: "#261514"
  }
};
const orange = {
  "50": {
    title: "Orange 50",
    hex: "#fef0e6"
  },
  "100": {
    title: "Orange 100",
    hex: "#fee2ce"
  },
  "200": {
    title: "Orange 200",
    hex: "#fdc59d"
  },
  "300": {
    title: "Orange 300",
    hex: "#fca86d"
  },
  "400": {
    title: "Orange 400",
    hex: "#fb8b3c"
  },
  "500": {
    title: "Orange 500",
    hex: "#e57322"
  },
  "600": {
    title: "Orange 600",
    hex: "#ba5f1f"
  },
  "700": {
    title: "Orange 700",
    hex: "#904b1b"
  },
  "800": {
    title: "Orange 800",
    hex: "#653818"
  },
  "900": {
    title: "Orange 900",
    hex: "#3a2415"
  },
  "950": {
    title: "Orange 950",
    hex: "#251a13"
  }
};
const yellow = {
  "50": {
    title: "Yellow 50",
    hex: "#fef7da"
  },
  "100": {
    title: "Yellow 100",
    hex: "#fdefb6"
  },
  "200": {
    title: "Yellow 200",
    hex: "#fcdf6d"
  },
  "300": {
    title: "Yellow 300",
    hex: "#fbd024"
  },
  "400": {
    title: "Yellow 400",
    hex: "#d9b421"
  },
  "500": {
    title: "Yellow 500",
    hex: "#b7991e"
  },
  "600": {
    title: "Yellow 600",
    hex: "#967e1c"
  },
  "700": {
    title: "Yellow 700",
    hex: "#746219"
  },
  "800": {
    title: "Yellow 800",
    hex: "#534717"
  },
  "900": {
    title: "Yellow 900",
    hex: "#312c14"
  },
  "950": {
    title: "Yellow 950",
    hex: "#201e13"
  }
};
const green = {
  "50": {
    title: "Green 50",
    hex: "#e7f9ed"
  },
  "100": {
    title: "Green 100",
    hex: "#d0f4dc"
  },
  "200": {
    title: "Green 200",
    hex: "#a1eaba"
  },
  "300": {
    title: "Green 300",
    hex: "#72e097"
  },
  "400": {
    title: "Green 400",
    hex: "#43d675"
  },
  "500": {
    title: "Green 500",
    hex: "#3ab564"
  },
  "600": {
    title: "Green 600",
    hex: "#329454"
  },
  "700": {
    title: "Green 700",
    hex: "#297343"
  },
  "800": {
    title: "Green 800",
    hex: "#215233"
  },
  "900": {
    title: "Green 900",
    hex: "#183122"
  },
  "950": {
    title: "Green 950",
    hex: "#14211a"
  }
};
const cyan = {
  "50": {
    title: "Cyan 50",
    hex: "#e3fafd"
  },
  "100": {
    title: "Cyan 100",
    hex: "#c7f5fc"
  },
  "200": {
    title: "Cyan 200",
    hex: "#90ecf9"
  },
  "300": {
    title: "Cyan 300",
    hex: "#59e3f6"
  },
  "400": {
    title: "Cyan 400",
    hex: "#22daf4"
  },
  "500": {
    title: "Cyan 500",
    hex: "#1fb8ce"
  },
  "600": {
    title: "Cyan 600",
    hex: "#1c97a8"
  },
  "700": {
    title: "Cyan 700",
    hex: "#197583"
  },
  "800": {
    title: "Cyan 800",
    hex: "#16545d"
  },
  "900": {
    title: "Cyan 900",
    hex: "#133237"
  },
  "950": {
    title: "Cyan 950",
    hex: "#112124"
  }
};
const hues = {
  gray,
  blue,
  purple,
  magenta,
  red,
  orange,
  yellow,
  green,
  cyan
};
const white = {
  title: "White",
  hex: white$1
};
const SCHEME_COLORS = {
  bg: {
    dark: hues.gray[950].hex,
    light: hues.gray[50].hex
  },
  bg2: {
    dark: hues.gray[900].hex,
    light: hues.gray[100].hex
  },
  text: {
    dark: "#fff",
    light: "#000"
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
};
function getSchemeColor(scheme, colorKey) {
  var _a;
  return (_a = SCHEME_COLORS[colorKey]) == null ? void 0 : _a[scheme];
}
var __freeze$i = Object.freeze;
var __defProp$j = Object.defineProperty;
var __template$i = (cooked, raw) => __freeze$i(__defProp$j(cooked, "raw", {
  value: __freeze$i(raw || cooked.slice())
}));
var _a$i;
const Container$1 = styled(Box)(_ref60 => {
  let {
    scheme,
    theme
  } = _ref60;
  return css(_a$i || (_a$i = __template$i(["\n    background: ", ";\n    border-radius: ", ";\n  "])), getSchemeColor(scheme, "bg"), rem(theme.sanity.radius[2]));
});
const SearchFacet = props => {
  const {
    children,
    facet
  } = props;
  const {
    scheme
  } = useColorScheme();
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(searchActions.facetsRemoveById({
      facetId: facet.id
    }));
  };
  return /* @__PURE__ */jsx(Container$1, {
    padding: [2, 2, 1],
    scheme,
    children: /* @__PURE__ */jsxs(Flex, {
      align: ["flex-start", "flex-start", "center"],
      direction: ["column", "column", "row"],
      children: [/* @__PURE__ */jsx(Box, {
        paddingBottom: [3, 3, 0],
        paddingLeft: 1,
        paddingRight: 2,
        paddingTop: [1, 1, 0],
        children: /* @__PURE__ */jsx(Label, {
          size: 0,
          style: {
            whiteSpace: "nowrap"
          },
          children: facet.title
        })
      }), /* @__PURE__ */jsxs(Flex, {
        align: "center",
        children: [children, /* @__PURE__ */jsx(Box, {
          marginLeft: 1,
          paddingX: 2,
          children: /* @__PURE__ */jsx(Text, {
            muted: true,
            size: 0,
            children: /* @__PURE__ */jsx(CloseIcon, {
              onClick: handleClose
            })
          })
        })]
      })]
    })
  });
};
const TextInputNumber = props => {
  const {
    onValueChange,
    value,
    ...remainingProps
  } = props;
  const handleChange = e => {
    const val = e.target.value;
    const regex = /^[0-9\b]+$/;
    if (val === "" || regex.test(val)) {
      onValueChange(parseInt(val, 10) || "");
    }
  };
  return /* @__PURE__ */jsx(TextInput, {
    ...remainingProps,
    onChange: handleChange,
    value: value != null ? value : ""
  });
};
const SearchFacetNumber = _ref61 => {
  let {
    facet
  } = _ref61;
  var _a;
  const dispatch = useDispatch();
  const popoverProps = usePortalPopoverProps();
  const modifiers = facet == null ? void 0 : facet.modifiers;
  const selectedModifier = (facet == null ? void 0 : facet.modifier) ? modifiers == null ? void 0 : modifiers.find(modifier => modifier.name === (facet == null ? void 0 : facet.modifier)) : modifiers == null ? void 0 : modifiers[0];
  const handleOperatorItemClick = operatorType => {
    dispatch(searchActions.facetsUpdateById({
      id: facet.id,
      operatorType
    }));
  };
  const handleModifierClick = modifier => {
    dispatch(searchActions.facetsUpdateById({
      id: facet.id,
      modifier: modifier.name
    }));
  };
  const handleValueChange = value => {
    dispatch(searchActions.facetsUpdateById({
      id: facet.id,
      value
    }));
  };
  const selectedOperatorType = (_a = facet.operatorType) != null ? _a : "greaterThan";
  return /* @__PURE__ */jsxs(SearchFacet, {
    facet,
    children: [(facet == null ? void 0 : facet.operatorTypes) && /* @__PURE__ */jsx(MenuButton, {
      button: /* @__PURE__ */jsx(Button, {
        fontSize: 1,
        iconRight: SelectIcon,
        padding: 2,
        text: operators[selectedOperatorType].label
      }),
      id: "operators",
      menu: /* @__PURE__ */jsx(Menu$2, {
        children: facet.operatorTypes.map((operatorType, index) => {
          if (operatorType) {
            const selected = operatorType === selectedOperatorType;
            return /* @__PURE__ */jsx(MenuItem, {
              disabled: selected,
              fontSize: 1,
              onClick: () => handleOperatorItemClick(operatorType),
              padding: 2,
              text: operators[operatorType].label
            }, operatorType);
          }
          return /* @__PURE__ */jsx(MenuDivider, {}, index);
        })
      }),
      popover: popoverProps
    }), /* @__PURE__ */jsx(Box, {
      marginX: 1,
      style: {
        maxWidth: "50px"
      },
      children: /* @__PURE__ */jsx(TextInputNumber, {
        fontSize: 1,
        onValueChange: handleValueChange,
        padding: 2,
        radius: 2,
        width: 2,
        value: facet == null ? void 0 : facet.value
      })
    }), modifiers && /* @__PURE__ */jsx(MenuButton, {
      button: /* @__PURE__ */jsx(Button, {
        fontSize: 1,
        iconRight: SelectIcon,
        padding: 2,
        text: selectedModifier == null ? void 0 : selectedModifier.title
      }),
      id: "modifier",
      menu: /* @__PURE__ */jsx(Menu$2, {
        children: modifiers.map(modifier => {
          const selected = modifier.name === facet.modifier;
          return /* @__PURE__ */jsx(MenuItem, {
            disabled: selected,
            fontSize: 1,
            onClick: () => handleModifierClick(modifier),
            padding: 2,
            text: modifier.title
          }, modifier.name);
        })
      }),
      popover: popoverProps
    })]
  });
};
const SearchFacetSelect = _ref62 => {
  let {
    facet
  } = _ref62;
  var _a;
  const dispatch = useDispatch();
  const popoverProps = usePortalPopoverProps();
  const options = facet == null ? void 0 : facet.options;
  const selectedItem = options == null ? void 0 : options.find(v => v.name === (facet == null ? void 0 : facet.value));
  const handleListItemClick = option => {
    dispatch(searchActions.facetsUpdate({
      name: facet.name,
      value: option.name
    }));
  };
  const handleOperatorItemClick = operatorType => {
    dispatch(searchActions.facetsUpdate({
      name: facet.name,
      operatorType
    }));
  };
  const selectedOperatorType = (_a = facet == null ? void 0 : facet.operatorType) != null ? _a : "is";
  return /* @__PURE__ */jsxs(SearchFacet, {
    facet,
    children: [(facet == null ? void 0 : facet.operatorTypes) && /* @__PURE__ */jsx(MenuButton, {
      button: /* @__PURE__ */jsx(Box, {
        marginRight: 1,
        children: /* @__PURE__ */jsx(Button, {
          fontSize: 1,
          iconRight: SelectIcon,
          padding: 2,
          text: operators[selectedOperatorType].label
        })
      }),
      id: "operators",
      menu: /* @__PURE__ */jsx(Menu$2, {
        children: facet.operatorTypes.map((operatorType, index) => {
          if (operatorType) {
            const selected = operatorType === selectedOperatorType;
            return /* @__PURE__ */jsx(MenuItem, {
              disabled: selected,
              fontSize: 1,
              onClick: () => handleOperatorItemClick(operatorType),
              padding: 2,
              text: operators[operatorType].label
            }, operatorType);
          }
          return /* @__PURE__ */jsx(MenuDivider, {}, index);
        })
      }),
      popover: popoverProps
    }), /* @__PURE__ */jsx(MenuButton, {
      button: /* @__PURE__ */jsx(Button, {
        fontSize: 1,
        iconRight: SelectIcon,
        padding: 2,
        text: selectedItem == null ? void 0 : selectedItem.title
      }),
      id: "list",
      menu: /* @__PURE__ */jsx(Menu$2, {
        children: options == null ? void 0 : options.map((item, index) => {
          const selected = item.name === (selectedItem == null ? void 0 : selectedItem.name);
          return /* @__PURE__ */jsx(MenuItem, {
            disabled: selected,
            fontSize: 1,
            onClick: () => handleListItemClick(options[index]),
            padding: 2,
            text: item.title
          }, item.name);
        })
      }),
      popover: popoverProps
    })]
  });
};
const SearchFacetString = _ref63 => {
  let {
    facet
  } = _ref63;
  const dispatch = useDispatch();
  const popoverProps = usePortalPopoverProps();
  const handleOperatorItemClick = operatorType => {
    dispatch(searchActions.facetsUpdateById({
      id: facet.id,
      operatorType
    }));
  };
  const handleChange = e => {
    dispatch(searchActions.facetsUpdateById({
      id: facet.id,
      value: e.target.value
    }));
  };
  const selectedOperatorType = facet.operatorType;
  return /* @__PURE__ */jsxs(SearchFacet, {
    facet,
    children: [(facet == null ? void 0 : facet.operatorTypes) && /* @__PURE__ */jsx(MenuButton, {
      button: /* @__PURE__ */jsx(Button, {
        fontSize: 1,
        iconRight: SelectIcon,
        padding: 2,
        text: operators[selectedOperatorType].label
      }),
      id: "operators",
      menu: /* @__PURE__ */jsx(Menu$2, {
        children: facet.operatorTypes.map((operatorType, index) => {
          if (operatorType) {
            const selected = operatorType === selectedOperatorType;
            return /* @__PURE__ */jsx(MenuItem, {
              disabled: selected,
              fontSize: 1,
              onClick: () => handleOperatorItemClick(operatorType),
              padding: 2,
              text: operators[operatorType].label
            }, operatorType);
          }
          return /* @__PURE__ */jsx(MenuDivider, {}, index);
        })
      }),
      popover: popoverProps
    }), !operators[selectedOperatorType].hideInput && /* @__PURE__ */jsx(Box, {
      marginLeft: 1,
      style: {
        maxWidth: "125px"
      },
      children: /* @__PURE__ */jsx(TextInput, {
        fontSize: 1,
        onChange: handleChange,
        padding: 2,
        radius: 2,
        width: 2,
        value: facet == null ? void 0 : facet.value
      })
    })]
  });
};
const {
  fonts: {
    text: {
      sizes: themeTextSizes
    }
  },
  radius: themeRadius$1,
  space: themeSpace$1
} = studioTheme;
const reactSelectStyles$1 = scheme => {
  return {
    control: (styles, _ref64) => {
      let {
        isDisabled,
        isFocused
      } = _ref64;
      let boxShadow = "inset 0 0 0 1px var(--card-border-color)";
      if (isFocused) {
        boxShadow = "inset 0 0 0 1px ".concat(getSchemeColor(scheme, "inputEnabledBorder"), ",\n        0 0 0 1px ").concat(getSchemeColor(scheme, "bg2"), ",\n        0 0 0 3px var(--card-focus-ring-color) !important");
      }
      return {
        ...styles,
        backgroundColor: "var(--card-bg-color)",
        color: "inherit",
        border: "none",
        borderRadius: themeRadius$1[2],
        boxShadow,
        fontSize: themeTextSizes[1].fontSize,
        minHeight: "25px",
        opacity: isDisabled ? 0.5 : "inherit",
        outline: "none",
        transition: "none",
        "&:hover": {
          boxShadow: "inset 0 0 0 1px ".concat(getSchemeColor(scheme, "inputHoveredBorder"))
        }
      };
    },
    input: styles => ({
      ...styles,
      color: "var(--card-fg-color)",
      fontFamily: studioTheme.fonts.text.family,
      fontSize: themeTextSizes[1].fontSize,
      marginLeft: rem(themeSpace$1[2])
    }),
    menuList: styles => ({
      ...styles,
      padding: 0
    }),
    noOptionsMessage: styles => ({
      ...styles,
      fontFamily: studioTheme.fonts.text.family,
      fontSize: themeTextSizes[1].fontSize,
      lineHeight: "1em"
    }),
    option: (styles, _ref65) => {
      let {
        isFocused
      } = _ref65;
      return {
        ...styles,
        backgroundColor: isFocused ? getSchemeColor(scheme, "spotBlue") : "transparent",
        borderRadius: themeRadius$1[2],
        color: isFocused ? getSchemeColor(scheme, "bg") : "inherit",
        fontSize: themeTextSizes[1].fontSize,
        lineHeight: "1em",
        margin: 0,
        padding: rem(themeSpace$1[1]),
        "&:hover": {
          backgroundColor: getSchemeColor(scheme, "spotBlue"),
          color: getSchemeColor(scheme, "bg")
        }
      };
    },
    placeholder: styles => ({
      ...styles,
      fontSize: themeTextSizes[1].fontSize,
      marginLeft: rem(themeSpace$1[2]),
      paddingLeft: 0
    }),
    singleValue: styles => ({
      ...styles,
      alignItems: "center",
      display: "inline-flex",
      height: "100%",
      marginLeft: rem(themeSpace$1[2])
    }),
    valueContainer: styles => ({
      ...styles,
      margin: 0,
      padding: 0
    })
  };
};
const ClearIndicator = props => {
  return /* @__PURE__ */jsx(components.ClearIndicator, {
    ...props,
    children: /* @__PURE__ */jsx(Box, {
      paddingRight: 1,
      style: {
        transform: "scale(0.85)"
      },
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 0,
        children: /* @__PURE__ */jsx(CloseIcon, {})
      })
    })
  });
};
const Menu$1 = props => {
  return /* @__PURE__ */jsx(components.Menu, {
    ...props,
    children: /* @__PURE__ */jsx(Card, {
      radius: 1,
      shadow: 2,
      children: props.children
    })
  });
};
const MenuList$1 = props => {
  const {
    children
  } = props;
  const MAX_ROWS = 5;
  const OPTION_HEIGHT = 33;
  if (Array.isArray(children)) {
    const height = children.length > MAX_ROWS ? OPTION_HEIGHT * MAX_ROWS : children.length * OPTION_HEIGHT;
    return /* @__PURE__ */jsx(Virtuoso, {
      className: "media__custom-scrollbar",
      itemContent: index => {
        const item = children[index];
        return /* @__PURE__ */jsx(Option$1, {
          ...item.props
        });
      },
      style: {
        height
      },
      totalCount: children.length
    });
  }
  return /* @__PURE__ */jsx(components.MenuList, {
    ...props,
    children
  });
};
const NoOptionsMessage = props => {
  return /* @__PURE__ */jsx(components.NoOptionsMessage, {
    ...props,
    children: props.children
  });
};
const Option$1 = props => {
  return /* @__PURE__ */jsx(Box, {
    padding: 1,
    children: /* @__PURE__ */jsx(components.Option, {
      ...props,
      children: /* @__PURE__ */jsx(Box, {
        paddingY: 1,
        children: /* @__PURE__ */jsx(Text, {
          size: 1,
          style: {
            color: "inherit"
          },
          textOverflow: "ellipsis",
          children: props.children
        })
      })
    })
  });
};
const SingleValue = props => {
  return /* @__PURE__ */jsx(components.SingleValue, {
    ...props,
    children: /* @__PURE__ */jsx(Text, {
      size: 1,
      textOverflow: "ellipsis",
      children: props.children
    })
  });
};
const reactSelectComponents$1 = {
  ClearIndicator,
  DropdownIndicator: null,
  IndicatorSeparator: null,
  Menu: Menu$1,
  MenuList: MenuList$1,
  NoOptionsMessage,
  Option: Option$1,
  SingleValue
};
const SearchFacetTags = _ref66 => {
  let {
    facet
  } = _ref66;
  const {
    scheme
  } = useColorScheme();
  const dispatch = useDispatch();
  const tags = useTypedSelector(state => selectTags(state));
  const tagsFetching = useTypedSelector(state => state.tags.fetching);
  const allTagOptions = getTagSelectOptions(tags);
  const popoverProps = usePortalPopoverProps();
  const handleChange = option => {
    dispatch(searchActions.facetsUpdateById({
      id: facet.id,
      value: option
    }));
  };
  const handleOperatorItemClick = operatorType => {
    dispatch(searchActions.facetsUpdateById({
      id: facet.id,
      operatorType
    }));
  };
  const selectedOperatorType = facet.operatorType;
  return /* @__PURE__ */jsxs(SearchFacet, {
    facet,
    children: [(facet == null ? void 0 : facet.operatorTypes) && /* @__PURE__ */jsx(MenuButton, {
      button: /* @__PURE__ */jsx(Button, {
        fontSize: 1,
        iconRight: SelectIcon,
        padding: 2,
        text: operators[selectedOperatorType].label
      }),
      id: "operators",
      menu: /* @__PURE__ */jsx(Menu$2, {
        children: facet.operatorTypes.map((operatorType, index) => {
          if (operatorType) {
            const selected = operatorType === selectedOperatorType;
            return /* @__PURE__ */jsx(MenuItem, {
              disabled: selected,
              fontSize: 1,
              onClick: () => handleOperatorItemClick(operatorType),
              padding: 2,
              space: 4,
              style: {
                minWidth: "150px"
              },
              text: operators[operatorType].label
            }, operatorType);
          }
          return /* @__PURE__ */jsx(MenuDivider, {}, index);
        })
      }),
      popover: popoverProps
    }), !operators[selectedOperatorType].hideInput && /* @__PURE__ */jsx(Box, {
      marginX: 1,
      style: {
        width: "160px"
      },
      children: /* @__PURE__ */jsx(Select, {
        components: reactSelectComponents$1,
        instanceId: "facet-searchable",
        isClearable: true,
        isDisabled: tagsFetching,
        isSearchable: true,
        name: "tags",
        noOptionsMessage: () => "No tags",
        onChange: value => handleChange(value),
        options: allTagOptions,
        placeholder: tagsFetching ? "Loading..." : "Select...",
        styles: reactSelectStyles$1(scheme),
        value: facet == null ? void 0 : facet.value
      })
    })]
  });
};
var __freeze$h = Object.freeze;
var __defProp$i = Object.defineProperty;
var __template$h = (cooked, raw) => __freeze$h(__defProp$i(cooked, "raw", {
  value: __freeze$h(raw || cooked.slice())
}));
var _a$h;
const StackContainer = styled(Flex)(_ref67 => {
  let {
    theme
  } = _ref67;
  return css(_a$h || (_a$h = __template$h(["\n    > * {\n      margin-bottom: ", ";\n    }\n  "])), rem(theme.sanity.space[2]));
});
const SearchFacets = props => {
  const {
    layout = "inline"
  } = props;
  const searchFacets = useTypedSelector(state => state.search.facets);
  const Items = searchFacets.map(facet => {
    const key = facet.id;
    if (facet.type === "number") {
      return /* @__PURE__ */jsx(SearchFacetNumber, {
        facet
      }, key);
    }
    if (facet.type === "searchable") {
      return /* @__PURE__ */jsx(SearchFacetTags, {
        facet
      }, key);
    }
    if (facet.type === "select") {
      return /* @__PURE__ */jsx(SearchFacetSelect, {
        facet
      }, key);
    }
    if (facet.type === "string") {
      return /* @__PURE__ */jsx(SearchFacetString, {
        facet
      }, key);
    }
    return null;
  });
  if (layout === "inline") {
    if (searchFacets.length === 0) {
      return null;
    }
    return /* @__PURE__ */jsx(Box, {
      marginBottom: 2,
      children: /* @__PURE__ */jsx(Inline, {
        space: 2,
        children: Items
      })
    });
  }
  if (layout === "stack") {
    return /* @__PURE__ */jsx(StackContainer, {
      align: "flex-start",
      direction: "column",
      children: Items
    });
  }
  throw Error("Invalid layout");
};
const SearchFacetsControl = () => {
  const dispatch = useDispatch();
  const assetTypes = useTypedSelector(state => state.assets.assetTypes);
  const searchFacets = useTypedSelector(state => state.search.facets);
  const selectedDocument = useTypedSelector(state => state.selected.document);
  const popoverProps = usePortalPopoverProps();
  const isTool = !selectedDocument;
  const filteredFacets = FACETS.filter(facet => {
    if (facet.type === "group" || facet.type === "divider") {
      return true;
    }
    if (isTool) {
      return !(facet == null ? void 0 : facet.selectOnly);
    }
    const matchingAssetTypes = facet.assetTypes.filter(assetType => assetTypes.includes(assetType));
    return matchingAssetTypes.length > 0;
  }).filter((facet, index, facets) => {
    const previousFacet = facets[index - 1];
    if (facet.type === "divider" && (index === 0 || index === facets.length - 1)) {
      return false;
    }
    if (facet.type === "divider" && (previousFacet == null ? void 0 : previousFacet.type) === "divider") {
      return false;
    }
    return true;
  });
  const hasSearchFacets = filteredFacets.length > 0;
  const renderMenuFacets = function (facets) {
    let level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return /* @__PURE__ */jsx(Fragment, {
      children: facets == null ? void 0 : facets.map((facet, index) => {
        if (facet.type === "divider") {
          return /* @__PURE__ */jsx(MenuDivider, {}, index);
        }
        if (facet.type === "group") {
          return /* @__PURE__ */jsx(MenuGroup, {
            text: facet.title,
            title: facet.title,
            children: renderMenuFacets(facet.facets, level + 1)
          }, "group-".concat(level, "-").concat(index));
        }
        if (facet) {
          const disabled = !facet.operatorTypes && !!searchFacets.find(v => v.name === facet.name);
          return /* @__PURE__ */jsx(MenuItem, {
            disabled,
            fontSize: 1,
            onClick: () => dispatch(searchActions.facetsAdd({
              facet
            })),
            padding: 2,
            text: facet.title
          }, facet.name);
        }
        return null;
      })
    });
  };
  return /* @__PURE__ */jsxs(Flex, {
    children: [/* @__PURE__ */jsx(MenuButton, {
      button: /* @__PURE__ */jsx(Button, {
        disabled: !hasSearchFacets,
        fontSize: 1,
        icon: AddIcon,
        mode: "bleed",
        space: 2,
        text: "Add filter",
        tone: "primary"
      }),
      id: "facets",
      menu: /* @__PURE__ */jsx(Menu$2, {
        children: renderMenuFacets(filteredFacets)
      }),
      popover: {
        ...popoverProps,
        placement: "right-start"
      }
    }), searchFacets.length > 0 && /* @__PURE__ */jsx(Button, {
      fontSize: 1,
      mode: "bleed",
      onClick: () => dispatch(searchActions.facetsClear()),
      text: "Clear"
    })]
  });
};
const TagIcon = () => /* @__PURE__ */jsxs("svg", {
  "data-sanity-icon": "media__tag",
  fill: "currentColor",
  height: "1em",
  stroke: "currentColor",
  strokeWidth: "0",
  viewBox: "0 0 512 512",
  width: "1em",
  children: [/* @__PURE__ */jsx("path", {
    d: "M435.25 48h-122.9a14.46 14.46 0 00-10.2 4.2L56.45 297.9a28.85 28.85 0 000 40.7l117 117a28.85 28.85 0 0040.7 0L459.75 210a14.46 14.46 0 004.2-10.2v-123a28.66 28.66 0 00-28.7-28.8z",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32"
  }), /* @__PURE__ */jsx("path", {
    d: "M384 160a32 32 0 1132-32 32 32 0 01-32 32z"
  })]
});
const TextInputSearch = () => {
  const searchQuery = useTypedSelector(state => state.search.query);
  const dispatch = useDispatch();
  const handleChange = e => {
    dispatch(searchActions.querySet({
      searchQuery: e.currentTarget.value
    }));
  };
  const handleClear = () => {
    dispatch(searchActions.querySet({
      searchQuery: ""
    }));
  };
  return /* @__PURE__ */jsxs(Box, {
    style: {
      position: "relative"
    },
    children: [/* @__PURE__ */jsx(TextInput, {
      fontSize: 1,
      icon: SearchIcon,
      onChange: handleChange,
      placeholder: "Search",
      radius: 2,
      value: searchQuery
    }), searchQuery.length > 0 && /* @__PURE__ */jsx(Flex, {
      align: "center",
      justify: "center",
      onClick: handleClear,
      style: {
        cursor: "pointer",
        height: "100%",
        opacity: 0.75,
        position: "absolute",
        right: 0,
        top: 0,
        width: "2em",
        zIndex: 1
        // force stacking context
      },

      children: /* @__PURE__ */jsx(CloseIcon, {})
    })]
  });
};
const Controls = () => {
  const dispatch = useDispatch();
  const fetching = useTypedSelector(state => state.assets.fetching);
  const pageIndex = useTypedSelector(state => state.assets.pageIndex);
  const searchFacets = useTypedSelector(state => state.search.facets);
  const seasonsPanelVisible = useTypedSelector(state => state.seasons.panelVisible);
  const collaborationsPanelVisible = useTypedSelector(state => state.collaborations.panelVisible);
  const mediaIndex = useMediaIndex();
  const handleShowSearchFacetDialog = () => {
    dispatch(dialogActions.showSearchFacets());
  };
  const handleShowSeasonsDialog = () => {
    dispatch(dialogActions.showSeasons());
  };
  const toggleTagsPanelToggle = () => {
    dispatch(seasonActions.panelVisibleSet({
      panelVisible: !seasonsPanelVisible
    }));
  };
  const toggleCollabsPanelToggle = () => {
    dispatch(collaborationActions.panelVisibleSet({
      panelVisible: !collaborationsPanelVisible
    }));
  };
  return /* @__PURE__ */jsxs(Box, {
    paddingY: 2,
    style: {
      borderBottom: "1px solid var(--card-border-color)",
      zIndex: 2
    },
    children: [/* @__PURE__ */jsx(Box, {
      marginBottom: 2,
      children: /* @__PURE__ */jsx(Flex, {
        align: "flex-start",
        direction: ["column", "column", "column", "column", "row"],
        justify: "space-between",
        children: /* @__PURE__ */jsxs(Flex, {
          flex: 1,
          style: {
            alignItems: "flex-start",
            flex: 1,
            height: "100%",
            justifyContent: mediaIndex < 2 ? "space-between" : "flex-start",
            position: "relative",
            width: "100%"
          },
          children: [/* @__PURE__ */jsx(Box, {
            marginX: 2,
            style: {
              minWidth: "200px"
            },
            children: /* @__PURE__ */jsx(TextInputSearch, {})
          }), /* @__PURE__ */jsxs(Box, {
            display: ["none", "none", "block"],
            children: [/* @__PURE__ */jsx(SearchFacets, {}), /* @__PURE__ */jsx(SearchFacetsControl, {})]
          }), /* @__PURE__ */jsx(Box, {
            display: ["block", "block", "none"],
            marginX: 2,
            children: /* @__PURE__ */jsxs(Inline, {
              space: 2,
              style: {
                whiteSpace: "nowrap"
              },
              children: [/* @__PURE__ */jsx(Button, {
                fontSize: 1,
                mode: "ghost",
                onClick: handleShowSearchFacetDialog,
                text: "Filters".concat(searchFacets.length > 0 ? " (".concat(searchFacets.length, ")") : ""),
                tone: "primary"
              }), /* @__PURE__ */jsx(Button, {
                fontSize: 1,
                mode: "ghost",
                onClick: handleShowSeasonsDialog,
                text: "Seasons",
                tone: "primary"
              })]
            })
          })]
        })
      })
    }), /* @__PURE__ */jsx(Box, {
      children: /* @__PURE__ */jsxs(Flex, {
        align: "center",
        justify: ["space-between"],
        children: [/* @__PURE__ */jsx(Box, {
          marginX: 2,
          children: /* @__PURE__ */jsx(ButtonViewGroup, {})
        }), /* @__PURE__ */jsxs(Flex, {
          marginX: 2,
          children: [/* @__PURE__ */jsx(OrderSelect, {}), /* @__PURE__ */jsx(Box, {
            display: ["none", "none", "block"],
            marginLeft: 2,
            children: /* @__PURE__ */jsx(Button, {
              fontSize: 1,
              icon: /* @__PURE__ */jsx(Box, {
                style: {
                  transform: "scale(0.75)"
                },
                children: /* @__PURE__ */jsx(TagIcon, {})
              }),
              onClick: toggleTagsPanelToggle,
              mode: seasonsPanelVisible ? "default" : "ghost",
              text: "Seasons"
            })
          }), /* @__PURE__ */jsx(Box, {
            display: ["none", "none", "block"],
            marginLeft: 2,
            children: /* @__PURE__ */jsx(Button, {
              fontSize: 1,
              icon: /* @__PURE__ */jsx(Box, {
                style: {
                  transform: "scale(0.75)"
                },
                children: /* @__PURE__ */jsx(TagIcon, {})
              }),
              onClick: toggleCollabsPanelToggle,
              mode: collaborationsPanelVisible ? "default" : "ghost",
              text: "Collaborations"
            })
          })]
        })]
      })
    }), /* @__PURE__ */jsx(Progress, {
      loading: fetching
    }, pageIndex)]
  });
};
const initialState$3 = {
  badConnection: false,
  enabled: false
};
const debugSlice = createSlice({
  name: "debug",
  initialState: initialState$3,
  reducers: {
    setBadConnection(state, action) {
      state.badConnection = action.payload;
    },
    toggleEnabled(state) {
      state.enabled = !state.enabled;
    }
  }
});
const debugActions = debugSlice.actions;
var debugReducer = debugSlice.reducer;
const DebugControls = () => {
  const dispatch = useDispatch();
  const badConnection = useTypedSelector(state => state.debug.badConnection);
  const debugEnabled = useTypedSelector(state => state.debug.enabled);
  const handleChange = e => {
    const checked = e.target.checked;
    dispatch(debugActions.setBadConnection(checked));
  };
  const handleToggleControls = () => {
    dispatch(debugActions.toggleEnabled());
  };
  useKeyPress("alt+ctrl+shift+/", handleToggleControls);
  if (!debugEnabled) {
    return null;
  }
  return /* @__PURE__ */jsx(Box, {
    padding: 4,
    style: {
      bottom: 0,
      left: 0,
      pointerEvents: "none",
      position: "fixed",
      width: "100%"
    },
    children: /* @__PURE__ */jsxs(Flex, {
      align: "center",
      children: [/* @__PURE__ */jsx(Box, {
        marginRight: 3,
        children: /* @__PURE__ */jsx(Text, {
          muted: true,
          size: 1,
          children: /* @__PURE__ */jsx(PlugIcon, {})
        })
      }), /* @__PURE__ */jsx(Tooltip, {
        content: /* @__PURE__ */jsx(Box, {
          padding: 2,
          children: /* @__PURE__ */jsx(Text, {
            muted: true,
            size: 1,
            children: badConnection ? "Bad connection: +3000ms & 50% chance to fail" : "No connection throttling"
          })
        }),
        fallbackPlacements: ["right", "left"],
        placement: "bottom",
        portal: true,
        children: /* @__PURE__ */jsx(Switch, {
          checked: badConnection,
          onChange: handleChange,
          style: {
            pointerEvents: "auto"
          }
        })
      })]
    })
  });
};
const tagOptionSchema = z.object({
  label: z.string().trim().min(1, {
    message: "Label cannot be empty"
  }),
  value: z.string().trim().min(1, {
    message: "Value cannot be empty"
  })
});
z.object({
  label: z.string().trim().min(1, {
    message: "Label cannot be empty"
  }),
  value: z.string().trim().min(1, {
    message: "Value cannot be empty"
  })
});
const assetFormSchema = z.object({
  name: z.string().trim(),
  season: z.object({
    label: z.string().trim(),
    value: z.string().trim()
  }).nullable(),
  collaboration: z.object({
    label: z.string().trim(),
    value: z.string().trim()
  }).nullable(),
  products: z.array(z.object({
    _key: z.string(),
    id: z.string(),
    imageUrl: z.string(),
    name: z.string(),
    published: z.boolean()
  })).optional(),
  primaryProducts: z.array(z.object({
    _key: z.string(),
    id: z.string(),
    imageUrl: z.string(),
    name: z.string(),
    published: z.boolean()
  })).optional(),
  secondaryProducts: z.array(z.object({
    _key: z.string(),
    id: z.string(),
    imageUrl: z.string(),
    name: z.string(),
    published: z.boolean()
  })).optional(),
  altText: z.string().trim().optional(),
  description: z.string().trim().optional(),
  opt: z.object({
    media: z.object({
      tags: z.array(tagOptionSchema).nullable()
    })
  }),
  title: z.string().trim().optional()
});
const massEditAssetsFormSchema = z.object({
  name: z.string().trim(),
  season: z.object({
    label: z.string().trim().min(1, {
      message: "Label cannot be empty"
    }),
    value: z.string().trim().min(1, {
      message: "Value cannot be empty"
    })
  }).nullable(),
  collaboration: z.object({
    label: z.string().trim().min(1, {
      message: "Label cannot be empty"
    }),
    value: z.string().trim().min(1, {
      message: "Value cannot be empty"
    })
  }).nullable(),
  products: z.array(z.object({
    _key: z.string(),
    id: z.string(),
    imageUrl: z.string(),
    name: z.string(),
    published: z.boolean()
  })).optional(),
  primaryProducts: z.array(z.object({
    _key: z.string(),
    id: z.string(),
    imageUrl: z.string(),
    name: z.string(),
    published: z.boolean()
  })).optional(),
  secondaryProducts: z.array(z.object({
    _key: z.string(),
    id: z.string(),
    imageUrl: z.string(),
    name: z.string(),
    published: z.boolean()
  })).optional(),
  altText: z.string().trim().optional(),
  description: z.string().trim().optional(),
  opt: z.object({
    media: z.object({
      tags: z.array(tagOptionSchema).nullable()
    })
  }),
  title: z.string().trim().optional()
});
const tagFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name cannot be empty"
  })
});
z.object({
  name: z.string().min(1, {
    message: "Name cannot be empty"
  })
});
z.object({
  name: z.string().min(1, {
    message: "Name cannot be empty"
  })
});
function getUniqueDocuments(documents) {
  const draftIds = documents.reduce((acc, doc) => doc._id.startsWith("drafts.") ? acc.concat(doc._id.slice(7)) : acc, []);
  const filteredDocuments = documents.filter(doc => !draftIds.includes(doc._id));
  return filteredDocuments;
}
const imageDprUrl = (asset, options) => {
  const dpi = typeof window === "undefined" || !window.devicePixelRatio ? 1 : Math.round(window.devicePixelRatio);
  const imgH = (options == null ? void 0 : options.height) ? (options == null ? void 0 : options.height) * Math.max(1, dpi) : void 0;
  const imgW = options.width * Math.max(1, dpi);
  const urlParams = new URLSearchParams();
  urlParams.append("fit", "max");
  urlParams.append("w", imgW.toString());
  if (imgH) {
    urlParams.append("h", imgH.toString());
  }
  return "".concat(asset.url, "?").concat(urlParams.toString());
};
const sanitizeFormData = formData => {
  return Object.keys(formData).reduce((acc, key) => {
    const val = formData[key];
    if (typeof val === "object" && val !== null && val.constructor !== Array) {
      acc[key] = sanitizeFormData(val);
    } else if (val === "" || typeof val === "undefined" || (val == null ? void 0 : val.length) === 0) {
      acc[key] = null;
    } else if (typeof val === "string" && val) {
      acc[key] = formData[key].trim();
    } else {
      acc[key] = formData[key];
    }
    return acc;
  }, {});
};
const isFileAsset = asset => {
  return asset._type === "sanity.fileAsset";
};
const isImageAsset = asset => {
  return asset._type === "sanity.imageAsset";
};
const getAssetResolution = asset => {
  return "".concat(asset.metadata.dimensions.width, "x").concat(asset.metadata.dimensions.height, "px");
};
const ButtonAssetCopy = _ref68 => {
  let {
    disabled,
    url
  } = _ref68;
  const popoverProps = usePortalPopoverProps();
  const refPopoverTimeout = useRef();
  const [popoverVisible, setPopoverVisible] = useState(false);
  const handleClick = () => {
    if (refPopoverTimeout.current) {
      clearTimeout(refPopoverTimeout.current);
    }
    setPopoverVisible(true);
    copy(url);
    refPopoverTimeout.current = setTimeout(() => {
      setPopoverVisible(false);
    }, 1250);
  };
  useEffect(() => {
    return () => {
      if (refPopoverTimeout.current) {
        clearTimeout(refPopoverTimeout.current);
      }
    };
  }, []);
  return /* @__PURE__ */jsx(Popover, {
    content: /* @__PURE__ */jsx(Text, {
      muted: true,
      size: 1,
      children: "Copied!"
    }),
    open: popoverVisible,
    padding: 2,
    placement: "top",
    radius: 1,
    ...popoverProps,
    children: /* @__PURE__ */jsx(Button, {
      disabled,
      fontSize: 1,
      icon: ClipboardIcon,
      mode: "ghost",
      onClick: handleClick,
      text: "Copy URL"
    })
  });
};
const Row = _ref69 => {
  let {
    label,
    value
  } = _ref69;
  return /* @__PURE__ */jsxs(Flex, {
    justify: "space-between",
    children: [/* @__PURE__ */jsx(Text, {
      size: 1,
      style: {
        opacity: 0.8,
        width: "40%"
      },
      textOverflow: "ellipsis",
      children: label
    }), /* @__PURE__ */jsx(Text, {
      size: 1,
      style: {
        opacity: 0.4,
        textAlign: "right",
        width: "60%"
      },
      textOverflow: "ellipsis",
      children: value
    })]
  });
};
const AssetMetadata = props => {
  var _a;
  const {
    asset,
    item
  } = props;
  const exif = (_a = asset == null ? void 0 : asset.metadata) == null ? void 0 : _a.exif;
  const handleDownload = () => {
    window.location.href = "".concat(asset.url, "?dl=").concat(asset.originalFilename);
  };
  return /* @__PURE__ */jsxs(Box, {
    marginTop: 3,
    children: [/* @__PURE__ */jsx(Box, {
      children: /* @__PURE__ */jsxs(Stack, {
        space: 3,
        children: [/* @__PURE__ */jsx(Row, {
          label: "Size",
          value: filesize(asset == null ? void 0 : asset.size, {
            base: 10,
            round: 0
          })
        }), /* @__PURE__ */jsx(Row, {
          label: "MIME type",
          value: asset == null ? void 0 : asset.mimeType
        }), /* @__PURE__ */jsx(Row, {
          label: "Extension",
          value: (asset == null ? void 0 : asset.extension).toUpperCase()
        }), isImageAsset(asset) && /* @__PURE__ */jsx(Row, {
          label: "Dimensions",
          value: getAssetResolution(asset)
        })]
      })
    }), exif && (exif.DateTimeOriginal || exif.FNumber || exif.FocalLength || exif.ExposureTime || exif.ISO) && /* @__PURE__ */jsxs(Fragment, {
      children: [/* @__PURE__ */jsx(Box, {
        marginY: 4,
        style: {
          background: "var(--card-border-color)",
          height: "1px",
          width: "100%"
        }
      }), /* @__PURE__ */jsx(Box, {
        children: /* @__PURE__ */jsxs(Stack, {
          space: 3,
          children: [exif.ISO && /* @__PURE__ */jsx(Row, {
            label: "ISO",
            value: exif.ISO
          }), exif.FNumber && /* @__PURE__ */jsx(Row, {
            label: "Aperture",
            value: "\u0192/".concat(exif.FNumber)
          }), exif.FocalLength && /* @__PURE__ */jsx(Row, {
            label: "Focal length",
            value: "".concat(exif.FocalLength, "mm")
          }), exif.ExposureTime && /* @__PURE__ */jsx(Row, {
            label: "Exposure time",
            value: "1/".concat(1 / exif.ExposureTime)
          }), exif.DateTimeOriginal && /* @__PURE__ */jsx(Row, {
            label: "Original date",
            value: format(new Date(exif.DateTimeOriginal), "PPp")
          })]
        })
      })]
    }), /* @__PURE__ */jsx(Box, {
      marginTop: 5,
      children: /* @__PURE__ */jsxs(Inline, {
        space: 2,
        children: [/* @__PURE__ */jsx(Button, {
          disabled: !item || (item == null ? void 0 : item.updating),
          fontSize: 1,
          icon: DownloadIcon,
          mode: "ghost",
          onClick: handleDownload,
          text: "Download"
        }), /* @__PURE__ */jsx(ButtonAssetCopy, {
          disabled: !item || (item == null ? void 0 : item.updating),
          url: asset.url
        })]
      })
    })]
  });
};
const Dialog = props => {
  return /* @__PURE__ */jsx(Dialog$1, {
    ...props,
    style: {
      position: "fixed"
    }
  });
};
const DocumentList = _ref70 => {
  let {
    documents,
    isLoading
  } = _ref70;
  const schema = useSchema();
  if (isLoading) {
    return /* @__PURE__ */jsx(Text, {
      muted: true,
      size: 1,
      children: "Loading..."
    });
  }
  if (documents.length === 0) {
    return /* @__PURE__ */jsx(Text, {
      muted: true,
      size: 1,
      children: "No documents are referencing this asset"
    });
  }
  return /* @__PURE__ */jsx(Card, {
    flex: 1,
    marginBottom: 2,
    padding: 2,
    radius: 2,
    shadow: 1,
    children: /* @__PURE__ */jsx(Stack, {
      space: 2,
      children: documents == null ? void 0 : documents.map(doc => /* @__PURE__ */jsx(ReferringDocument, {
        doc,
        schemaType: schema.get(doc._type)
      }, doc._id))
    })
  });
};
const ReferringDocument = props => {
  const {
    doc,
    schemaType
  } = props;
  const {
    onClick
  } = useIntentLink({
    intent: "edit",
    params: {
      id: doc._id
    }
  });
  return schemaType ? /* @__PURE__ */jsx(Button, {
    mode: "bleed",
    onClick,
    padding: 2,
    style: {
      width: "100%"
    },
    children: /* @__PURE__ */jsx(Preview, {
      layout: "default",
      schemaType,
      value: doc
    })
  }, doc._id) : /* @__PURE__ */jsx(Box, {
    padding: 2,
    children: /* @__PURE__ */jsxs(Text, {
      size: 1,
      children: ["A document of the unknown type ", /* @__PURE__ */jsx("em", {
        children: doc._type
      })]
    })
  });
};
var __freeze$g = Object.freeze;
var __defProp$h = Object.defineProperty;
var __template$g = (cooked, raw) => __freeze$g(__defProp$h(cooked, "raw", {
  value: __freeze$g(raw || cooked.slice())
}));
var _a$g;
const Container = styled(Box)(_ref71 => {
  let {
    theme
  } = _ref71;
  var _a2, _b, _c;
  return css(_a$g || (_a$g = __template$g(["\n    text {\n      font-family: ", " !important;\n      font-size: 8px !important;\n      font-weight: 500 !important;\n    }\n  "])), (_c = (_b = (_a2 = theme == null ? void 0 : theme.sanity) == null ? void 0 : _a2.fonts) == null ? void 0 : _b.text) == null ? void 0 : _c.family);
});
const FileIcon = props => {
  const {
    extension,
    onClick,
    width
  } = props;
  return /* @__PURE__ */jsx(Flex, {
    align: "center",
    justify: "center",
    onClick,
    style: {
      height: "100%"
    },
    children: /* @__PURE__ */jsx(Container, {
      style: {
        width
      },
      children: extension ? /* @__PURE__ */jsx(FileIcon$1, {
        extension,
        ...defaultStyles[extension]
      }) : /* @__PURE__ */jsx(FileIcon$1, {})
    })
  });
};
const FileAssetPreview = props => {
  const {
    asset
  } = props;
  if (asset.mimeType.search("audio") === 0) {
    return /* @__PURE__ */jsx(Flex, {
      align: "center",
      justify: "center",
      style: {
        height: "100%"
      },
      children: /* @__PURE__ */jsx("audio", {
        controls: true,
        src: asset.url,
        style: {
          width: "100%"
        }
      })
    });
  }
  if (asset.mimeType.search("video") === 0) {
    return /* @__PURE__ */jsx("video", {
      controls: true,
      src: asset.url,
      style: {
        height: "100%",
        width: "100%"
      }
    });
  }
  return /* @__PURE__ */jsx(FileIcon, {
    extension: asset.extension,
    width: "50%"
  });
};
const {
  radius: themeRadius,
  space: themeSpace
} = studioTheme;
const reactSelectStyles = scheme => {
  return {
    control: (styles, _ref72) => {
      let {
        isFocused
      } = _ref72;
      let boxShadow = "inset 0 0 0 1px var(--card-border-color)";
      if (isFocused) {
        boxShadow = "inset 0 0 0 1px ".concat(getSchemeColor(scheme, "inputEnabledBorder"), ",\n        0 0 0 1px var(--card-bg-color),\n        0 0 0 3px var(--card-focus-ring-color) !important");
      }
      return {
        ...styles,
        backgroundColor: "var(--card-bg-color)",
        color: "inherit",
        border: "none",
        borderRadius: themeRadius[1],
        boxShadow,
        margin: 0,
        minHeight: "35px",
        outline: "none",
        padding: rem(themeSpace[1]),
        transition: "none",
        "&:hover": {
          boxShadow: "inset 0 0 0 1px ".concat(getSchemeColor(scheme, "inputHoveredBorder"))
        }
      };
    },
    indicatorsContainer: (styles, _ref73) => {
      let {
        isDisabled
      } = _ref73;
      return {
        ...styles,
        opacity: isDisabled ? 0.25 : 1
      };
    },
    input: styles => ({
      ...styles,
      color: "var(--card-fg-color)",
      fontFamily: studioTheme.fonts.text.family,
      marginLeft: rem(themeSpace[2])
    }),
    menuList: styles => ({
      ...styles,
      position: "relative"
    }),
    multiValue: (styles, _ref74) => {
      let {
        isDisabled
      } = _ref74;
      return {
        ...styles,
        backgroundColor: getSchemeColor(scheme, "mutedHoveredBg"),
        borderRadius: themeRadius[2],
        opacity: isDisabled ? 0.5 : 1
      };
    },
    singleValue: styles => ({
      ...styles,
      color: getSchemeColor(scheme, "text")
    }),
    multiValueLabel: () => ({
      color: getSchemeColor(scheme, "mutedHoveredFg"),
      fontSize: "inherit",
      padding: 0
    }),
    multiValueRemove: styles => ({
      ...styles,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      svg: {
        color: getSchemeColor(scheme, "mutedHoveredFg")
      },
      "&:hover": {
        backgroundColor: getSchemeColor(scheme, "mutedSelectedBg")
      }
    }),
    noOptionsMessage: styles => ({
      ...styles,
      fontFamily: studioTheme.fonts.text.family,
      lineHeight: "1em"
    }),
    option: (styles, _ref75) => {
      let {
        isFocused
      } = _ref75;
      return {
        ...styles,
        zIndex: 13,
        backgroundColor: isFocused ? getSchemeColor(scheme, "spotBlue") : "transparent",
        borderRadius: themeRadius[2],
        color: isFocused ? getSchemeColor(scheme, "bg") : "inherit",
        padding: "".concat(rem(themeSpace[1]), " ").concat(rem(themeSpace[2])),
        "&:hover": {
          backgroundColor: getSchemeColor(scheme, "spotBlue"),
          color: getSchemeColor(scheme, "bg")
        }
      };
    },
    placeholder: styles => ({
      ...styles,
      marginLeft: rem(themeSpace[2])
    }),
    valueContainer: styles => ({
      ...styles,
      margin: 0,
      padding: 0
    })
  };
};
const DropdownIndicator = props => {
  return /* @__PURE__ */jsx(components.DropdownIndicator, {
    ...props,
    children: /* @__PURE__ */jsx(Box, {
      paddingX: 2,
      children: /* @__PURE__ */jsx(Text, {
        size: 1,
        children: /* @__PURE__ */jsx(ChevronDownIcon, {})
      })
    })
  });
};
const Menu = props => {
  return /* @__PURE__ */jsx(components.Menu, {
    ...props,
    children: /* @__PURE__ */jsx(Card, {
      radius: 1,
      shadow: 2,
      children: props.children
    })
  });
};
const MenuList = props => {
  const {
    children
  } = props;
  const MAX_ROWS = 5;
  const OPTION_HEIGHT = 37;
  if (Array.isArray(children)) {
    const height = children.length > MAX_ROWS ? OPTION_HEIGHT * MAX_ROWS : children.length * OPTION_HEIGHT;
    return /* @__PURE__ */jsx(Virtuoso, {
      className: "media__custom-scrollbar",
      itemContent: index => {
        const item = children[index];
        return /* @__PURE__ */jsx(Option, {
          ...item.props
        });
      },
      style: {
        height
      },
      totalCount: children.length
    });
  }
  return /* @__PURE__ */jsx(components.MenuList, {
    ...props,
    children
  });
};
const MultiValueLabel = props => {
  return /* @__PURE__ */jsx(Box, {
    padding: 2,
    paddingRight: 1,
    children: /* @__PURE__ */jsx(Text, {
      size: 1,
      weight: "medium",
      children: /* @__PURE__ */jsx(components.MultiValueLabel, {
        ...props
      })
    })
  });
};
const MultiValueRemove = props => {
  return /* @__PURE__ */jsx(components.MultiValueRemove, {
    ...props,
    children: /* @__PURE__ */jsx(CloseIcon, {
      color: "#1f2123"
    })
  });
};
const Option = props => {
  return /* @__PURE__ */jsx(Box, {
    paddingX: 1,
    paddingY: 1,
    children: /* @__PURE__ */jsx(components.Option, {
      ...props,
      children: /* @__PURE__ */jsxs(Flex, {
        align: "center",
        children: [props.data.__isNew__ && /* @__PURE__ */jsx(AddIcon, {
          style: {
            marginRight: "3px"
          }
        }), props.children]
      })
    })
  });
};
const reactSelectComponents = {
  DropdownIndicator,
  IndicatorSeparator: null,
  Menu,
  MenuList,
  MultiValueLabel,
  MultiValueRemove,
  Option
};
const StyledErrorOutlineIcon = styled(ErrorOutlineIcon)(_ref76 => {
  let {
    theme
  } = _ref76;
  var _a, _b, _c, _d;
  return {
    color: (_d = (_c = (_b = (_a = theme == null ? void 0 : theme.sanity) == null ? void 0 : _a.color) == null ? void 0 : _b.spot) == null ? void 0 : _c.red) != null ? _d : "red"
  };
});
const FormFieldInputLabel = props => {
  const {
    description,
    error,
    label,
    name
  } = props;
  return /* @__PURE__ */jsxs(Fragment, {
    children: [/* @__PURE__ */jsx(Box, {
      marginY: 3,
      children: /* @__PURE__ */jsxs(Inline, {
        space: 2,
        children: [/* @__PURE__ */jsx(Text, {
          as: "label",
          htmlFor: name,
          size: 1,
          weight: "semibold",
          children: label
        }), error && /* @__PURE__ */jsx(Text, {
          size: 1,
          children: /* @__PURE__ */jsx(Tooltip, {
            content: /* @__PURE__ */jsx(Box, {
              padding: 2,
              children: /* @__PURE__ */jsxs(Text, {
                muted: true,
                size: 1,
                children: [/* @__PURE__ */jsx(StyledErrorOutlineIcon, {
                  style: {
                    marginRight: "0.1em"
                  }
                }), error]
              })
            }),
            fallbackPlacements: ["top", "left"],
            placement: "right",
            portal: true,
            children: /* @__PURE__ */jsx(StyledErrorOutlineIcon, {})
          })
        })]
      })
    }), description && /* @__PURE__ */jsx(Box, {
      marginY: 3,
      children: /* @__PURE__ */jsx(Text, {
        htmlFor: name,
        muted: true,
        size: 1,
        children: description
      })
    })]
  });
};
const FormFieldInputTags = props => {
  const {
    control,
    description,
    disabled,
    error,
    label,
    name,
    onCreateTag,
    options,
    placeholder,
    value
  } = props;
  const {
    scheme
  } = useColorScheme();
  const creating = useTypedSelector(state => state.tags.creating);
  const tagsFetching = useTypedSelector(state => state.tags.fetching);
  return /* @__PURE__ */jsxs(Box, {
    style: {
      zIndex: 32
    },
    children: [/* @__PURE__ */jsx(FormFieldInputLabel, {
      description,
      error,
      label,
      name
    }), /* @__PURE__ */jsx(Controller, {
      control,
      defaultValue: value,
      name,
      render: _ref77 => {
        let {
          field
        } = _ref77;
        const {
          onBlur,
          onChange,
          value: controllerValue
        } = field;
        return /* @__PURE__ */jsx(CreatableSelect, {
          components: reactSelectComponents,
          instanceId: "tags",
          isClearable: false,
          isDisabled: creating || disabled || tagsFetching,
          isLoading: creating,
          isMulti: true,
          name,
          noOptionsMessage: () => "No tags",
          onBlur,
          onChange,
          onCreateOption: onCreateTag,
          options,
          placeholder: tagsFetching ? "Loading..." : placeholder,
          styles: reactSelectStyles(scheme),
          value: controllerValue
        });
      }
    })]
  });
};
const FormFieldInputText = forwardRef((props, ref) => {
  const {
    description,
    disabled,
    error,
    label,
    name,
    placeholder,
    value,
    ...rest
  } = props;
  return /* @__PURE__ */jsxs(Box, {
    children: [/* @__PURE__ */jsx(FormFieldInputLabel, {
      description,
      error,
      label,
      name
    }), /* @__PURE__ */jsx(TextInput, {
      ...rest,
      autoComplete: "off",
      autoFocus: true,
      defaultValue: value,
      disabled,
      id: name,
      name,
      placeholder,
      ref
    })]
  });
});
const FormFieldInputTextarea = forwardRef((props, ref) => {
  const {
    description,
    disabled,
    error,
    label,
    name,
    placeholder,
    rows,
    value,
    ...rest
  } = props;
  return /* @__PURE__ */jsxs(Box, {
    children: [/* @__PURE__ */jsx(FormFieldInputLabel, {
      description,
      error,
      label,
      name
    }), /* @__PURE__ */jsx(TextArea, {
      ...rest,
      autoComplete: "off",
      defaultValue: value,
      disabled,
      id: name,
      name,
      placeholder,
      ref,
      rows
    })]
  });
});
const FormSubmitButton = props => {
  const {
    disabled,
    isValid,
    lastUpdated,
    onClick
  } = props;
  let content;
  if (isValid) {
    if (lastUpdated) {
      content = /* @__PURE__ */jsxs(Fragment, {
        children: ["Last updated", /* @__PURE__ */jsx("br", {}), " ", format(new Date(lastUpdated), "PPp")]
      });
    } else {
      content = "No unpublished changes";
    }
  } else {
    content = "There are validation errors that need to be fixed before this document can be published";
  }
  return /* @__PURE__ */jsx(Tooltip, {
    content: /* @__PURE__ */jsx(Box, {
      padding: 3,
      style: {
        maxWidth: "185px"
      },
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 1,
        children: content
      })
    }),
    disabled: "ontouchstart" in window,
    placement: "top",
    portal: true,
    children: /* @__PURE__ */jsx(Box, {
      children: /* @__PURE__ */jsx(Button, {
        disabled,
        fontSize: 1,
        onClick,
        text: "Save and close",
        tone: "primary"
      })
    })
  });
};
var __freeze$f = Object.freeze;
var __defProp$g = Object.defineProperty;
var __template$f = (cooked, raw) => __freeze$f(__defProp$g(cooked, "raw", {
  value: __freeze$f(raw || cooked.slice())
}));
var _a$f, _b$8;
const Image$1 = styled.img(_b$8 || (_b$8 = __template$f(["\n  --checkerboard-color: ", ";\n\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n\n  ", "\n"])), props => props.scheme ? getSchemeColor(props.scheme, "bg2") : "inherit", props => props.showCheckerboard && css(_a$f || (_a$f = __template$f(["\n      background-image: linear-gradient(45deg, var(--checkerboard-color) 25%, transparent 25%),\n        linear-gradient(-45deg, var(--checkerboard-color) 25%, transparent 25%),\n        linear-gradient(45deg, transparent 75%, var(--checkerboard-color) 75%),\n        linear-gradient(-45deg, transparent 75%, var(--checkerboard-color) 75%);\n      background-size: 20px 20px;\n      background-position: 0 0, 0 10px, 10px -10px, -10px 0;\n    "]))));
const FormFieldInputSeasons = props => {
  const {
    control,
    description,
    disabled,
    error,
    label,
    name,
    onCreateSeason,
    options,
    placeholder,
    value
  } = props;
  const {
    scheme
  } = useColorScheme();
  const creating = useTypedSelector(state => state.seasons.creating);
  const seasonsFetching = useTypedSelector(state => state.seasons.fetching);
  return /* @__PURE__ */jsxs(Box, {
    style: {
      zIndex: 24
    },
    children: [/* @__PURE__ */jsx(FormFieldInputLabel, {
      description,
      error,
      label,
      name
    }), /* @__PURE__ */jsx(Controller, {
      control,
      defaultValue: value,
      name,
      render: _ref78 => {
        let {
          field
        } = _ref78;
        const {
          onBlur,
          onChange,
          value: controllerValue
        } = field;
        return /* @__PURE__ */jsx(CreatableSelect, {
          components: reactSelectComponents,
          instanceId: "seasons",
          isClearable: true,
          isDisabled: creating || disabled || seasonsFetching,
          isLoading: creating,
          isMulti: false,
          name,
          noOptionsMessage: () => "No Seasons",
          onBlur,
          onChange,
          onCreateOption: onCreateSeason,
          options,
          placeholder: seasonsFetching ? "Loading..." : placeholder,
          styles: reactSelectStyles(scheme),
          value: controllerValue
        });
      }
    })]
  });
};
const ProductPreview = props => {
  const {
    value,
    onDelete = () => {}
  } = props;
  const {
    imageUrl,
    name,
    id,
    published
  } = value;
  return /* @__PURE__ */jsxs(Flex, {
    justify: "space-between",
    padding: 1,
    style: {
      opacity: published ? 1 : 0.5
    },
    children: [/* @__PURE__ */jsxs(Flex, {
      children: [/* @__PURE__ */jsx("img", {
        style: {
          width: "60px",
          height: "70px"
        },
        src: "".concat(imageUrl, ".JPEG?h=180&$sanity_product_thumb$"),
        alt: ""
      }), /* @__PURE__ */jsxs(Box, {
        padding: 2,
        children: [/* @__PURE__ */jsx(Box, {
          padding: 2,
          children: /* @__PURE__ */jsx(Text, {
            size: 2,
            children: name
          })
        }), /* @__PURE__ */jsx(Box, {
          padding: 2,
          children: /* @__PURE__ */jsx(Text, {
            size: 2,
            children: id
          })
        })]
      })]
    }), /* @__PURE__ */jsx(Box, {
      padding: 2,
      children: /* @__PURE__ */jsx(Button, {
        fontSize: [2, 2, 3],
        icon: TrashIcon,
        onClick: () => onDelete(value.id),
        padding: [3, 3, 4],
        tone: "critical"
      })
    })]
  });
};
const AutocompleteWithPayload = Autocomplete;
const search = async searchTerm => {
  var _a;
  const baseUrl = (_a = process == null ? void 0 : process.env) == null ? void 0 : _a.SANITY_STUDIO_PROVIDER_BASEURL;
  const urlToUse = baseUrl ? "".concat(baseUrl, "/sanity/products?search=").concat(searchTerm) : "https://sanity-ct-products-provider.fly.dev/sanity/products?search=".concat(searchTerm);
  const response = await fetch(urlToUse);
  return response.json();
};
function ProductSelector(props) {
  const {
    value = [],
    onChange,
    error,
    label,
    labelDescription,
    name
  } = props;
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(searchValue, 700);
  useEffect(() => {
    if (!debouncedValue || debouncedValue.length < 2) {
      return;
    }
    (async () => {
      const searchResults = await search(debouncedValue);
      const {
        data: {
          published,
          unpublished
        }
      } = searchResults;
      setResults([...published, unpublished]);
    })();
  }, [debouncedValue]);
  const handleQueryChange = useCallback(searchString => {
    setSearchValue(searchString || "");
  }, [setSearchValue]);
  const products = useMemo(() => results.map(result => {
    var _a, _b, _c, _d;
    return {
      payload: result,
      value: "".concat((_a = result == null ? void 0 : result.name) == null ? void 0 : _a.en, " ").concat(debouncedValue, " ").concat(((_d = (_c = (_b = result == null ? void 0 : result.masterVariant) == null ? void 0 : _b.attributes) == null ? void 0 : _c.find(attr => (attr == null ? void 0 : attr.name) === "iNumber")) == null ? void 0 : _d.value) || "")
    };
  }), [debouncedValue, results]);
  const onSelect = useCallback(matcher => {
    var _a, _b, _c, _d, _e;
    const product = (_a = products.find(p => p.value === matcher)) == null ? void 0 : _a.payload;
    if (!(value == null ? void 0 : value.find(selectedProduct => selectedProduct.id === (product == null ? void 0 : product.id)))) {
      const images = (_b = product == null ? void 0 : product.masterVariant) == null ? void 0 : _b.images;
      const imageUrl = ((_c = images == null ? void 0 : images.find(image => /STN-01$/.test(image.url))) == null ? void 0 : _c.url) || ((_d = images == null ? void 0 : images.find(image => /ST-01$/.test(image.url))) == null ? void 0 : _d.url) || ((_e = images == null ? void 0 : images[0]) == null ? void 0 : _e.url);
      const productToAdd = {
        id: product == null ? void 0 : product.id,
        imageUrl,
        name: (product == null ? void 0 : product.name.en) || "",
        published: !!(product == null ? void 0 : product.published),
        _key: (product == null ? void 0 : product.key) || ""
      };
      const updatedValue = [...localValue, productToAdd];
      setLocalValue(updatedValue);
      onChange == null ? void 0 : onChange(updatedValue);
      setSearchValue("");
    }
  }, [products, value, localValue, onChange]);
  const handleDelete = useCallback(id => {
    const updatedValue = localValue.filter(product => product.id !== id);
    setLocalValue(updatedValue);
    onChange == null ? void 0 : onChange(updatedValue);
  }, [localValue, onChange]);
  const handleClearAll = useCallback(() => {
    setLocalValue([]);
    onChange == null ? void 0 : onChange([]);
  }, [onChange]);
  return /* @__PURE__ */jsxs(Card, {
    border: true,
    padding: 3,
    children: [/* @__PURE__ */jsx(FormFieldInputLabel, {
      error,
      description: labelDescription,
      label,
      name
    }), /* @__PURE__ */jsx(Card, {
      marginY: 2,
      children: /* @__PURE__ */jsx(AutocompleteWithPayload, {
        fontSize: [2, 2, 3],
        id: "product-selector",
        icon: SearchIcon,
        onQueryChange: handleQueryChange,
        onSelect,
        options: products,
        padding: [3, 3, 4],
        placeholder: "Type to find product \u2026",
        renderOption: option => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
          return /* @__PURE__ */jsx(Card, {
            as: "button",
            border: true,
            style: {
              opacity: ((_a = option == null ? void 0 : option.payload) == null ? void 0 : _a.published) ? 1 : 0.5
            },
            children: /* @__PURE__ */jsxs(Flex, {
              align: "center",
              children: [/* @__PURE__ */jsx(Box, {
                paddingLeft: 3,
                paddingY: 2,
                style: {
                  height: "65px"
                },
                children: /* @__PURE__ */jsx("img", {
                  style: {
                    width: "60px",
                    height: "70px"
                  },
                  src: "".concat(((_e = (_d = (_c = (_b = option == null ? void 0 : option.payload) == null ? void 0 : _b.masterVariant) == null ? void 0 : _c.images) == null ? void 0 : _d.find(image => /STN-01$/.test(image == null ? void 0 : image.url))) == null ? void 0 : _e.url) || ((_i = (_h = (_g = (_f = option == null ? void 0 : option.payload) == null ? void 0 : _f.masterVariant) == null ? void 0 : _g.images) == null ? void 0 : _h.find(image => /ST-01$/.test(image == null ? void 0 : image.url))) == null ? void 0 : _i.url) || ((_m = (_l = (_k = (_j = option == null ? void 0 : option.payload) == null ? void 0 : _j.masterVariant) == null ? void 0 : _k.images) == null ? void 0 : _l[0]) == null ? void 0 : _m.url), ".JPEG?h=180&$sanity_product_thumb$"),
                  alt: "img"
                })
              }), /* @__PURE__ */jsxs(Box, {
                padding: 2,
                children: [/* @__PURE__ */jsx(Box, {
                  padding: 2,
                  children: /* @__PURE__ */jsx(Text, {
                    size: [2, 2, 3],
                    children: (_o = (_n = option == null ? void 0 : option.payload) == null ? void 0 : _n.name) == null ? void 0 : _o.en
                  })
                }), /* @__PURE__ */jsx(Box, {
                  padding: 2,
                  children: /* @__PURE__ */jsx(Text, {
                    size: [2, 2, 3],
                    children: (_q = (_p = option == null ? void 0 : option.payload) == null ? void 0 : _p.masterVariant) == null ? void 0 : _q.id
                  })
                })]
              })]
            })
          });
        }
      })
    }), /* @__PURE__ */jsxs(Box, {
      paddingTop: 3,
      marginBottom: 3,
      children: [localValue.length > 0 && /* @__PURE__ */jsx(Button, {
        disabled: !(value == null ? void 0 : value.length),
        icon: CloseIcon,
        onClick: handleClearAll,
        tone: "critical",
        mode: "ghost",
        padding: [2, 2, 3],
        text: "Clear all"
      }), localValue == null ? void 0 : localValue.map(product => /* @__PURE__ */jsx(Card, {
        marginY: 2,
        children: /* @__PURE__ */jsx(ProductPreview, {
          onDelete: handleDelete,
          value: product
        })
      }, product._key))]
    })]
  });
}
const getSeasonSelectOptions = tags => {
  return tags.reduce((acc, val) => {
    var _a;
    const season = val == null ? void 0 : val.season;
    if (season) {
      acc.push({
        label: (_a = season == null ? void 0 : season.name) == null ? void 0 : _a.current,
        value: season == null ? void 0 : season._id
      });
    }
    return acc;
  }, []);
};
const FormFieldInputCollaborations = props => {
  const {
    control,
    description,
    disabled,
    error,
    label,
    name,
    onCreateSeason,
    options,
    placeholder,
    value
  } = props;
  const scheme = useColorSchemeValue();
  const creating = useTypedSelector(state => state.collaborations.creating);
  const collaborationsFetching = useTypedSelector(state => state.collaborations.fetching);
  return /* @__PURE__ */jsxs(Box, {
    style: {
      zIndex: 12
    },
    children: [/* @__PURE__ */jsx(FormFieldInputLabel, {
      description,
      error,
      label,
      name
    }), /* @__PURE__ */jsx(Controller, {
      control,
      defaultValue: value,
      name,
      render: _ref79 => {
        let {
          field
        } = _ref79;
        const {
          onBlur,
          onChange,
          value: controllerValue
        } = field;
        return /* @__PURE__ */jsx(CreatableSelect, {
          components: reactSelectComponents,
          instanceId: "seasons",
          isClearable: true,
          isDisabled: creating || disabled || collaborationsFetching,
          isLoading: creating,
          isMulti: false,
          name,
          noOptionsMessage: () => "No Collaborations",
          onBlur,
          onChange,
          onCreateOption: onCreateSeason,
          options,
          placeholder: collaborationsFetching ? "Loading..." : placeholder,
          styles: reactSelectStyles(scheme),
          value: controllerValue
        });
      }
    })]
  });
};
const getSeasonCollaborationOptions = tags => {
  return tags.reduce((acc, val) => {
    var _a;
    const collaboration = val == null ? void 0 : val.collaboration;
    if (collaboration && (collaboration == null ? void 0 : collaboration.name)) {
      acc.push({
        label: (_a = collaboration == null ? void 0 : collaboration.name) == null ? void 0 : _a.current,
        value: collaboration == null ? void 0 : collaboration._id
      });
    }
    return acc;
  }, []);
};
var __freeze$e = Object.freeze;
var __defProp$f = Object.defineProperty;
var __template$e = (cooked, raw) => __freeze$e(__defProp$f(cooked, "raw", {
  value: __freeze$e(raw || cooked.slice())
}));
var _a$e;
const DialogAssetEdit = props => {
  var _a2;
  const {
    children,
    dialog: {
      assetId,
      id,
      lastCreatedTag,
      lastRemovedTagIds
    }
  } = props;
  const client = useVersionedClient();
  const {
    scheme
  } = useColorScheme();
  const documentStore = useDocumentStore();
  const dispatch = useDispatch();
  const assetItem = useTypedSelector(state => selectAssetById(state, String(assetId)));
  const tags = useTypedSelector(selectTags);
  const seasons = useTypedSelector(selectSeasons);
  const collaboration = useTypedSelector(selectCollaborations);
  const assetUpdatedPrev = useRef(void 0);
  const [assetSnapshot, setAssetSnapshot] = useState(assetItem == null ? void 0 : assetItem.asset);
  const [tabSection, setTabSection] = useState("details");
  const currentAsset = assetItem ? assetItem == null ? void 0 : assetItem.asset : assetSnapshot;
  const allTagOptions = getTagSelectOptions(tags);
  const allSeasonOptions = getSeasonSelectOptions(seasons);
  const allCollaborationOptions = getSeasonCollaborationOptions(collaboration);
  const initialCollaboration = useTypedSelector(selectInitialSelectedCollaboration(currentAsset));
  const initialSeason = useTypedSelector(selectInitialSelectedSeasons(currentAsset));
  const assetTagOptions = useTypedSelector(selectTagSelectOptions(currentAsset));
  const generateDefaultValues = useCallback(asset => {
    return {
      name: (asset == null ? void 0 : asset.name) || (asset == null ? void 0 : asset.originalFilename) || "",
      primaryProducts: (asset == null ? void 0 : asset.primaryProducts) || (asset == null ? void 0 : asset.products) || [],
      secondaryProducts: (asset == null ? void 0 : asset.secondaryProducts) || (asset == null ? void 0 : asset.products) || [],
      season: initialSeason || null,
      collaboration: initialCollaboration || null,
      altText: (asset == null ? void 0 : asset.altText) || "",
      description: (asset == null ? void 0 : asset.description) || "",
      opt: {
        media: {
          tags: assetTagOptions
        }
      },
      title: (asset == null ? void 0 : asset.title) || ""
    };
  }, [assetTagOptions]);
  const {
    control,
    // Read the formState before render to subscribe the form state through Proxy
    formState: {
      errors,
      isValid
    },
    getValues,
    handleSubmit,
    register,
    reset,
    setValue
  } = useForm({
    defaultValues: generateDefaultValues(assetItem == null ? void 0 : assetItem.asset),
    mode: "onChange",
    resolver: zodResolver(assetFormSchema)
  });
  console.log(errors, isValid, "validation errors");
  const currentValues = getValues();
  const formUpdating = !assetItem || (assetItem == null ? void 0 : assetItem.updating);
  const handleClose = useCallback(() => {
    dispatch(dialogActions.remove({
      id
    }));
  }, [dispatch, id]);
  const handleDelete = useCallback(() => {
    if (!(assetItem == null ? void 0 : assetItem.asset)) {
      return;
    }
    dispatch(dialogActions.showConfirmDeleteAssets({
      assets: [assetItem],
      closeDialogId: assetItem == null ? void 0 : assetItem.asset._id
    }));
  }, [assetItem, dispatch]);
  const handleAssetUpdate = useCallback(update => {
    const {
      result,
      transition
    } = update;
    if (result && transition === "update") {
      setAssetSnapshot(result);
    }
  }, []);
  const handleCreateTag = useCallback(tagName => {
    dispatch(tagsActions.createRequest({
      assetId: currentAsset == null ? void 0 : currentAsset._id,
      name: tagName
    }));
  }, [currentAsset == null ? void 0 : currentAsset._id, dispatch]);
  const handleCreateSeason = useCallback(seasonName => {
    dispatch(seasonActions.createRequest({
      name: seasonName
    }));
  }, [dispatch]);
  const handleCreateCollaboration = useCallback(collaborationName => {
    dispatch(collaborationActions.createRequest({
      name: collaborationName,
      assetId: currentAsset == null ? void 0 : currentAsset._id
    }));
  }, [dispatch]);
  const onSubmit = useCallback(formData => {
    var _a3;
    if (!(assetItem == null ? void 0 : assetItem.asset)) {
      return;
    }
    const sanitizedFormData = sanitizeFormData(formData);
    dispatch(assetsActions.updateRequest({
      asset: assetItem == null ? void 0 : assetItem.asset,
      closeDialogId: assetItem == null ? void 0 : assetItem.asset._id,
      formData: {
        ...sanitizedFormData,
        collaboration: {
          _ref: sanitizedFormData.collaboration.value,
          _type: "reference",
          _weak: true
        },
        season: {
          _ref: sanitizedFormData.season.value,
          _type: "reference",
          _weak: true
        },
        // Map tags to sanity references
        opt: {
          media: {
            ...sanitizedFormData.opt.media,
            tags: ((_a3 = sanitizedFormData.opt.media.tags) == null ? void 0 : _a3.map(tag => ({
              _ref: tag.value,
              _type: "reference",
              _weak: true
            }))) || null
          }
        }
      }
    }));
  }, [assetItem == null ? void 0 : assetItem.asset, dispatch]);
  useEffect(() => {
    if (!(assetItem == null ? void 0 : assetItem.asset)) {
      return void 0;
    }
    const subscriptionAsset = client.listen(groq(_a$e || (_a$e = __template$e(["*[_id == $id]"]))), {
      id: assetItem == null ? void 0 : assetItem.asset._id
    }).subscribe(handleAssetUpdate);
    return () => {
      subscriptionAsset == null ? void 0 : subscriptionAsset.unsubscribe();
    };
  }, [assetItem == null ? void 0 : assetItem.asset, client, handleAssetUpdate]);
  useEffect(() => {
    if (lastCreatedTag) {
      const existingTags = getValues("opt.media.tags") || [];
      const updatedTags = existingTags.concat([lastCreatedTag]);
      setValue("opt.media.tags", updatedTags, {
        shouldDirty: true
      });
    }
  }, [getValues, lastCreatedTag, setValue]);
  useEffect(() => {
    if (lastRemovedTagIds) {
      const existingTags = getValues("opt.media.tags") || [];
      const updatedTags = existingTags.filter(tag => {
        return !lastRemovedTagIds.includes(tag.value);
      });
      setValue("opt.media.tags", updatedTags, {
        shouldDirty: true
      });
    }
  }, [getValues, lastRemovedTagIds, setValue]);
  useEffect(() => {
    if (assetUpdatedPrev.current !== (assetItem == null ? void 0 : assetItem.asset._updatedAt)) {
      reset(generateDefaultValues(assetItem == null ? void 0 : assetItem.asset));
    }
    assetUpdatedPrev.current = assetItem == null ? void 0 : assetItem.asset._updatedAt;
  }, [assetItem == null ? void 0 : assetItem.asset, generateDefaultValues, reset]);
  const Footer = () => /* @__PURE__ */jsx(Box, {
    padding: 3,
    children: /* @__PURE__ */jsxs(Flex, {
      justify: "space-between",
      children: [/* @__PURE__ */jsx(Button, {
        disabled: formUpdating,
        fontSize: 1,
        mode: "bleed",
        onClick: handleDelete,
        text: "Delete",
        tone: "critical"
      }), /* @__PURE__ */jsx(FormSubmitButton, {
        disabled: formUpdating || !isValid,
        isValid,
        lastUpdated: currentAsset == null ? void 0 : currentAsset._updatedAt,
        onClick: handleSubmit(onSubmit)
      })]
    })
  });
  if (!currentAsset) {
    return null;
  }
  return /* @__PURE__ */jsxs(Dialog, {
    footer: /* @__PURE__ */jsx(Footer, {}),
    header: "Asset details",
    id,
    onClose: handleClose,
    width: 3,
    children: [/* @__PURE__ */jsxs(Flex, {
      direction: ["column-reverse", "column-reverse", "row-reverse"],
      children: [/* @__PURE__ */jsx(Box, {
        flex: 1,
        marginTop: [5, 5, 0],
        padding: 4,
        children: /* @__PURE__ */jsx(WithReferringDocuments, {
          documentStore,
          id: currentAsset._id,
          children: _ref80 => {
            let {
              isLoading,
              referringDocuments
            } = _ref80;
            var _a3, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
            const uniqueReferringDocuments = getUniqueDocuments(referringDocuments);
            return /* @__PURE__ */jsxs(Fragment, {
              children: [/* @__PURE__ */jsxs(TabList, {
                space: 2,
                children: [/* @__PURE__ */jsx(Tab, {
                  "aria-controls": "details-panel",
                  disabled: formUpdating,
                  id: "details-tab",
                  label: "Details",
                  onClick: () => setTabSection("details"),
                  selected: tabSection === "details",
                  size: 2
                }), /* @__PURE__ */jsx(Tab, {
                  "aria-controls": "references-panel",
                  disabled: formUpdating,
                  id: "references-tab",
                  label: "References".concat(!isLoading && Array.isArray(uniqueReferringDocuments) ? " (".concat(uniqueReferringDocuments.length, ")") : ""),
                  onClick: () => setTabSection("references"),
                  selected: tabSection === "references",
                  size: 2
                })]
              }), /* @__PURE__ */jsxs(Box, {
                as: "form",
                marginTop: 4,
                onSubmit: handleSubmit(onSubmit),
                children: [!assetItem && /* @__PURE__ */jsx(Card, {
                  marginBottom: 3,
                  padding: 3,
                  radius: 2,
                  shadow: 1,
                  tone: "critical",
                  children: /* @__PURE__ */jsx(Text, {
                    size: 1,
                    children: "This file cannot be found \u2013 it may have been deleted."
                  })
                }), /* @__PURE__ */jsx("button", {
                  style: {
                    display: "none"
                  },
                  tabIndex: -1,
                  type: "submit"
                }), /* @__PURE__ */jsx(TabPanel, {
                  "aria-labelledby": "details",
                  hidden: tabSection !== "details",
                  id: "details-panel",
                  children: /* @__PURE__ */jsxs(Stack, {
                    space: 3,
                    children: [/* @__PURE__ */jsx(FormFieldInputText, {
                      ...register("title"),
                      disabled: formUpdating,
                      error: (_a3 = errors == null ? void 0 : errors.title) == null ? void 0 : _a3.message,
                      label: "Title",
                      name: "title",
                      value: currentAsset == null ? void 0 : currentAsset.title
                    }), /* @__PURE__ */jsx(FormFieldInputTextarea, {
                      ...register("description"),
                      disabled: formUpdating,
                      error: (_b = errors == null ? void 0 : errors.description) == null ? void 0 : _b.message,
                      label: "Description",
                      name: "description",
                      rows: 5,
                      value: currentAsset == null ? void 0 : currentAsset.description
                    }), /* @__PURE__ */jsx(FormFieldInputTags, {
                      control,
                      disabled: formUpdating,
                      error: (_e = (_d = (_c = errors == null ? void 0 : errors.opt) == null ? void 0 : _c.media) == null ? void 0 : _d.tags) == null ? void 0 : _e.message,
                      label: "Tags",
                      name: "opt.media.tags",
                      onCreateTag: handleCreateTag,
                      options: allTagOptions,
                      placeholder: "Select or create...",
                      value: assetTagOptions
                    }), /* @__PURE__ */jsx(FormFieldInputSeasons, {
                      control,
                      disabled: formUpdating,
                      error: (_f = errors == null ? void 0 : errors.season) == null ? void 0 : _f.message,
                      label: "Seasons",
                      name: "season",
                      onCreateSeason: handleCreateSeason,
                      options: allSeasonOptions,
                      placeholder: "Select or create...",
                      value: (_g = currentValues == null ? void 0 : currentValues.season) != null ? _g : null
                    }), /* @__PURE__ */jsx(FormFieldInputCollaborations, {
                      control,
                      disabled: formUpdating,
                      error: (_h = errors == null ? void 0 : errors.season) == null ? void 0 : _h.message,
                      label: "Drops",
                      name: "collaboration",
                      onCreateSeason: handleCreateCollaboration,
                      options: allCollaborationOptions,
                      placeholder: "Select or create...",
                      value: (_i = currentValues == null ? void 0 : currentValues.collaboration) != null ? _i : null
                    }), /* @__PURE__ */jsx(ProductSelector, {
                      onChange: updatedValue => {
                        setValue("primaryProducts", updatedValue, {
                          shouldDirty: true
                        });
                      },
                      error: (_k = (_j = errors.products) == null ? void 0 : _j.message) == null ? void 0 : _k.toString(),
                      value: (_l = currentValues == null ? void 0 : currentValues.primaryProducts) != null ? _l : [],
                      labelDescription: "Add products to image",
                      label: "Primary Products",
                      name: "primaryProducts"
                    }), /* @__PURE__ */jsx(ProductSelector, {
                      onChange: updatedValue => {
                        setValue("secondaryProducts", updatedValue, {
                          shouldDirty: true
                        });
                      },
                      error: (_n = (_m = errors.products) == null ? void 0 : _m.message) == null ? void 0 : _n.toString(),
                      value: (_o = currentValues == null ? void 0 : currentValues.secondaryProducts) != null ? _o : [],
                      labelDescription: "Add products to image",
                      label: "Secondary Products",
                      name: "secondaryProducts"
                    }), /* @__PURE__ */jsx(FormFieldInputText, {
                      ...register("altText"),
                      disabled: formUpdating,
                      error: (_p = errors == null ? void 0 : errors.altText) == null ? void 0 : _p.message,
                      label: "Alt Text",
                      name: "altText",
                      value: currentAsset == null ? void 0 : currentAsset.altText
                    })]
                  })
                }), /* @__PURE__ */jsx(TabPanel, {
                  "aria-labelledby": "references",
                  hidden: tabSection !== "references",
                  id: "references-panel",
                  children: /* @__PURE__ */jsx(Box, {
                    marginTop: 5,
                    children: (assetItem == null ? void 0 : assetItem.asset) && /* @__PURE__ */jsx(DocumentList, {
                      documents: uniqueReferringDocuments,
                      isLoading
                    })
                  })
                })]
              })]
            });
          }
        })
      }), /* @__PURE__ */jsxs(Box, {
        flex: 1,
        padding: 4,
        children: [/* @__PURE__ */jsxs(Box, {
          style: {
            aspectRatio: "1"
          },
          children: [isFileAsset(currentAsset) && /* @__PURE__ */jsx(FileAssetPreview, {
            asset: currentAsset
          }), isImageAsset(currentAsset) && /* @__PURE__ */jsx(Image$1, {
            draggable: false,
            scheme,
            showCheckerboard: !((_a2 = currentAsset == null ? void 0 : currentAsset.metadata) == null ? void 0 : _a2.isOpaque),
            src: imageDprUrl(currentAsset, {
              height: 600,
              width: 600
            })
          })]
        }), currentAsset && /* @__PURE__ */jsx(Box, {
          marginTop: 4,
          children: /* @__PURE__ */jsx(AssetMetadata, {
            asset: currentAsset,
            item: assetItem
          })
        })]
      })]
    }), children]
  });
};
const DialogConfirm = props => {
  const {
    children,
    dialog
  } = props;
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(dialogActions.remove({
      id: dialog == null ? void 0 : dialog.id
    }));
  };
  const handleConfirm = () => {
    if (dialog == null ? void 0 : dialog.closeDialogId) {
      dispatch(dialogActions.remove({
        id: dialog == null ? void 0 : dialog.closeDialogId
      }));
    }
    if (dialog == null ? void 0 : dialog.confirmCallbackAction) {
      dispatch(dialog.confirmCallbackAction);
    }
    handleClose();
  };
  const Footer = () => /* @__PURE__ */jsx(Box, {
    padding: 3,
    children: /* @__PURE__ */jsxs(Flex, {
      justify: "space-between",
      children: [/* @__PURE__ */jsx(Button, {
        fontSize: 1,
        mode: "bleed",
        onClick: handleClose,
        text: "Cancel"
      }), /* @__PURE__ */jsx(Button, {
        fontSize: 1,
        onClick: handleConfirm,
        text: dialog == null ? void 0 : dialog.confirmText,
        tone: dialog == null ? void 0 : dialog.tone
      })]
    })
  });
  const Header = () => /* @__PURE__ */jsxs(Flex, {
    align: "center",
    children: [/* @__PURE__ */jsx(Box, {
      paddingX: 1,
      children: /* @__PURE__ */jsx(WarningOutlineIcon, {})
    }), /* @__PURE__ */jsx(Box, {
      marginLeft: 2,
      children: dialog == null ? void 0 : dialog.headerTitle
    })]
  });
  return /* @__PURE__ */jsxs(Dialog, {
    footer: /* @__PURE__ */jsx(Footer, {}),
    header: /* @__PURE__ */jsx(Header, {}),
    id: "confirm",
    onClose: handleClose,
    width: 1,
    children: [/* @__PURE__ */jsx(Box, {
      paddingX: 4,
      paddingY: 4,
      children: /* @__PURE__ */jsxs(Stack, {
        space: 3,
        children: [(dialog == null ? void 0 : dialog.title) && /* @__PURE__ */jsx(Text, {
          size: 1,
          children: dialog.title
        }), (dialog == null ? void 0 : dialog.description) && /* @__PURE__ */jsx(Text, {
          muted: true,
          size: 1,
          children: /* @__PURE__ */jsx("em", {
            children: dialog.description
          })
        })]
      })
    }), children]
  });
};
const DialogSearchFacets = props => {
  const {
    children,
    dialog: {
      id
    }
  } = props;
  const dispatch = useDispatch();
  const handleClose = useCallback(() => {
    dispatch(dialogActions.clear());
  }, []);
  return /* @__PURE__ */jsxs(Dialog, {
    header: "Filters",
    id,
    onClose: handleClose,
    width: 1,
    children: [/* @__PURE__ */jsxs(Box, {
      padding: 3,
      children: [/* @__PURE__ */jsx(SearchFacets, {
        layout: "stack"
      }), /* @__PURE__ */jsx(SearchFacetsControl, {})]
    }), children]
  });
};
const DialogTagCreate = props => {
  var _a;
  const {
    children,
    dialog: {
      id
    }
  } = props;
  const dispatch = useDispatch();
  const creating = useTypedSelector(state => state.tags.creating);
  const creatingError = useTypedSelector(state => state.tags.creatingError);
  const {
    // Read the formState before render to subscribe the form state through Proxy
    formState: {
      errors,
      isDirty,
      isValid
    },
    handleSubmit,
    register,
    setError
  } = useForm({
    defaultValues: {
      name: ""
    },
    mode: "onChange",
    resolver: zodResolver(tagFormSchema)
  });
  const formUpdating = creating;
  const handleClose = () => {
    dispatch(dialogActions.clear());
  };
  const onSubmit = formData => {
    const sanitizedFormData = sanitizeFormData(formData);
    dispatch(tagsActions.createRequest({
      name: sanitizedFormData.name
    }));
  };
  useEffect(() => {
    if (creatingError) {
      setError("name", {
        message: creatingError == null ? void 0 : creatingError.message
      });
    }
  }, [creatingError, setError]);
  const Footer = () => /* @__PURE__ */jsx(Box, {
    padding: 3,
    children: /* @__PURE__ */jsx(Flex, {
      justify: "flex-end",
      children: /* @__PURE__ */jsx(FormSubmitButton, {
        disabled: formUpdating || !isDirty || !isValid,
        isValid,
        onClick: handleSubmit(onSubmit)
      })
    })
  });
  return /* @__PURE__ */jsxs(Dialog, {
    footer: /* @__PURE__ */jsx(Footer, {}),
    header: "Create Tag",
    id,
    onClose: handleClose,
    width: 1,
    children: [/* @__PURE__ */jsxs(Box, {
      as: "form",
      padding: 4,
      onSubmit: handleSubmit(onSubmit),
      children: [/* @__PURE__ */jsx("button", {
        style: {
          display: "none"
        },
        tabIndex: -1,
        type: "submit"
      }), /* @__PURE__ */jsx(FormFieldInputText, {
        ...register("name"),
        disabled: formUpdating,
        error: (_a = errors == null ? void 0 : errors.name) == null ? void 0 : _a.message,
        label: "Name",
        name: "name"
      })]
    }), children]
  });
};
var __freeze$d = Object.freeze;
var __defProp$e = Object.defineProperty;
var __template$d = (cooked, raw) => __freeze$d(__defProp$e(cooked, "raw", {
  value: __freeze$d(raw || cooked.slice())
}));
var _a$d;
const DialogTagEdit = props => {
  var _a2;
  const {
    children,
    dialog: {
      id,
      tagId
    }
  } = props;
  const client = useVersionedClient();
  const dispatch = useDispatch();
  const tagItem = useTypedSelector(state => selectTagById(state, String(tagId)));
  const [tagSnapshot, setTagSnapshot] = useState(tagItem == null ? void 0 : tagItem.tag);
  const currentTag = tagItem ? tagItem == null ? void 0 : tagItem.tag : tagSnapshot;
  const generateDefaultValues = tag => {
    var _a3;
    return {
      name: ((_a3 = tag == null ? void 0 : tag.name) == null ? void 0 : _a3.current) || ""
    };
  };
  const {
    // Read the formState before render to subscribe the form state through Proxy
    formState: {
      errors,
      isDirty,
      isValid
    },
    handleSubmit,
    register,
    reset,
    setError
  } = useForm({
    defaultValues: generateDefaultValues(tagItem == null ? void 0 : tagItem.tag),
    mode: "onChange",
    resolver: zodResolver(tagFormSchema)
  });
  const formUpdating = !tagItem || (tagItem == null ? void 0 : tagItem.updating);
  const handleClose = () => {
    dispatch(dialogActions.remove({
      id
    }));
  };
  const onSubmit = formData => {
    var _a3;
    if (!(tagItem == null ? void 0 : tagItem.tag)) {
      return;
    }
    const sanitizedFormData = sanitizeFormData(formData);
    dispatch(tagsActions.updateRequest({
      closeDialogId: (_a3 = tagItem == null ? void 0 : tagItem.tag) == null ? void 0 : _a3._id,
      formData: {
        name: {
          _type: "slug",
          current: sanitizedFormData.name
        }
      },
      tag: tagItem == null ? void 0 : tagItem.tag
    }));
  };
  const handleDelete = () => {
    var _a3;
    if (!(tagItem == null ? void 0 : tagItem.tag)) {
      return;
    }
    dispatch(dialogActions.showConfirmDeleteTag({
      closeDialogId: (_a3 = tagItem == null ? void 0 : tagItem.tag) == null ? void 0 : _a3._id,
      tag: tagItem == null ? void 0 : tagItem.tag
    }));
  };
  const handleTagUpdate = useCallback(update => {
    const {
      result,
      transition
    } = update;
    if (result && transition === "update") {
      setTagSnapshot(result);
      reset(generateDefaultValues(result));
    }
  }, [reset]);
  useEffect(() => {
    var _a3;
    if (tagItem == null ? void 0 : tagItem.error) {
      setError("name", {
        message: (_a3 = tagItem.error) == null ? void 0 : _a3.message
      });
    }
  }, [setError, tagItem.error]);
  useEffect(() => {
    if (!(tagItem == null ? void 0 : tagItem.tag)) {
      return void 0;
    }
    const subscriptionAsset = client.listen(groq(_a$d || (_a$d = __template$d(["*[_id == $id]"]))), {
      id: tagItem == null ? void 0 : tagItem.tag._id
    }).subscribe(handleTagUpdate);
    return () => {
      subscriptionAsset == null ? void 0 : subscriptionAsset.unsubscribe();
    };
  }, [client, handleTagUpdate, tagItem == null ? void 0 : tagItem.tag]);
  const Footer = () => {
    var _a3;
    return /* @__PURE__ */jsx(Box, {
      padding: 3,
      children: /* @__PURE__ */jsxs(Flex, {
        justify: "space-between",
        children: [/* @__PURE__ */jsx(Button, {
          disabled: formUpdating,
          fontSize: 1,
          mode: "bleed",
          onClick: handleDelete,
          text: "Delete",
          tone: "critical"
        }), /* @__PURE__ */jsx(FormSubmitButton, {
          disabled: formUpdating || !isDirty || !isValid,
          isValid,
          lastUpdated: (_a3 = tagItem == null ? void 0 : tagItem.tag) == null ? void 0 : _a3._updatedAt,
          onClick: handleSubmit(onSubmit)
        })]
      })
    });
  };
  if (!currentTag) {
    return null;
  }
  return /* @__PURE__ */jsxs(Dialog, {
    footer: /* @__PURE__ */jsx(Footer, {}),
    header: "Edit Season",
    id,
    onClose: handleClose,
    width: 1,
    children: [/* @__PURE__ */jsxs(Box, {
      as: "form",
      padding: 4,
      onSubmit: handleSubmit(onSubmit),
      children: [!tagItem && /* @__PURE__ */jsx(Card, {
        marginBottom: 3,
        padding: 3,
        radius: 2,
        shadow: 1,
        tone: "critical",
        children: /* @__PURE__ */jsx(Text, {
          size: 1,
          children: "This tag cannot be found \u2013 it may have been deleted."
        })
      }), /* @__PURE__ */jsx("button", {
        style: {
          display: "none"
        },
        tabIndex: -1,
        type: "submit"
      }), /* @__PURE__ */jsx(FormFieldInputText, {
        ...register("name"),
        disabled: formUpdating,
        error: (_a2 = errors == null ? void 0 : errors.name) == null ? void 0 : _a2.message,
        label: "Name",
        name: "name"
      })]
    }), children]
  });
};
var __freeze$c = Object.freeze;
var __defProp$d = Object.defineProperty;
var __template$c = (cooked, raw) => __freeze$c(__defProp$d(cooked, "raw", {
  value: __freeze$c(raw || cooked.slice())
}));
var _a$c, _b$7;
const TagContainer = styled(Flex)(_a$c || (_a$c = __template$c(["\n  height: ", "px;\n"])), PANEL_HEIGHT);
const ButtonContainer$2 = styled(Flex)(_b$7 || (_b$7 = __template$c(["\n  @media (pointer: fine) {\n    visibility: hidden;\n  }\n\n  @media (hover: hover) and (pointer: fine) {\n    ", ":hover & {\n      visibility: visible;\n    }\n  }\n"])), TagContainer);
const TagButton = props => {
  const {
    disabled,
    icon,
    onClick,
    tone,
    tooltip
  } = props;
  return /* @__PURE__ */jsx(Tooltip, {
    content: /* @__PURE__ */jsx(Container$2, {
      padding: 2,
      width: 0,
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 1,
        children: tooltip
      })
    }),
    disabled: "ontouchstart" in window,
    placement: "top",
    portal: true,
    children: /* @__PURE__ */jsx(Button, {
      disabled,
      fontSize: 1,
      icon,
      mode: "bleed",
      onClick,
      padding: 2,
      tone
    })
  });
};
const Tag = props => {
  var _a2, _b2;
  const {
    actions,
    tag
  } = props;
  const dispatch = useDispatch();
  const assetsPicked = useTypedSelector(selectAssetsPicked);
  const isSearchFacetTag = useTypedSelector(state => {
    var _a3;
    return selectIsSearchFacetTag(state, (_a3 = tag == null ? void 0 : tag.tag) == null ? void 0 : _a3._id);
  });
  const handleSearchFacetTagRemove = () => {
    dispatch(searchActions.facetsRemoveByTag({
      tagId: tag.tag._id
    }));
  };
  const handleShowAddTagToAssetsDialog = () => {
    dispatch(dialogActions.showConfirmAssetsTagAdd({
      assetsPicked,
      tag: tag.tag
    }));
  };
  const handleShowRemoveTagFromAssetsDialog = () => {
    dispatch(dialogActions.showConfirmAssetsTagRemove({
      assetsPicked,
      tag: tag.tag
    }));
  };
  const handleShowTagDeleteDialog = () => {
    dispatch(dialogActions.showConfirmDeleteTag({
      tag: tag.tag
    }));
  };
  const handleShowTagEditDialog = () => {
    var _a3;
    dispatch(DIALOG_ACTIONS.showTagEdit({
      tagId: (_a3 = tag == null ? void 0 : tag.tag) == null ? void 0 : _a3._id
    }));
  };
  const handleSearchFacetTagAddOrUpdate = () => {
    var _a3, _b3, _c;
    const searchFacet = {
      ...inputs.tag,
      value: {
        label: (_b3 = (_a3 = tag == null ? void 0 : tag.tag) == null ? void 0 : _a3.name) == null ? void 0 : _b3.current,
        value: (_c = tag == null ? void 0 : tag.tag) == null ? void 0 : _c._id
      }
    };
    if (isSearchFacetTag) {
      dispatch(searchActions.facetsUpdate({
        name: "tag",
        operatorType: "references",
        value: searchFacet.value
      }));
    } else {
      dispatch(searchActions.facetsAdd({
        facet: searchFacet
      }));
    }
  };
  return /* @__PURE__ */jsxs(TagContainer, {
    align: "center",
    flex: 1,
    justify: "space-between",
    paddingLeft: 3,
    children: [/* @__PURE__ */jsx(Box, {
      flex: 1,
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 1,
        style: {
          opacity: (tag == null ? void 0 : tag.updating) ? 0.5 : 1,
          userSelect: "none"
        },
        textOverflow: "ellipsis",
        children: (_b2 = (_a2 = tag == null ? void 0 : tag.tag) == null ? void 0 : _a2.name) == null ? void 0 : _b2.current
      })
    }), /* @__PURE__ */jsxs(ButtonContainer$2, {
      align: "center",
      style: {
        flexShrink: 0
      },
      children: [(actions == null ? void 0 : actions.includes("search")) && /* @__PURE__ */jsx(TagButton, {
        disabled: tag == null ? void 0 : tag.updating,
        icon: isSearchFacetTag ? /* @__PURE__ */jsx(CloseIcon, {}) : /* @__PURE__ */jsx(SearchIcon, {}),
        onClick: isSearchFacetTag ? handleSearchFacetTagRemove : handleSearchFacetTagAddOrUpdate,
        tooltip: isSearchFacetTag ? "Remove filter" : "Filter by tag"
      }), (actions == null ? void 0 : actions.includes("edit")) && /* @__PURE__ */jsx(TagButton, {
        disabled: tag == null ? void 0 : tag.updating,
        icon: /* @__PURE__ */jsx(EditIcon, {}),
        onClick: handleShowTagEditDialog,
        tone: "primary",
        tooltip: "Edit tag"
      }), (actions == null ? void 0 : actions.includes("applyAll")) && /* @__PURE__ */jsx(TagButton, {
        disabled: tag == null ? void 0 : tag.updating,
        icon: /* @__PURE__ */jsx(ArrowUpIcon, {}),
        onClick: handleShowAddTagToAssetsDialog,
        tone: "primary",
        tooltip: "Add tag to selected assets"
      }), (actions == null ? void 0 : actions.includes("removeAll")) && /* @__PURE__ */jsx(TagButton, {
        disabled: tag == null ? void 0 : tag.updating,
        icon: /* @__PURE__ */jsx(ArrowDownIcon, {}),
        onClick: handleShowRemoveTagFromAssetsDialog,
        tone: "critical",
        tooltip: "Remove tag from selected assets"
      }), (actions == null ? void 0 : actions.includes("delete")) && /* @__PURE__ */jsx(TagButton, {
        disabled: tag == null ? void 0 : tag.updating,
        icon: /* @__PURE__ */jsx(TrashIcon, {}),
        onClick: handleShowTagDeleteDialog,
        tone: "critical",
        tooltip: "Delete tag"
      })]
    })]
  });
};
const VirtualRow$3 = memo(_ref81 => {
  let {
    isScrolling,
    item
  } = _ref81;
  var _a;
  if (typeof item === "string") {
    return /* @__PURE__ */jsx(Flex, {
      align: "center",
      justify: "space-between",
      paddingX: 3,
      style: {
        height: "".concat(PANEL_HEIGHT, "px")
      },
      children: /* @__PURE__ */jsx(Label, {
        size: 0,
        children: item
      })
    }, item);
  }
  return /* @__PURE__ */jsx(Tag, {
    actions: isScrolling ? void 0 : item.actions,
    tag: item
  }, (_a = item.tag) == null ? void 0 : _a._id);
});
const TagsVirtualized = () => {
  const assetsPicked = useTypedSelector(selectAssetsPicked);
  const tags = useTypedSelector(selectTags);
  const [isScrolling, setIsScrolling] = useState(false);
  const pickedTagIds = assetsPicked == null ? void 0 : assetsPicked.reduce((acc, val) => {
    var _a, _b, _c, _d;
    const assetTagIds = ((_d = (_c = (_b = (_a = val == null ? void 0 : val.asset) == null ? void 0 : _a.opt) == null ? void 0 : _b.media) == null ? void 0 : _c.tags) == null ? void 0 : _d.map(tag => tag._ref)) || [];
    acc = acc.concat(assetTagIds);
    return acc;
  }, []);
  const pickedTagIdsUnique = [...new Set(pickedTagIds)];
  const tagIdsSegmented = pickedTagIdsUnique.reduce((acc, tagId) => {
    const tagIsInEveryAsset = assetsPicked.every(assetItem => {
      var _a, _b, _c, _d;
      const tagIndex = (_d = (_c = (_b = (_a = assetItem.asset.opt) == null ? void 0 : _a.media) == null ? void 0 : _b.tags) == null ? void 0 : _c.findIndex(tag => tag._ref === tagId)) != null ? _d : -1;
      return tagIndex >= 0;
    });
    if (tagIsInEveryAsset) {
      acc.appliedToAll.push(tagId);
    } else {
      acc.appliedToSome.push(tagId);
    }
    return acc;
  }, {
    appliedToAll: [],
    appliedToSome: []
  });
  const tagsAppliedToAll = tags.filter(tag => tagIdsSegmented.appliedToAll.includes(tag.tag._id)).map(tagItem => ({
    ...tagItem,
    actions: ["delete", "edit", "removeAll", "search"]
  }));
  const tagsAppliedToSome = tags.filter(tag => tagIdsSegmented.appliedToSome.includes(tag.tag._id)).map(tagItem => ({
    ...tagItem,
    actions: ["applyAll", "delete", "edit", "removeAll", "search"]
  }));
  const tagsUnused = tags.filter(tag => !pickedTagIdsUnique.includes(tag.tag._id)).map(tagItem => ({
    ...tagItem,
    actions: ["applyAll", "delete", "edit", "search"]
  }));
  let items = [];
  if (assetsPicked.length === 0) {
    items = tags.map(tagItem => ({
      ...tagItem,
      actions: ["delete", "edit", "search"]
    }));
  } else {
    if ((tagsAppliedToAll == null ? void 0 : tagsAppliedToAll.length) > 0) {
      items = [...items,
      //
      assetsPicked.length === 1 ? "Used" : "Used by all", ...tagsAppliedToAll];
    }
    if ((tagsAppliedToSome == null ? void 0 : tagsAppliedToSome.length) > 0) {
      items = [...items,
      //
      "Used by some", ...tagsAppliedToSome];
    }
    if ((tagsUnused == null ? void 0 : tagsUnused.length) > 0) {
      items = [...items,
      //
      "Unused", ...tagsUnused];
    }
  }
  return /* @__PURE__ */jsx(Virtuoso, {
    className: "media__custom-scrollbar",
    computeItemKey: index => {
      const item = items[index];
      if (typeof item === "string") {
        return item;
      }
      return item.tag._id;
    },
    isScrolling: setIsScrolling,
    itemContent: index => {
      return /* @__PURE__ */jsx(VirtualRow$3, {
        isScrolling,
        item: items[index]
      });
    },
    style: {
      flex: 1,
      overflowX: "hidden"
    },
    totalCount: items.length
  });
};
const TagViewHeader = _ref82 => {
  let {
    allowCreate,
    light,
    title
  } = _ref82;
  const {
    scheme
  } = useColorScheme();
  const dispatch = useDispatch();
  const tagsCreating = useTypedSelector(state => state.tags.creating);
  const tagsFetching = useTypedSelector(state => state.tags.fetching);
  const handleTagCreate = () => {
    dispatch(DIALOG_ACTIONS.showTagCreate());
  };
  return /* @__PURE__ */jsx(Fragment, {
    children: /* @__PURE__ */jsxs(Flex, {
      align: "center",
      justify: "space-between",
      paddingLeft: 3,
      style: {
        background: light ? getSchemeColor(scheme, "bg") : "inherit",
        borderBottom: "1px solid var(--card-border-color)",
        flexShrink: 0,
        height: "".concat(PANEL_HEIGHT, "px")
      },
      children: [/* @__PURE__ */jsxs(Inline, {
        space: 2,
        children: [/* @__PURE__ */jsx(Label, {
          size: 0,
          children: title
        }), tagsFetching && /* @__PURE__ */jsx(Label, {
          size: 0,
          style: {
            opacity: 0.3
          },
          children: "Loading..."
        })]
      }), allowCreate && /* @__PURE__ */jsx(Box, {
        marginRight: 1,
        children: /* @__PURE__ */jsx(Button, {
          disabled: tagsCreating,
          fontSize: 1,
          icon: ComposeIcon,
          mode: "bleed",
          onClick: handleTagCreate,
          style: {
            background: "transparent",
            boxShadow: "none"
          }
        })
      })]
    })
  });
};
const TagView = () => {
  const numPickedAssets = useTypedSelector(selectAssetsPickedLength);
  const tags = useTypedSelector(selectTags);
  const fetching = useTypedSelector(state => state.tags.fetching);
  const fetchCount = useTypedSelector(state => state.tags.fetchCount);
  const fetchComplete = fetchCount !== -1;
  const hasTags = !fetching && (tags == null ? void 0 : tags.length) > 0;
  const hasPicked = !!(numPickedAssets > 0);
  return /* @__PURE__ */jsxs(Flex, {
    direction: "column",
    flex: 1,
    height: "fill",
    children: [/* @__PURE__ */jsx(TagViewHeader, {
      allowCreate: true,
      light: hasPicked,
      title: hasPicked ? "Tags (in selection)" : "Tags"
    }), fetchComplete && !hasTags && /* @__PURE__ */jsx(Box, {
      padding: 3,
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 1,
        children: /* @__PURE__ */jsx("em", {
          children: "No tags"
        })
      })
    }), hasTags && /* @__PURE__ */jsx(TagsVirtualized, {})]
  });
};
const DialogTags = props => {
  const {
    children,
    dialog: {
      id
    }
  } = props;
  const dispatch = useDispatch();
  const handleClose = useCallback(() => {
    dispatch(dialogActions.clear());
  }, []);
  return /* @__PURE__ */jsxs(Dialog, {
    header: "All Tags",
    id,
    onClose: handleClose,
    width: 1,
    children: [/* @__PURE__ */jsx(Box, {
      style: {
        height: "100%",
        minHeight: "420px"
        // explicit height required as <TagView> is virtualized
      },

      children: /* @__PURE__ */jsx(TagView, {})
    }), children]
  });
};
const DialogMassAssetEdit = props => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  const {
    children,
    dialog: {
      id,
      lastCreatedTag,
      lastRemovedTagIds
    }
  } = props;
  const dispatch = useDispatch();
  const tags = useTypedSelector(selectTags);
  const selectedAssets = useTypedSelector(selectAssetsPicked);
  const [tabSection, setTabSection] = useState("details");
  const seasons = useTypedSelector(selectSeasons);
  const collaborations = useTypedSelector(selectCollaborations);
  const allTagOptions = getTagSelectOptions(tags);
  const allSeasonOptions = getSeasonSelectOptions(seasons);
  const allCollaborationOptions = getSeasonCollaborationOptions(collaborations);
  const defaultValues = {
    name: "",
    primaryProducts: [],
    secondaryProducts: [],
    season: null,
    collaboration: null,
    altText: "",
    description: "",
    title: "",
    opt: {
      media: {
        tags: []
      }
    }
  };
  const formUpdating = false;
  const {
    control,
    // Read the formState before render to subscribe the form state through Proxy
    formState: {
      errors,
      isValid
    },
    getValues,
    handleSubmit,
    register,
    setValue
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(massEditAssetsFormSchema)
  });
  const currentValues = getValues();
  const handleClose = useCallback(() => {
    dispatch(dialogActions.remove({
      id
    }));
  }, [dispatch, id]);
  const handleCreateTag = useCallback(tagName => {
    dispatch(tagsActions.createRequest({
      assetId: "",
      name: tagName
    }));
  }, [dispatch]);
  const onSubmit = useCallback(formData => {
    var _a2;
    const sanitizedFormData = sanitizeFormData(formData);
    dispatch(assetsActions.massUpdateRequest({
      assets: selectedAssets.map(each => each.asset),
      closeDialogId: "massEdit",
      formData: {
        ...sanitizedFormData,
        collaboration: {
          _ref: sanitizedFormData.collaboration.value,
          _type: "reference",
          _weak: true
        },
        season: {
          _ref: sanitizedFormData.season.value,
          _type: "reference",
          _weak: true
        },
        // Map tags to sanity references
        opt: {
          media: {
            ...sanitizedFormData.opt.media,
            tags: ((_a2 = sanitizedFormData.opt.media.tags) == null ? void 0 : _a2.map(tag => ({
              _ref: tag.value,
              _type: "reference",
              _weak: true
            }))) || null
          }
        }
      }
    }));
    dispatch(dialogActions.remove({
      id: "massEdit"
    }));
  }, [dispatch, selectedAssets]);
  const handleCreateSeason = useCallback(seasonName => {
    dispatch(seasonActions.createRequest({
      name: seasonName
    }));
  }, [dispatch]);
  const handleCreateCollaboration = useCallback(collaborationName => {
    dispatch(collaborationActions.createRequest({
      name: collaborationName
    }));
  }, [dispatch]);
  useEffect(() => {
    if (lastCreatedTag) {
      const existingTags = getValues("opt.media.tags") || [];
      const updatedTags = existingTags.concat([lastCreatedTag]);
      setValue("opt.media.tags", updatedTags, {
        shouldDirty: true
      });
    }
  }, [getValues, lastCreatedTag, setValue]);
  useEffect(() => {
    if (lastRemovedTagIds) {
      const existingTags = getValues("opt.media.tags") || [];
      const updatedTags = existingTags.filter(tag => {
        return !lastRemovedTagIds.includes(tag.value);
      });
      setValue("opt.media.tags", updatedTags, {
        shouldDirty: true
      });
    }
  }, [getValues, lastRemovedTagIds, setValue]);
  const Footer = () => /* @__PURE__ */jsx(Box, {
    padding: 3,
    children: /* @__PURE__ */jsx(Flex, {
      justify: "space-between",
      children: /* @__PURE__ */jsx(FormSubmitButton, {
        disabled: !isValid,
        isValid,
        onClick: handleSubmit(onSubmit)
      })
    })
  });
  return /* @__PURE__ */jsxs(Dialog, {
    footer: /* @__PURE__ */jsx(Footer, {}),
    header: "Edit Selected Assets",
    id,
    onClose: handleClose,
    width: 3,
    children: [/* @__PURE__ */jsx(Flex, {
      direction: ["column-reverse", "column-reverse", "row-reverse"],
      children: /* @__PURE__ */jsx(Box, {
        flex: 1,
        marginTop: [5, 5, 0],
        padding: 4,
        children: /* @__PURE__ */jsxs(Fragment, {
          children: [/* @__PURE__ */jsxs(TabList, {
            space: 2,
            children: [/* @__PURE__ */jsx(Tab, {
              "aria-controls": "details-panel",
              disabled: formUpdating,
              id: "details-tab",
              label: "Details",
              onClick: () => setTabSection("details"),
              selected: tabSection === "details",
              size: 2
            }), /* @__PURE__ */jsx(Tab, {
              "aria-controls": "references-panel",
              disabled: false,
              id: "references-tab",
              label: "",
              selected: tabSection === "references",
              size: 2
            })]
          }), /* @__PURE__ */jsxs(Box, {
            as: "form",
            marginTop: 4,
            onSubmit: handleSubmit(onSubmit),
            children: [/* @__PURE__ */jsx("button", {
              style: {
                display: "none"
              },
              tabIndex: -1,
              type: "submit"
            }), /* @__PURE__ */jsx(TabPanel, {
              "aria-labelledby": "details",
              hidden: tabSection !== "details",
              id: "details-panel",
              children: /* @__PURE__ */jsxs(Stack, {
                space: 3,
                children: [/* @__PURE__ */jsx(FormFieldInputText, {
                  ...register("title"),
                  disabled: formUpdating,
                  error: (_a = errors == null ? void 0 : errors.title) == null ? void 0 : _a.message,
                  label: "Title",
                  name: "title",
                  value: currentValues == null ? void 0 : currentValues.title
                }), /* @__PURE__ */jsx(FormFieldInputTextarea, {
                  ...register("description"),
                  disabled: formUpdating,
                  error: (_b = errors == null ? void 0 : errors.description) == null ? void 0 : _b.message,
                  label: "Description",
                  name: "description",
                  rows: 5,
                  value: currentValues == null ? void 0 : currentValues.description
                }), /* @__PURE__ */jsx(FormFieldInputTags, {
                  control,
                  disabled: formUpdating,
                  error: (_e = (_d = (_c = errors == null ? void 0 : errors.opt) == null ? void 0 : _c.media) == null ? void 0 : _d.tags) == null ? void 0 : _e.message,
                  label: "Tags",
                  name: "opt.media.tags",
                  onCreateTag: handleCreateTag,
                  options: allTagOptions,
                  placeholder: "Select or create...",
                  value: []
                }), /* @__PURE__ */jsx(FormFieldInputSeasons, {
                  control,
                  disabled: formUpdating,
                  error: (_f = errors == null ? void 0 : errors.season) == null ? void 0 : _f.message,
                  label: "Seasons",
                  name: "season",
                  onCreateSeason: handleCreateSeason,
                  options: allSeasonOptions,
                  placeholder: "Select or create...",
                  value: (_g = currentValues == null ? void 0 : currentValues.season) != null ? _g : null
                }), /* @__PURE__ */jsx(FormFieldInputCollaborations, {
                  control,
                  disabled: formUpdating,
                  error: (_h = errors == null ? void 0 : errors.season) == null ? void 0 : _h.message,
                  label: "Drops",
                  name: "collaboration",
                  onCreateSeason: handleCreateCollaboration,
                  options: allCollaborationOptions,
                  placeholder: "Select or create...",
                  value: (_i = currentValues == null ? void 0 : currentValues.collaboration) != null ? _i : null
                }), /* @__PURE__ */jsx(ProductSelector, {
                  onChange: updatedValue => {
                    setValue("primaryProducts", updatedValue, {
                      shouldDirty: true
                    });
                  },
                  error: (_j = errors.products) == null ? void 0 : _j.message,
                  value: (_k = currentValues == null ? void 0 : currentValues.products) != null ? _k : [],
                  labelDescription: "Add products to image",
                  label: "Primary Products",
                  name: "primaryProducts"
                }), /* @__PURE__ */jsx(ProductSelector, {
                  onChange: updatedValue => {
                    setValue("secondaryProducts", updatedValue, {
                      shouldDirty: true
                    });
                  },
                  error: (_l = errors.products) == null ? void 0 : _l.message,
                  value: (_m = currentValues == null ? void 0 : currentValues.products) != null ? _m : [],
                  labelDescription: "Add products to image",
                  label: "Secondary Products",
                  name: "secondaryProducts"
                }), /* @__PURE__ */jsx(FormFieldInputText, {
                  ...register("altText"),
                  disabled: formUpdating,
                  error: (_n = errors == null ? void 0 : errors.altText) == null ? void 0 : _n.message,
                  label: "Alt Text",
                  name: "altText",
                  value: currentValues == null ? void 0 : currentValues.altText
                })]
              })
            }), /* @__PURE__ */jsx(TabPanel, {
              "aria-labelledby": "references",
              hidden: tabSection !== "references",
              id: "references-panel"
            })]
          })]
        })
      })
    }), children]
  });
};
var __freeze$b = Object.freeze;
var __defProp$c = Object.defineProperty;
var __template$b = (cooked, raw) => __freeze$b(__defProp$c(cooked, "raw", {
  value: __freeze$b(raw || cooked.slice())
}));
var _a$b;
const DialogSeasonEdit = props => {
  var _a2;
  const {
    children,
    dialog: {
      id,
      seasonId
    }
  } = props;
  const client = useVersionedClient();
  const dispatch = useDispatch();
  const seasonItem = useTypedSelector(state => selectSeasonById(state, String(seasonId)));
  const [seasonSnapshot, setSeasonSnapshot] = useState(seasonItem == null ? void 0 : seasonItem.season);
  const currentTag = seasonItem ? seasonItem == null ? void 0 : seasonItem.season : seasonSnapshot;
  const generateDefaultValues = season => {
    var _a3;
    return {
      name: ((_a3 = season == null ? void 0 : season.name) == null ? void 0 : _a3.current) || ""
    };
  };
  const {
    // Read the formState before render to subscribe the form state through Proxy
    formState: {
      errors,
      isDirty,
      isValid
    },
    handleSubmit,
    register,
    reset,
    setError
  } = useForm({
    defaultValues: generateDefaultValues(seasonItem == null ? void 0 : seasonItem.season),
    mode: "onChange",
    resolver: zodResolver(tagFormSchema)
  });
  const formUpdating = !seasonItem || (seasonItem == null ? void 0 : seasonItem.updating);
  const handleClose = () => {
    dispatch(dialogActions.remove({
      id
    }));
  };
  const onSubmit = formData => {
    var _a3;
    if (!(seasonItem == null ? void 0 : seasonItem.season)) {
      return;
    }
    const sanitizedFormData = sanitizeFormData(formData);
    dispatch(seasonActions.updateSeasonItemRequest({
      closeDialogId: (_a3 = seasonItem == null ? void 0 : seasonItem.season) == null ? void 0 : _a3._id,
      formData: {
        name: {
          _type: "slug",
          current: sanitizedFormData.name
        }
      },
      season: seasonItem == null ? void 0 : seasonItem.season
    }));
  };
  const handleDelete = () => {
    var _a3;
    if (!(seasonItem == null ? void 0 : seasonItem.season)) {
      return;
    }
    dispatch(dialogActions.showConfirmDeleteTag({
      closeDialogId: (_a3 = seasonItem == null ? void 0 : seasonItem.season) == null ? void 0 : _a3._id,
      tag: seasonItem == null ? void 0 : seasonItem.season
    }));
  };
  const handleSeasonUpdate = useCallback(update => {
    var _a3;
    const {
      result,
      transition
    } = update;
    if (result && transition === "update") {
      setSeasonSnapshot(result);
      reset(generateDefaultValues(result));
      dispatch(dialogActions.remove({
        id: (_a3 = seasonItem == null ? void 0 : seasonItem.season) == null ? void 0 : _a3._id
      }));
    }
  }, [reset]);
  useEffect(() => {
    var _a3;
    if (seasonItem == null ? void 0 : seasonItem.error) {
      setError("name", {
        message: (_a3 = seasonItem.error) == null ? void 0 : _a3.message
      });
    }
  }, [setError, seasonItem.error]);
  useEffect(() => {
    if (!(seasonItem == null ? void 0 : seasonItem.season)) {
      return void 0;
    }
    const subscriptionAsset = client.listen(groq(_a$b || (_a$b = __template$b(["*[_id == $id]"]))), {
      id: seasonItem == null ? void 0 : seasonItem.season._id
    }).subscribe(handleSeasonUpdate);
    return () => {
      subscriptionAsset == null ? void 0 : subscriptionAsset.unsubscribe();
    };
  }, [client, handleSeasonUpdate, seasonItem == null ? void 0 : seasonItem.season]);
  const Footer = () => {
    var _a3;
    return /* @__PURE__ */jsx(Box, {
      padding: 3,
      children: /* @__PURE__ */jsxs(Flex, {
        justify: "space-between",
        children: [/* @__PURE__ */jsx(Button, {
          disabled: formUpdating,
          fontSize: 1,
          mode: "bleed",
          onClick: handleDelete,
          text: "Delete",
          tone: "critical"
        }), /* @__PURE__ */jsx(FormSubmitButton, {
          disabled: formUpdating || !isDirty || !isValid,
          isValid,
          lastUpdated: (_a3 = seasonItem == null ? void 0 : seasonItem.season) == null ? void 0 : _a3._updatedAt,
          onClick: handleSubmit(onSubmit)
        })]
      })
    });
  };
  if (!currentTag) {
    return null;
  }
  return /* @__PURE__ */jsxs(Dialog, {
    footer: /* @__PURE__ */jsx(Footer, {}),
    header: "Edit Tag",
    id,
    onClose: handleClose,
    width: 1,
    children: [/* @__PURE__ */jsxs(Box, {
      as: "form",
      padding: 4,
      onSubmit: handleSubmit(onSubmit),
      children: [!seasonItem && /* @__PURE__ */jsx(Card, {
        marginBottom: 3,
        padding: 3,
        radius: 2,
        shadow: 1,
        tone: "critical",
        children: /* @__PURE__ */jsx(Text, {
          size: 1,
          children: "This tag cannot be found \u2013 it may have been deleted."
        })
      }), /* @__PURE__ */jsx("button", {
        style: {
          display: "none"
        },
        tabIndex: -1,
        type: "submit"
      }), /* @__PURE__ */jsx(FormFieldInputText, {
        ...register("name"),
        disabled: formUpdating,
        error: (_a2 = errors == null ? void 0 : errors.name) == null ? void 0 : _a2.message,
        label: "Name",
        name: "name"
      })]
    }), children]
  });
};
const DialogSeasonCreate = props => {
  var _a;
  const {
    children,
    dialog: {
      id
    }
  } = props;
  const dispatch = useDispatch();
  const creating = useTypedSelector(state => state.seasons.creating);
  const creatingError = useTypedSelector(state => state.seasons.creatingError);
  const {
    // Read the formState before render to subscribe the form state through Proxy
    formState: {
      errors,
      isDirty,
      isValid
    },
    handleSubmit,
    register,
    setError
  } = useForm({
    defaultValues: {
      name: ""
    },
    mode: "onChange",
    resolver: zodResolver(tagFormSchema)
  });
  const formUpdating = creating;
  const handleClose = () => {
    dispatch(dialogActions.clear());
  };
  const onSubmit = formData => {
    const sanitizedFormData = sanitizeFormData(formData);
    dispatch(seasonActions.createRequest({
      name: sanitizedFormData.name
    }));
    dispatch(dialogActions.clear());
  };
  useEffect(() => {
    if (creatingError) {
      setError("name", {
        message: creatingError == null ? void 0 : creatingError.message
      });
    }
  }, [creatingError, setError]);
  const Footer = () => /* @__PURE__ */jsx(Box, {
    padding: 3,
    children: /* @__PURE__ */jsx(Flex, {
      justify: "flex-end",
      children: /* @__PURE__ */jsx(FormSubmitButton, {
        disabled: formUpdating || !isDirty || !isValid,
        isValid,
        onClick: handleSubmit(onSubmit)
      })
    })
  });
  return /* @__PURE__ */jsxs(Dialog, {
    footer: /* @__PURE__ */jsx(Footer, {}),
    header: "Create Season",
    id,
    onClose: handleClose,
    width: 1,
    children: [/* @__PURE__ */jsxs(Box, {
      as: "form",
      padding: 4,
      onSubmit: handleSubmit(onSubmit),
      children: [/* @__PURE__ */jsx("button", {
        style: {
          display: "none"
        },
        tabIndex: -1,
        type: "submit"
      }), /* @__PURE__ */jsx(FormFieldInputText, {
        ...register("name"),
        disabled: formUpdating,
        error: (_a = errors == null ? void 0 : errors.name) == null ? void 0 : _a.message,
        label: "Name",
        name: "name"
      })]
    }), children]
  });
};
var __freeze$a = Object.freeze;
var __defProp$b = Object.defineProperty;
var __template$a = (cooked, raw) => __freeze$a(__defProp$b(cooked, "raw", {
  value: __freeze$a(raw || cooked.slice())
}));
var _a$a;
const DialogCollaborationEdit = props => {
  var _a2;
  const {
    children,
    dialog: {
      id,
      collaborationId
    }
  } = props;
  const client = useVersionedClient();
  const dispatch = useDispatch();
  const collaborationItem = useTypedSelector(state => selectCollaborationById(state, String(collaborationId)));
  const [collaborationSnapshot, setCollaborationSnapshot] = useState(collaborationItem == null ? void 0 : collaborationItem.collaboration);
  const currentCollaboration = collaborationItem ? collaborationItem == null ? void 0 : collaborationItem.collaboration : collaborationSnapshot;
  const generateDefaultValues = collaboration => {
    var _a3;
    return {
      name: ((_a3 = collaboration == null ? void 0 : collaboration.name) == null ? void 0 : _a3.current) || ""
    };
  };
  const {
    // Read the formState before render to subscribe the form state through Proxy
    formState: {
      errors,
      isDirty,
      isValid
    },
    handleSubmit,
    register,
    reset,
    setError
  } = useForm({
    defaultValues: generateDefaultValues(collaborationItem == null ? void 0 : collaborationItem.collaboration),
    mode: "onChange",
    resolver: zodResolver(tagFormSchema)
  });
  const formUpdating = !collaborationItem || (collaborationItem == null ? void 0 : collaborationItem.updating);
  const handleClose = () => {
    dispatch(dialogActions.remove({
      id
    }));
  };
  const onSubmit = formData => {
    var _a3;
    if (!(collaborationItem == null ? void 0 : collaborationItem.collaboration)) {
      return;
    }
    const sanitizedFormData = sanitizeFormData(formData);
    dispatch(collaborationActions.updateCollaborationItemRequest({
      closeDialogId: (_a3 = collaborationItem == null ? void 0 : collaborationItem.collaboration) == null ? void 0 : _a3._id,
      formData: {
        name: {
          _type: "slug",
          current: sanitizedFormData.name
        }
      },
      collaboration: collaborationItem == null ? void 0 : collaborationItem.collaboration
    }));
  };
  const handleDelete = () => {
    var _a3;
    if (!(collaborationItem == null ? void 0 : collaborationItem.collaboration)) {
      return;
    }
    dispatch(dialogActions.showConfirmDeleteCollaboration({
      closeDialogId: (_a3 = collaborationItem == null ? void 0 : collaborationItem.collaboration) == null ? void 0 : _a3._id,
      collaboration: collaborationItem == null ? void 0 : collaborationItem.collaboration
    }));
  };
  const handleCollaborationUpdate = useCallback(update => {
    var _a3;
    const {
      result,
      transition
    } = update;
    if (result && transition === "update") {
      setCollaborationSnapshot(result);
      reset(generateDefaultValues(result));
      dispatch(dialogActions.remove({
        id: (_a3 = collaborationItem == null ? void 0 : collaborationItem.collaboration) == null ? void 0 : _a3._id
      }));
    }
  }, [reset]);
  useEffect(() => {
    var _a3;
    if (collaborationItem == null ? void 0 : collaborationItem.error) {
      setError("name", {
        message: (_a3 = collaborationItem.error) == null ? void 0 : _a3.message
      });
    }
  }, [setError, collaborationItem.error]);
  useEffect(() => {
    if (!(collaborationItem == null ? void 0 : collaborationItem.collaboration)) {
      return void 0;
    }
    const subscriptionAsset = client.listen(groq(_a$a || (_a$a = __template$a(["*[_id == $id]"]))), {
      id: collaborationItem == null ? void 0 : collaborationItem.collaboration._id
    }).subscribe(handleCollaborationUpdate);
    return () => {
      subscriptionAsset == null ? void 0 : subscriptionAsset.unsubscribe();
    };
  }, [client, handleCollaborationUpdate, collaborationItem == null ? void 0 : collaborationItem.collaboration]);
  const Footer = () => {
    var _a3;
    return /* @__PURE__ */jsx(Box, {
      padding: 3,
      children: /* @__PURE__ */jsxs(Flex, {
        justify: "space-between",
        children: [/* @__PURE__ */jsx(Button, {
          disabled: formUpdating,
          fontSize: 1,
          mode: "bleed",
          onClick: handleDelete,
          text: "Delete",
          tone: "critical"
        }), /* @__PURE__ */jsx(FormSubmitButton, {
          disabled: formUpdating || !isDirty || !isValid,
          isValid,
          lastUpdated: (_a3 = collaborationItem == null ? void 0 : collaborationItem.collaboration) == null ? void 0 : _a3._updatedAt,
          onClick: handleSubmit(onSubmit)
        })]
      })
    });
  };
  if (!currentCollaboration) {
    return null;
  }
  return /* @__PURE__ */jsxs(Dialog, {
    footer: /* @__PURE__ */jsx(Footer, {}),
    header: "Edit Collaboration",
    id,
    onClose: handleClose,
    width: 1,
    children: [/* @__PURE__ */jsxs(Box, {
      as: "form",
      padding: 4,
      onSubmit: handleSubmit(onSubmit),
      children: [!collaborationItem && /* @__PURE__ */jsx(Card, {
        marginBottom: 3,
        padding: 3,
        radius: 2,
        shadow: 1,
        tone: "critical",
        children: /* @__PURE__ */jsx(Text, {
          size: 1,
          children: "This collaboration cannot be found \u2013 it may have been deleted."
        })
      }), /* @__PURE__ */jsx("button", {
        style: {
          display: "none"
        },
        tabIndex: -1,
        type: "submit"
      }), /* @__PURE__ */jsx(FormFieldInputText, {
        ...register("name"),
        disabled: formUpdating,
        error: (_a2 = errors == null ? void 0 : errors.name) == null ? void 0 : _a2.message,
        label: "Name",
        name: "name"
      })]
    }), children]
  });
};
const DialogCollaborationCreate = props => {
  var _a;
  const {
    children,
    dialog: {
      id
    }
  } = props;
  const dispatch = useDispatch();
  const creating = useTypedSelector(state => state.collaborations.creating);
  const creatingError = useTypedSelector(state => state.collaborations.creatingError);
  const {
    // Read the formState before render to subscribe the form state through Proxy
    formState: {
      errors,
      isDirty,
      isValid
    },
    handleSubmit,
    register,
    setError
  } = useForm({
    defaultValues: {
      name: ""
    },
    mode: "onChange",
    resolver: zodResolver(tagFormSchema)
  });
  const formUpdating = creating;
  const handleClose = () => {
    dispatch(dialogActions.clear());
  };
  const onSubmit = formData => {
    const sanitizedFormData = sanitizeFormData(formData);
    dispatch(collaborationActions.createRequest({
      name: sanitizedFormData.name
    }));
    dispatch(dialogActions.clear());
  };
  useEffect(() => {
    if (creatingError) {
      setError("name", {
        message: creatingError == null ? void 0 : creatingError.message
      });
    }
  }, [creatingError, setError]);
  const Footer = () => /* @__PURE__ */jsx(Box, {
    padding: 3,
    children: /* @__PURE__ */jsx(Flex, {
      justify: "flex-end",
      children: /* @__PURE__ */jsx(FormSubmitButton, {
        disabled: formUpdating || !isDirty || !isValid,
        isValid,
        onClick: handleSubmit(onSubmit)
      })
    })
  });
  return /* @__PURE__ */jsxs(Dialog, {
    footer: /* @__PURE__ */jsx(Footer, {}),
    header: "Create Collaboration",
    id,
    onClose: handleClose,
    width: 1,
    children: [/* @__PURE__ */jsxs(Box, {
      as: "form",
      padding: 4,
      onSubmit: handleSubmit(onSubmit),
      children: [/* @__PURE__ */jsx("button", {
        style: {
          display: "none"
        },
        tabIndex: -1,
        type: "submit"
      }), /* @__PURE__ */jsx(FormFieldInputText, {
        ...register("name"),
        disabled: formUpdating,
        error: (_a = errors == null ? void 0 : errors.name) == null ? void 0 : _a.message,
        label: "Name",
        name: "name"
      })]
    }), children]
  });
};
const Dialogs = () => {
  const currentDialogs = useTypedSelector(state => state.dialog.items);
  const renderDialogs = (dialogs, index) => {
    if (dialogs.length === 0 || index >= dialogs.length) {
      return null;
    }
    const dialog = dialogs[index];
    const childDialogs = renderDialogs(dialogs, index + 1);
    if (dialog.type === "assetEdit") {
      return /* @__PURE__ */jsx(DialogAssetEdit, {
        dialog,
        children: childDialogs
      }, index);
    }
    if (dialog.type === "massEdit") {
      return /* @__PURE__ */jsx(DialogMassAssetEdit, {
        dialog,
        children: childDialogs
      }, index);
    }
    if (dialog.type === "confirm") {
      return /* @__PURE__ */jsx(DialogConfirm, {
        dialog,
        children: childDialogs
      }, index);
    }
    if (dialog.type === "searchFacets") {
      return /* @__PURE__ */jsx(DialogSearchFacets, {
        dialog,
        children: childDialogs
      }, index);
    }
    if (dialog.type === "tagCreate") {
      return /* @__PURE__ */jsx(DialogTagCreate, {
        dialog,
        children: childDialogs
      }, index);
    }
    if (dialog.type === "seasonCreate") {
      return /* @__PURE__ */jsx(DialogSeasonCreate, {
        dialog,
        children: childDialogs
      }, index);
    }
    if (dialog.type === "collaborationCreate") {
      return /* @__PURE__ */jsx(DialogCollaborationCreate, {
        dialog,
        children: childDialogs
      }, index);
    }
    if (dialog.type === "tagEdit") {
      return /* @__PURE__ */jsx(DialogTagEdit, {
        dialog,
        children: childDialogs
      }, index);
    }
    if (dialog.type === "seasonEdit") {
      return /* @__PURE__ */jsx(DialogSeasonEdit, {
        dialog,
        children: childDialogs
      }, index);
    }
    if (dialog.type === "collaborationEdit") {
      return /* @__PURE__ */jsx(DialogCollaborationEdit, {
        dialog,
        children: childDialogs
      }, index);
    }
    if (dialog.type === "tags") {
      return /* @__PURE__ */jsx(DialogTags, {
        dialog,
        children: childDialogs
      }, index);
    }
    return null;
  };
  return renderDialogs(currentDialogs, 0);
};
const DropzoneDispatchContext = createContext(void 0);
const DropzoneDispatchProvider = props => {
  const {
    children,
    open
  } = props;
  const contextValue = {
    open
  };
  return /* @__PURE__ */jsx(DropzoneDispatchContext.Provider, {
    value: contextValue,
    children
  });
};
const useDropzoneActions = () => {
  const context = useContext(DropzoneDispatchContext);
  if (context === void 0) {
    throw new Error("useDropzoneActions must be used within an DropzoneDispatchProvider");
  }
  return context;
};
const Header = props => {
  const {
    onClose
  } = props;
  const {
    open
  } = useDropzoneActions();
  const {
    onSelect
  } = useAssetSourceActions();
  const assetTypes = useTypedSelector(state => state.assets.assetTypes);
  const selectedDocument = useTypedSelector(state => state.selected.document);
  return /* @__PURE__ */jsx(Box, {
    paddingY: 2,
    children: /* @__PURE__ */jsxs(Flex, {
      align: "center",
      justify: "space-between",
      children: [/* @__PURE__ */jsx(Box, {
        flex: 1,
        marginX: 3,
        children: /* @__PURE__ */jsxs(Inline, {
          style: {
            whiteSpace: "nowrap"
          },
          children: [/* @__PURE__ */jsx(Text, {
            textOverflow: "ellipsis",
            weight: "semibold",
            children: /* @__PURE__ */jsx("span", {
              children: onSelect ? "Insert ".concat(assetTypes.join(" or ")) : "Browse Assets"
            })
          }), selectedDocument && /* @__PURE__ */jsx(Box, {
            display: ["none", "none", "block"],
            children: /* @__PURE__ */jsxs(Text, {
              children: [/* @__PURE__ */jsx("span", {
                style: {
                  margin: "0 0.5em"
                },
                children: /* @__PURE__ */jsx(Icon, {
                  symbol: "arrow-right"
                })
              }), /* @__PURE__ */jsx("span", {
                style: {
                  textTransform: "capitalize"
                },
                children: selectedDocument._type
              })]
            })
          })]
        })
      }), /* @__PURE__ */jsxs(Flex, {
        marginX: 2,
        children: [/* @__PURE__ */jsx(Button, {
          fontSize: 1,
          icon: UploadIcon,
          mode: "bleed",
          onClick: open,
          text: "Upload ".concat(assetTypes.length === 1 ? pluralize(assetTypes[0]) : "assets"),
          tone: "primary"
        }), onClose && /* @__PURE__ */jsx(Box, {
          style: {
            flexShrink: 0
          },
          children: /* @__PURE__ */jsx(Button, {
            disabled: !onClose,
            icon: CloseIcon,
            mode: "bleed",
            onClick: onClose,
            radius: 2
          })
        })]
      })]
    })
  });
};
const useBreakpointIndex = () => {
  var _a, _b;
  const mediaQueryLists = (_b = (_a = studioTheme) == null ? void 0 : _a.container) == null ? void 0 : _b.map(width => window.matchMedia("(max-width: ".concat(width, "px)")));
  const getBreakpointIndex = () => mediaQueryLists.findIndex(mql => mql.matches);
  const [value, setValue] = useState(getBreakpointIndex());
  useEffect(() => {
    const handleBreakpoint = () => {
      setValue(getBreakpointIndex);
    };
    mediaQueryLists.forEach(mql => {
      try {
        mql.addEventListener("change", handleBreakpoint);
      } catch (err) {
        try {
          mql.addListener(handleBreakpoint);
        } catch (_err) {}
      }
    });
    return () => {
      try {
        mediaQueryLists.forEach(mql => mql.removeEventListener("change", handleBreakpoint));
      } catch (err) {
        try {
          mediaQueryLists.forEach(mql => mql.removeListener(handleBreakpoint));
        } catch (_err) {}
      }
    };
  }, []);
  return value;
};
const selectCombinedItems = createSelector([state => state.assets.allIds, state => state.uploads.allIds], (assetIds, uploadIds) => {
  const assetItems = assetIds.map(id => ({
    id,
    type: "asset"
  }));
  const uploadItems = uploadIds.map(id => ({
    id,
    type: "upload"
  }));
  const combinedItems = [...uploadItems, ...assetItems];
  return combinedItems;
});
var __freeze$9 = Object.freeze;
var __defProp$a = Object.defineProperty;
var __template$9 = (cooked, raw) => __freeze$9(__defProp$a(cooked, "raw", {
  value: __freeze$9(raw || cooked.slice())
}));
var _a$9, _b$6, _c$1, _d;
const CardWrapper$1 = styled(Flex)(_a$9 || (_a$9 = __template$9(["\n  box-sizing: border-box;\n  height: 100%;\n  overflow: hidden;\n  position: relative;\n  width: 100%;\n"])));
const CardContainer = styled(Flex)(_ref83 => {
  let {
    picked,
    theme,
    updating
  } = _ref83;
  var _a2, _b2, _c2, _d2;
  return css(_c$1 || (_c$1 = __template$9(["\n      border: 1px solid transparent;\n      height: 100%;\n      pointer-events: ", ";\n      position: relative;\n      transition: all 300ms;\n      user-select: none;\n      width: 100%;\n\n      border: ", ";\n\n      ", "\n    "])), updating ? "none" : "auto", picked ? "1px solid ".concat((_d2 = (_c2 = (_b2 = (_a2 = theme == null ? void 0 : theme.sanity) == null ? void 0 : _a2.color) == null ? void 0 : _b2.spot) == null ? void 0 : _c2.orange) != null ? _d2 : "orange", " !important") : "1px solid inherit", !updating && css(_b$6 || (_b$6 = __template$9(["\n        @media (hover: hover) and (pointer: fine) {\n          &:hover {\n            border: 1px solid var(--card-border-color);\n          }\n        }\n      "]))));
});
const ContextActionContainer$2 = styled(Flex)(_ref84 => {
  let {
    scheme
  } = _ref84;
  return css(_d || (_d = __template$9(["\n    cursor: pointer;\n    height: ", "px;\n    transition: all 300ms;\n    @media (hover: hover) and (pointer: fine) {\n      &:hover {\n        background: ", ";\n      }\n    }\n  "])), PANEL_HEIGHT, getSchemeColor(scheme, "bg"));
});
const StyledWarningOutlineIcon = styled(WarningFilledIcon)(_ref85 => {
  let {
    theme
  } = _ref85;
  return {
    color: theme.sanity.color.spot.red
  };
});
const CardAsset = props => {
  var _a2, _b2, _c2;
  const {
    id,
    selected
  } = props;
  const {
    scheme
  } = useColorScheme();
  const shiftPressed = useKeyPress("shift");
  const dispatch = useDispatch();
  const lastPicked = useTypedSelector(state => state.assets.lastPicked);
  const item = useTypedSelector(state => selectAssetById(state, id));
  const asset = item == null ? void 0 : item.asset;
  const error = item == null ? void 0 : item.error;
  const isOpaque = (_b2 = (_a2 = item == null ? void 0 : item.asset) == null ? void 0 : _a2.metadata) == null ? void 0 : _b2.isOpaque;
  const picked = item == null ? void 0 : item.picked;
  const updating = item == null ? void 0 : item.updating;
  const {
    onSelect
  } = useAssetSourceActions();
  if (!asset) {
    return null;
  }
  const handleAssetClick = e => {
    e.stopPropagation();
    if (onSelect) {
      onSelect([{
        kind: "assetDocumentId",
        value: asset._id
      }]);
    } else if (shiftPressed.current) {
      if (picked) {
        dispatch(assetsActions.pick({
          assetId: asset._id,
          picked: !picked
        }));
      } else {
        dispatch(assetsActions.pickRange({
          startId: lastPicked || asset._id,
          endId: asset._id
        }));
      }
    } else {
      dispatch(dialogActions.showAssetEdit({
        assetId: asset._id
      }));
    }
  };
  const handleContextActionClick = e => {
    e.stopPropagation();
    if (onSelect) {
      dispatch(dialogActions.showAssetEdit({
        assetId: asset._id
      }));
    } else if (shiftPressed.current && !picked) {
      dispatch(assetsActions.pickRange({
        startId: lastPicked || asset._id,
        endId: asset._id
      }));
    } else {
      dispatch(assetsActions.pick({
        assetId: asset._id,
        picked: !picked
      }));
    }
  };
  const opacityContainer = updating ? 0.5 : 1;
  const opacityPreview = selected || updating ? 0.25 : 1;
  return /* @__PURE__ */jsx(CardWrapper$1, {
    padding: 1,
    children: /* @__PURE__ */jsxs(CardContainer, {
      direction: "column",
      picked,
      updating: item.updating,
      children: [/* @__PURE__ */jsxs(Box, {
        flex: 1,
        style: {
          cursor: selected ? "default" : "pointer",
          position: "relative"
        },
        children: [/* @__PURE__ */jsxs("div", {
          onClick: handleAssetClick,
          style: {
            height: "100%",
            opacity: opacityPreview
          },
          children: [isFileAsset(asset) && /* @__PURE__ */jsx(FileIcon, {
            extension: asset.extension,
            width: "80px"
          }), isImageAsset(asset) && /* @__PURE__ */jsx(Image$1, {
            draggable: false,
            scheme,
            showCheckerboard: !isOpaque,
            src: imageDprUrl(asset, {
              height: 250,
              width: 250
            }),
            style: {
              draggable: false,
              transition: "opacity 1000ms"
            }
          })]
        }), selected && !updating && /* @__PURE__ */jsx(Flex, {
          align: "center",
          justify: "center",
          style: {
            height: "100%",
            left: 0,
            opacity: opacityContainer,
            position: "absolute",
            top: 0,
            width: "100%"
          },
          children: /* @__PURE__ */jsx(Text, {
            size: 2,
            children: /* @__PURE__ */jsx(CheckmarkCircleIcon, {})
          })
        }), updating && /* @__PURE__ */jsx(Flex, {
          align: "center",
          justify: "center",
          style: {
            height: "100%",
            left: 0,
            position: "absolute",
            top: 0,
            width: "100%"
          },
          children: /* @__PURE__ */jsx(Spinner, {})
        })]
      }), /* @__PURE__ */jsxs(ContextActionContainer$2, {
        align: "center",
        onClick: handleContextActionClick,
        paddingX: 1,
        scheme,
        style: {
          opacity: opacityContainer
        },
        children: [onSelect ? /* @__PURE__ */jsx(EditIcon, {
          style: {
            flexShrink: 0,
            opacity: 0.5
          }
        }) : /* @__PURE__ */jsx(Checkbox, {
          checked: picked,
          readOnly: true,
          style: {
            flexShrink: 0,
            pointerEvents: "none",
            transform: "scale(0.8)"
          }
        }), /* @__PURE__ */jsx(Box, {
          marginLeft: 2,
          children: /* @__PURE__ */jsx(Text, {
            muted: true,
            style: {
              textTransform: "capitalize"
            },
            size: 0,
            textOverflow: "ellipsis",
            children: (_c2 = asset == null ? void 0 : asset.title) != null ? _c2 : asset.originalFilename
          })
        })]
      }), error && /* @__PURE__ */jsx(Box, {
        padding: 3,
        style: {
          position: "absolute",
          right: 0,
          top: 0
        },
        children: /* @__PURE__ */jsx(Tooltip, {
          content: /* @__PURE__ */jsx(Container$2, {
            padding: 2,
            width: 0,
            children: /* @__PURE__ */jsx(Text, {
              size: 1,
              children: error
            })
          }),
          placement: "left",
          portal: true,
          children: /* @__PURE__ */jsx(Text, {
            size: 1,
            children: /* @__PURE__ */jsx(StyledWarningOutlineIcon, {
              color: "critical"
            })
          })
        })
      })]
    })
  });
};
var CardAsset$1 = memo(CardAsset);
const PREVIEW_WIDTH = 180;
const createBlob = img => {
  return new Promise(resolve => {
    const imageAspect = img.width / img.height;
    const canvas = document.createElement("canvas");
    canvas.width = PREVIEW_WIDTH;
    canvas.height = Math.max(PREVIEW_WIDTH / imageAspect, 1);
    try {
      const ctx = canvas.getContext("2d");
      ctx == null ? void 0 : ctx.drawImage(img, 0, 0, PREVIEW_WIDTH, PREVIEW_WIDTH / imageAspect);
      canvas.toBlob(resolve, "image/jpeg");
    } catch (err) {
      console.warn("Unable to generate preview image:", err);
    }
  });
};
const createImageEl = file => {
  return new Promise(resolve => {
    const blobUrlLarge = window.URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      window.URL.revokeObjectURL(blobUrlLarge);
      resolve(img);
    };
    img.src = blobUrlLarge;
  });
};
const generatePreviewBlobUrl = async file => {
  const imageEl = await createImageEl(file);
  const blob = await createBlob(imageEl);
  if (!blob) {
    throw Error("Unable to generate file Blob");
  }
  return window.URL.createObjectURL(blob);
};
const generatePreviewBlobUrl$ = file => {
  return of(null).pipe(mergeMap(() => from(generatePreviewBlobUrl(file))));
};
const DEFAULT_CONCURRENCY = 4;
function remove(array, item) {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}
const createThrottler = function () {
  let concurrency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_CONCURRENCY;
  const currentSubscriptions = [];
  const pendingObservables = [];
  const ready$ = new Subject();
  function request(observable) {
    return new Observable(observer => {
      if (currentSubscriptions.length >= concurrency) {
        return scheduleAndWait$(observable).pipe(mergeMap(request)).subscribe(observer);
      }
      const subscription = observable.subscribe(observer);
      currentSubscriptions.push(subscription);
      return () => {
        remove(currentSubscriptions, subscription);
        remove(pendingObservables, observable);
        subscription.unsubscribe();
        while (pendingObservables.length > 0 && currentSubscriptions.length < concurrency) {
          ready$.next(pendingObservables.shift());
        }
      };
    });
  }
  function scheduleAndWait$(observable) {
    pendingObservables.push(observable);
    return ready$.asObservable().pipe(first(obs => obs === observable));
  }
  return request;
};
const withMaxConcurrency = function (func) {
  let concurrency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_CONCURRENCY;
  const throttler = createThrottler(concurrency);
  return function () {
    return from(throttler(func(...arguments)));
  };
};
const fetchExisting$ = (client, type, hash) => {
  return client.observable.fetch("*[_type == $documentType && sha1hash == $hash][0]", {
    documentType: type,
    hash
  });
};
const readFile$ = file => {
  return new Observable(subscriber => {
    const reader = new FileReader();
    reader.onload = () => {
      subscriber.next(reader.result);
      subscriber.complete();
    };
    reader.onerror = err => {
      subscriber.error(err);
    };
    reader.readAsArrayBuffer(file);
    return () => {
      reader.abort();
    };
  });
};
const hexFromBuffer = buffer => {
  return Array.prototype.map.call(new Uint8Array(buffer), x => "00".concat(x.toString(16)).slice(-2)).join("");
};
const hashFile$ = file => {
  if (!window.crypto || !window.crypto.subtle || !window.FileReader) {
    return throwError({
      message: "Unable to generate hash: uploads are only allowed in secure contexts",
      statusCode: 500
    });
  }
  return readFile$(file).pipe(mergeMap(arrayBuffer => window.crypto.subtle.digest("SHA-1", arrayBuffer)), map(hexFromBuffer));
};
const uploadSanityAsset$ = (client, assetType, file, hash) => {
  return of(null).pipe(
  // NOTE: the sanity api will still dedupe unique files, but this saves us from uploading the asset file entirely
  mergeMap(() => fetchExisting$(client, "sanity.".concat(assetType, "Asset"), hash)),
  // Cancel if the asset already exists
  mergeMap(existingAsset => {
    if (existingAsset) {
      return throwError({
        message: "Asset already exists",
        statusCode: 409
      });
    }
    return of(null);
  }), mergeMap(() => {
    return client.observable.assets.upload(assetType, file, {
      extract: ["blurhash", "exif", "location", "lqip", "palette"],
      preserveFilename: true
    }).pipe(map(event => event.type === "response" ? {
      // rewrite to a 'complete' event
      asset: event.body.document,
      id: event.body.document._id,
      type: "complete"
    } : event));
  }));
};
const uploadAsset$ = withMaxConcurrency(uploadSanityAsset$);
var __freeze$8 = Object.freeze;
var __defProp$9 = Object.defineProperty;
var __template$8 = (cooked, raw) => __freeze$8(__defProp$9(cooked, "raw", {
  value: __freeze$8(raw || cooked.slice())
}));
var _a$8;
const initialState$2 = {
  allIds: [],
  byIds: {}
};
const uploadsSlice = createSlice({
  name: "uploads",
  initialState: initialState$2,
  extraReducers: builder => {
    builder.addCase(UPLOADS_ACTIONS.uploadComplete, (state, action) => {
      const {
        asset
      } = action.payload;
      if (state.byIds[asset.sha1hash]) {
        state.byIds[asset.sha1hash].status = "complete";
      }
    });
  },
  reducers: {
    checkRequest(_state, _action) {},
    checkComplete(state, action) {
      const {
        results
      } = action.payload;
      const assetHashes = Object.keys(results);
      assetHashes.forEach(hash => {
        const deleteIndex = state.allIds.indexOf(hash);
        if (deleteIndex >= 0) {
          state.allIds.splice(deleteIndex, 1);
        }
        if (state.byIds[hash]) {
          const blobUrl = state.byIds[hash].objectUrl;
          if (blobUrl) {
            window.URL.revokeObjectURL(blobUrl);
          }
          delete state.byIds[hash];
        }
      });
    },
    previewReady(state, action) {
      const {
        blobUrl,
        hash
      } = action.payload;
      if (state.byIds[hash]) {
        state.byIds[hash].objectUrl = blobUrl;
      }
    },
    uploadCancel(state, action) {
      const {
        hash
      } = action.payload;
      const deleteIndex = state.allIds.indexOf(hash);
      if (deleteIndex >= 0) {
        state.allIds.splice(deleteIndex, 1);
      }
      if (state.byIds[hash]) {
        delete state.byIds[hash];
      }
    },
    uploadError(state, action) {
      const {
        hash
      } = action.payload;
      const deleteIndex = state.allIds.indexOf(hash);
      if (deleteIndex >= 0) {
        state.allIds.splice(deleteIndex, 1);
      }
      delete state.byIds[hash];
    },
    uploadRequest(_state, _action) {},
    uploadProgress(state, action) {
      const {
        event,
        uploadHash
      } = action.payload;
      state.byIds[uploadHash].percent = event.percent;
      state.byIds[uploadHash].status = "uploading";
    },
    uploadStart(state, action) {
      const {
        uploadItem
      } = action.payload;
      if (!state.allIds.includes(uploadItem.hash)) {
        state.allIds.push(uploadItem.hash);
      }
      state.byIds[uploadItem.hash] = uploadItem;
    }
  }
});
const uploadsAssetStartEpic = (action$, _state$, _ref86) => {
  let {
    client
  } = _ref86;
  return action$.pipe(filter(uploadsActions.uploadStart.match), mergeMap(action => {
    const {
      file,
      uploadItem
    } = action.payload;
    return merge(
    // Generate low res preview
    of(null).pipe(mergeMap(() => generatePreviewBlobUrl$(file)), mergeMap(url => {
      return of(uploadsActions.previewReady({
        blobUrl: url,
        hash: uploadItem.hash
      }));
    })),
    // Upload asset and receive progress / complete events
    of(null).pipe(
    // delay(500000), // debug uploads
    mergeMap(() => uploadAsset$(client, uploadItem.assetType, file, uploadItem.hash)), takeUntil(action$.pipe(filter(uploadsActions.uploadCancel.match), filter(v => v.payload.hash === uploadItem.hash))), mergeMap(event => {
      if ((event == null ? void 0 : event.type) === "complete") {
        return of(UPLOADS_ACTIONS.uploadComplete({
          asset: event.asset
        }));
      }
      if ((event == null ? void 0 : event.type) === "progress" && (event == null ? void 0 : event.stage) === "upload") {
        return of(uploadsActions.uploadProgress({
          event,
          uploadHash: uploadItem.hash
        }));
      }
      return empty();
    }), catchError(error => of(uploadsActions.uploadError({
      error: {
        message: (error == null ? void 0 : error.message) || "Internal error",
        statusCode: (error == null ? void 0 : error.statusCode) || 500
      },
      hash: uploadItem.hash
    })))));
  }));
};
const uploadsAssetUploadEpic = (action$, state$) => action$.pipe(filter(uploadsActions.uploadRequest.match), withLatestFrom(state$), mergeMap(_ref87 => {
  let [action, state] = _ref87;
  const {
    file,
    forceAsAssetType
  } = action.payload;
  return of(action).pipe(
  // Generate SHA1 hash from local file
  // This will throw in insecure contexts (non-localhost / https)
  mergeMap(() => hashFile$(file)),
  // Ignore if the file exists and is currently being uploaded
  filter(hash => {
    const exists = !!state.uploads.byIds[hash];
    return !exists;
  }),
  // Dispatch start action and begin upload process
  mergeMap(hash => {
    const assetType = forceAsAssetType || (file.type.indexOf("image") >= 0 ? "image" : "file");
    const uploadItem = {
      _type: "upload",
      assetType,
      hash,
      name: file.name,
      size: file.size,
      status: "queued"
    };
    return of(uploadsActions.uploadStart({
      file,
      uploadItem
    }));
  }));
}));
const uploadsCompleteQueueEpic = action$ => action$.pipe(filter(UPLOADS_ACTIONS.uploadComplete.match), mergeMap(action => {
  return of(uploadsActions.checkRequest({
    assets: [action.payload.asset]
  }));
}));
const uploadsCheckRequestEpic = (action$, state$, _ref88) => {
  let {
    client
  } = _ref88;
  return action$.pipe(filter(uploadsActions.checkRequest.match), withLatestFrom(state$), mergeMap(_ref89 => {
    let [action, state] = _ref89;
    const {
      assets
    } = action.payload;
    const documentIds = assets.map(asset => asset._id);
    const constructedFilter = constructFilter({
      assetTypes: state.assets.assetTypes,
      searchFacets: state.search.facets,
      searchQuery: state.search.query
    });
    const query = groq(_a$8 || (_a$8 = __template$8(["\n        *[", " && _id in $documentIds].sha1hash\n      "])), constructedFilter);
    return of(action).pipe(delay(1e3),
    // give Sanity some time to register the recently uploaded asset
    mergeMap(() => client.observable.fetch(query, {
      documentIds
    })), mergeMap(resultHashes => {
      const checkedResults = assets.reduce((acc, asset) => {
        acc[asset.sha1hash] = resultHashes.includes(asset.sha1hash) ? asset._id : null;
        return acc;
      }, {});
      return of(uploadsActions.checkComplete({
        results: checkedResults
      }),
      //
      assetsActions.insertUploads({
        results: checkedResults
      }));
    }));
  }));
};
const selectUploadsByIds = state => state.uploads.byIds;
const selectUploadsAllIds = state => state.uploads.allIds;
const selectUploadById = createSelector([state => state.uploads.byIds, (_state, uploadId) => uploadId], (byIds, uploadId) => byIds[uploadId]);
createSelector([selectUploadsByIds, selectUploadsAllIds], (byIds, allIds) => allIds.map(id => byIds[id]));
const uploadsActions = uploadsSlice.actions;
var uploadsReducer = uploadsSlice.reducer;
var __freeze$7 = Object.freeze;
var __defProp$8 = Object.defineProperty;
var __template$7 = (cooked, raw) => __freeze$7(__defProp$8(cooked, "raw", {
  value: __freeze$7(raw || cooked.slice())
}));
var _a$7;
const CardWrapper = styled(Flex)(_a$7 || (_a$7 = __template$7(["\n  box-sizing: border-box;\n  height: 100%;\n  overflow: hidden;\n  position: relative;\n  width: 100%;\n"])));
const CardUpload = props => {
  const {
    id
  } = props;
  const {
    scheme
  } = useColorScheme();
  const dispatch = useDispatch();
  const item = useTypedSelector(state => selectUploadById(state, id));
  if (!item) {
    return null;
  }
  const fileSize = filesize(item.size, {
    base: 10,
    round: 0
  });
  const percentLoaded = Math.round(item.percent || 0);
  const isComplete = item.status === "complete";
  const isUploading = item.status === "uploading";
  const isQueued = item.status === "queued";
  let status;
  if (isComplete) {
    status = "Verifying";
  }
  if (isUploading) {
    status = "".concat(percentLoaded, "%");
  }
  if (isQueued) {
    status = "Queued";
  }
  const handleCancelUpload = () => {
    dispatch(uploadsActions.uploadCancel({
      hash: item.hash
    }));
  };
  return /* @__PURE__ */jsx(CardWrapper, {
    padding: 1,
    children: /* @__PURE__ */jsxs(Flex, {
      direction: "column",
      flex: 1,
      style: {
        background: getSchemeColor(scheme, "bg"),
        border: "1px solid transparent",
        height: "100%",
        position: "relative"
      },
      children: [/* @__PURE__ */jsx("div", {
        style: {
          background: "var(--card-fg-color)",
          bottom: 0,
          height: "1px",
          left: 0,
          position: "absolute",
          width: "100%",
          transform: "scaleX(".concat(percentLoaded * 0.01, ")"),
          transformOrigin: "bottom left",
          transition: "all 1000ms ease-out"
        }
      }), /* @__PURE__ */jsxs(Box, {
        flex: 1,
        style: {
          position: "relative"
        },
        children: [item.assetType === "image" && (item == null ? void 0 : item.objectUrl) && /* @__PURE__ */jsx(Image$1, {
          draggable: false,
          scheme,
          src: item.objectUrl,
          style: {
            opacity: 0.4
          }
        }), item.assetType === "file" && /* @__PURE__ */jsx("div", {
          style: {
            height: "100%",
            opacity: 0.1
          },
          children: /* @__PURE__ */jsx(FileIcon, {
            width: "80px"
          })
        }), !isComplete && percentLoaded !== 100 && /* @__PURE__ */jsx(Flex, {
          align: "center",
          direction: "column",
          justify: "center",
          style: {
            height: "100%",
            left: 0,
            position: "absolute",
            top: 0,
            width: "100%"
          },
          children: /* @__PURE__ */jsx(Button, {
            fontSize: 4,
            icon: CloseIcon,
            mode: "bleed",
            onClick: handleCancelUpload,
            padding: 2,
            style: {
              background: "none",
              boxShadow: "none"
            },
            tone: "critical"
          })
        })]
      }), /* @__PURE__ */jsxs(Flex, {
        align: "center",
        justify: "space-between",
        paddingX: 2,
        style: {
          height: "".concat(PANEL_HEIGHT, "px")
        },
        children: [/* @__PURE__ */jsx(Box, {
          flex: 1,
          marginRight: 1,
          children: /* @__PURE__ */jsxs(Text, {
            size: 0,
            textOverflow: "ellipsis",
            children: [item.name, " (", fileSize, ")"]
          })
        }), /* @__PURE__ */jsx(Text, {
          size: 0,
          style: {
            flexShrink: 0
          },
          weight: "semibold",
          children: status
        })]
      })]
    })
  });
};
var __freeze$6 = Object.freeze;
var __defProp$7 = Object.defineProperty;
var __template$6 = (cooked, raw) => __freeze$6(__defProp$7(cooked, "raw", {
  value: __freeze$6(raw || cooked.slice())
}));
var _a$6, _b$5;
const CARD_HEIGHT = 220;
const CARD_WIDTH = 240;
const VirtualCell = memo(_ref90 => {
  let {
    item,
    selected
  } = _ref90;
  if ((item == null ? void 0 : item.type) === "asset") {
    return /* @__PURE__ */jsx(CardAsset$1, {
      id: item.id,
      selected
    });
  }
  if ((item == null ? void 0 : item.type) === "upload") {
    return /* @__PURE__ */jsx(CardUpload, {
      id: item.id
    });
  }
  return null;
});
const ItemContainer = styled.div(_a$6 || (_a$6 = __template$6(["\n  height: ", "px;\n  width: ", "px;\n"])), CARD_HEIGHT, CARD_WIDTH);
const ListContainer = styled.div(_b$5 || (_b$5 = __template$6(["\n  display: grid;\n  grid-template-columns: repeat(auto-fill, ", "px);\n  grid-template-rows: repeat(auto-fill, ", "px);\n  justify-content: center;\n  margin: 0 auto;\n"])), CARD_WIDTH, CARD_HEIGHT);
const AssetGridVirtualized = props => {
  const {
    items,
    onLoadMore
  } = props;
  const selectedAssets = useTypedSelector(state => state.selected.assets);
  const selectedIds = selectedAssets && selectedAssets.map(asset => asset._id) || [];
  const totalCount = items == null ? void 0 : items.length;
  if (totalCount === 0) {
    return null;
  }
  return /* @__PURE__ */jsx(VirtuosoGrid, {
    className: "media__custom-scrollbar",
    computeItemKey: index => {
      const item = items[index];
      return item == null ? void 0 : item.id;
    },
    components: {
      Item: ItemContainer,
      List: ListContainer
    },
    endReached: onLoadMore,
    itemContent: index => {
      const item = items[index];
      const selected = selectedIds.includes(item == null ? void 0 : item.id);
      return /* @__PURE__ */jsx(VirtualCell, {
        item,
        selected
      });
    },
    overscan: 48,
    style: {
      overflowX: "hidden",
      overflowY: "scroll"
    },
    totalCount
  });
};
const TableHeaderItem = props => {
  const {
    field,
    title
  } = props;
  const dispatch = useDispatch();
  const order = useTypedSelector(state => state.assets.order);
  const isActive = order.field === field;
  const handleClick = () => {
    if (!field || !title) {
      return;
    }
    if (isActive) {
      const direction = order.direction === "asc" ? "desc" : "asc";
      dispatch(assetsActions.orderSet({
        order: {
          field,
          direction
        }
      }));
    } else {
      dispatch(assetsActions.orderSet({
        order: {
          field,
          direction: "asc"
        }
      }));
    }
  };
  return /* @__PURE__ */jsx(Label, {
    muted: !field,
    size: 0,
    children: /* @__PURE__ */jsxs(Box, {
      onClick: field ? handleClick : void 0,
      style: {
        cursor: field ? "pointer" : "default",
        display: "inline",
        whiteSpace: "nowrap"
      },
      children: [/* @__PURE__ */jsx("span", {
        style: {
          marginRight: "0.4em"
        },
        children: title
      }), isActive && (order == null ? void 0 : order.direction) === "asc" && /* @__PURE__ */jsx(ChevronUpIcon, {}), isActive && (order == null ? void 0 : order.direction) === "desc" && /* @__PURE__ */jsx(ChevronDownIcon, {})]
    })
  });
};
var __freeze$5 = Object.freeze;
var __defProp$6 = Object.defineProperty;
var __template$5 = (cooked, raw) => __freeze$5(__defProp$6(cooked, "raw", {
  value: __freeze$5(raw || cooked.slice())
}));
var _a$5;
const ContextActionContainer$1 = styled(Flex)(_ref91 => {
  let {
    scheme
  } = _ref91;
  return css(_a$5 || (_a$5 = __template$5(["\n    cursor: pointer;\n    @media (hover: hover) and (pointer: fine) {\n      &:hover {\n        background: ", ";\n      }\n    }\n  "])), getSchemeColor(scheme, "bg"));
});
const TableHeader = () => {
  const {
    scheme
  } = useColorScheme();
  const dispatch = useDispatch();
  const fetching = useTypedSelector(state => state.assets.fetching);
  const itemsLength = useTypedSelector(selectAssetsLength);
  const numPickedAssets = useTypedSelector(selectAssetsPickedLength);
  const mediaIndex = useMediaIndex();
  const {
    onSelect
  } = useAssetSourceActions();
  const allSelected = numPickedAssets === itemsLength;
  const handleContextActionClick = e => {
    e.stopPropagation();
    if (allSelected) {
      dispatch(assetsActions.pickClear());
    } else {
      dispatch(assetsActions.pickAll());
    }
  };
  return /* @__PURE__ */jsxs(Grid, {
    style: {
      alignItems: "center",
      background: "var(--card-bg-color)",
      borderBottom: "1px solid var(--card-border-color)",
      gridColumnGap: mediaIndex < 3 ? 0 : "16px",
      gridTemplateColumns: GRID_TEMPLATE_COLUMNS.LARGE,
      height: mediaIndex < 3 ? 0 : "".concat(PANEL_HEIGHT, "px"),
      letterSpacing: "0.025em",
      position: "sticky",
      textTransform: "uppercase",
      top: 0,
      visibility: mediaIndex < 3 ? "hidden" : "visible",
      width: "100%",
      zIndex: 1
      // force stacking context
    },

    children: [onSelect ? /* @__PURE__ */jsx(TableHeaderItem, {}) : /* @__PURE__ */jsx(ContextActionContainer$1, {
      align: "center",
      justify: "center",
      onClick: handleContextActionClick,
      scheme,
      style: {
        height: "100%",
        position: "relative"
      },
      children: /* @__PURE__ */jsx(Checkbox, {
        checked: !fetching && allSelected,
        readOnly: true,
        style: {
          pointerEvents: "none",
          // TODO: consider alternative for usability
          transform: "scale(0.8)"
        }
      })
    }), /* @__PURE__ */jsx(TableHeaderItem, {}), /* @__PURE__ */jsx(TableHeaderItem, {
      field: "originalFilename",
      title: "Filename"
    }), /* @__PURE__ */jsx(TableHeaderItem, {
      title: "Resolution"
    }), /* @__PURE__ */jsx(TableHeaderItem, {
      field: "mimeType",
      title: "MIME type"
    }), /* @__PURE__ */jsx(TableHeaderItem, {
      field: "size",
      title: "Size"
    }), /* @__PURE__ */jsx(TableHeaderItem, {
      field: "_updatedAt",
      title: "Last updated"
    }), /* @__PURE__ */jsx(TableHeaderItem, {
      title: "References"
    }), /* @__PURE__ */jsx(TableHeaderItem, {})]
  });
};
var __freeze$4 = Object.freeze;
var __defProp$5 = Object.defineProperty;
var __template$4 = (cooked, raw) => __freeze$4(__defProp$5(cooked, "raw", {
  value: __freeze$4(raw || cooked.slice())
}));
var _a$4, _b$4, _c;
const REFERENCE_COUNT_VISIBILITY_DELAY = 750;
const ContainerGrid = styled(Grid)(_ref92 => {
  let {
    scheme,
    selected,
    updating
  } = _ref92;
  return css(_b$4 || (_b$4 = __template$4(["\n      align-items: center;\n      cursor: ", ";\n      height: 100%;\n      pointer-events: ", ";\n      user-select: none;\n      white-space: nowrap;\n\n      ", "\n    "])), selected ? "default" : "pointer", updating ? "none" : "auto", !updating && css(_a$4 || (_a$4 = __template$4(["\n        @media (hover: hover) and (pointer: fine) {\n          &:hover {\n            background: ", ";\n          }\n        }\n      "])), getSchemeColor(scheme, "bg")));
});
const ContextActionContainer = styled(Flex)(_ref93 => {
  let {
    scheme
  } = _ref93;
  return css(_c || (_c = __template$4(["\n    cursor: pointer;\n    @media (hover: hover) and (pointer: fine) {\n      &:hover {\n        background: ", ";\n      }\n    }\n  "])), getSchemeColor(scheme, "bg2"));
});
const StyledWarningIcon = styled(WarningFilledIcon)(_ref94 => {
  let {
    theme
  } = _ref94;
  return {
    color: theme.sanity.color.spot.red
  };
});
const TableRowAsset = props => {
  var _a2, _b2;
  const {
    id,
    selected
  } = props;
  const {
    scheme
  } = useColorScheme();
  const shiftPressed = useKeyPress("shift");
  const [referenceCountVisible, setReferenceCountVisible] = useState(false);
  const refCountVisibleTimeout = useRef();
  const dispatch = useDispatch();
  const lastPicked = useTypedSelector(state => state.assets.lastPicked);
  const item = useTypedSelector(state => selectAssetById(state, id));
  const mediaIndex = useMediaIndex();
  const asset = item == null ? void 0 : item.asset;
  const error = item == null ? void 0 : item.error;
  const isOpaque = (_b2 = (_a2 = item == null ? void 0 : item.asset) == null ? void 0 : _a2.metadata) == null ? void 0 : _b2.isOpaque;
  const picked = item == null ? void 0 : item.picked;
  const updating = item == null ? void 0 : item.updating;
  const {
    onSelect
  } = useAssetSourceActions();
  const handleContextActionClick = useCallback(e => {
    e.stopPropagation();
    if (!asset) return;
    if (onSelect) {
      dispatch(dialogActions.showAssetEdit({
        assetId: asset._id
      }));
    } else if (shiftPressed.current && !picked) {
      dispatch(assetsActions.pickRange({
        startId: lastPicked || asset._id,
        endId: asset._id
      }));
    } else {
      dispatch(assetsActions.pick({
        assetId: asset._id,
        picked: !picked
      }));
    }
  }, [asset, dispatch, lastPicked, onSelect, picked, shiftPressed]);
  const handleClick = useCallback(e => {
    e.stopPropagation();
    if (!asset) return;
    if (onSelect) {
      onSelect([{
        kind: "assetDocumentId",
        value: asset._id
      }]);
    } else if (shiftPressed.current) {
      if (picked) {
        dispatch(assetsActions.pick({
          assetId: asset._id,
          picked: !picked
        }));
      } else {
        dispatch(assetsActions.pickRange({
          startId: lastPicked || asset._id,
          endId: asset._id
        }));
      }
    } else {
      dispatch(dialogActions.showAssetEdit({
        assetId: asset._id
      }));
    }
  }, [asset, dispatch, lastPicked, onSelect, picked, shiftPressed]);
  const opacityCell = updating ? 0.5 : 1;
  const opacityPreview = selected || updating ? 0.1 : 1;
  useEffect(() => {
    refCountVisibleTimeout.current = setTimeout(() => setReferenceCountVisible(true), REFERENCE_COUNT_VISIBILITY_DELAY);
    return () => {
      if (refCountVisibleTimeout.current) {
        clearTimeout(refCountVisibleTimeout.current);
      }
    };
  }, []);
  if (!asset) {
    return null;
  }
  return /* @__PURE__ */jsxs(ContainerGrid, {
    onClick: selected ? void 0 : handleClick,
    scheme,
    selected,
    style: {
      gridColumnGap: mediaIndex < 3 ? 0 : "16px",
      gridRowGap: 0,
      gridTemplateColumns: mediaIndex < 3 ? GRID_TEMPLATE_COLUMNS.SMALL : GRID_TEMPLATE_COLUMNS.LARGE,
      gridTemplateRows: mediaIndex < 3 ? "auto" : "1fr"
    },
    updating: item.updating,
    children: [/* @__PURE__ */jsx(ContextActionContainer, {
      onClick: handleContextActionClick,
      scheme,
      style: {
        alignItems: "center",
        gridColumn: 1,
        gridRowStart: 1,
        gridRowEnd: "span 5",
        height: "100%",
        justifyContent: "center",
        opacity: opacityCell,
        position: "relative"
      },
      children: onSelect ? /* @__PURE__ */jsx(EditIcon, {
        style: {
          flexShrink: 0,
          opacity: 0.5
        }
      }) : /* @__PURE__ */jsx(Checkbox, {
        checked: picked,
        readOnly: true,
        style: {
          pointerEvents: "none",
          // TODO: consider alternative for usability
          transform: "scale(0.8)"
        }
      })
    }), /* @__PURE__ */jsx(Box, {
      style: {
        gridColumn: 2,
        gridRowStart: 1,
        gridRowEnd: "span 5",
        height: "90px",
        width: "100px"
      },
      children: /* @__PURE__ */jsxs(Flex, {
        align: "center",
        justify: "center",
        style: {
          height: "100%",
          position: "relative"
        },
        children: [/* @__PURE__ */jsxs(Box, {
          style: {
            height: "100%",
            opacity: opacityPreview,
            position: "relative"
          },
          children: [isFileAsset(asset) && /* @__PURE__ */jsx(FileIcon, {
            extension: asset.extension,
            width: "40px"
          }), isImageAsset(asset) && /* @__PURE__ */jsx(Image$1, {
            draggable: false,
            scheme,
            showCheckerboard: !isOpaque,
            src: imageDprUrl(asset, {
              height: 100,
              width: 100
            })
          })]
        }), updating && /* @__PURE__ */jsx(Flex, {
          align: "center",
          justify: "center",
          style: {
            height: "100%",
            left: 0,
            position: "absolute",
            top: 0,
            width: "100%"
          },
          children: /* @__PURE__ */jsx(Spinner, {})
        }), selected && !updating && /* @__PURE__ */jsx(Flex, {
          align: "center",
          justify: "center",
          style: {
            height: "100%",
            left: 0,
            position: "absolute",
            top: 0,
            width: "100%"
          },
          children: /* @__PURE__ */jsx(Text, {
            size: 2,
            children: /* @__PURE__ */jsx(CheckmarkCircleIcon, {})
          })
        })]
      })
    }), /* @__PURE__ */jsx(Box, {
      marginLeft: mediaIndex < 3 ? 3 : 0,
      style: {
        gridColumn: 3,
        gridRow: mediaIndex < 3 ? 2 : "auto",
        opacity: opacityCell
      },
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 1,
        style: {
          lineHeight: "2em"
        },
        textOverflow: "ellipsis",
        children: asset.originalFilename
      })
    }), /* @__PURE__ */jsx(Box, {
      marginLeft: mediaIndex < 3 ? 3 : 0,
      style: {
        gridColumn: mediaIndex < 3 ? 3 : 4,
        gridRow: mediaIndex < 3 ? 3 : "auto",
        opacity: opacityCell
      },
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 1,
        style: {
          lineHeight: "2em"
        },
        textOverflow: "ellipsis",
        children: isImageAsset(asset) && getAssetResolution(asset)
      })
    }), /* @__PURE__ */jsx(Box, {
      style: {
        display: mediaIndex < 3 ? "none" : "block",
        gridColumn: 5,
        gridRow: "auto",
        opacity: opacityCell
      },
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 1,
        style: {
          lineHeight: "2em"
        },
        textOverflow: "ellipsis",
        children: asset.mimeType
      })
    }), /* @__PURE__ */jsx(Box, {
      style: {
        display: mediaIndex < 3 ? "none" : "block",
        gridColumn: 6,
        gridRow: "auto",
        opacity: opacityCell
      },
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 1,
        style: {
          lineHeight: "2em"
        },
        textOverflow: "ellipsis",
        children: filesize(asset.size, {
          base: 10,
          round: 0
        })
      })
    }), /* @__PURE__ */jsx(Box, {
      marginLeft: mediaIndex < 3 ? 3 : 0,
      style: {
        gridColumn: mediaIndex < 3 ? 3 : 7,
        gridRow: mediaIndex < 3 ? 4 : "auto",
        opacity: opacityCell
      },
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 1,
        style: {
          lineHeight: "2em"
        },
        textOverflow: "ellipsis",
        children: formatRelative(new Date(asset._updatedAt), /* @__PURE__ */new Date())
      })
    }), /* @__PURE__ */jsx(Box, {
      style: {
        display: mediaIndex < 3 ? "none" : "block",
        gridColumn: 8,
        gridRow: "auto",
        opacity: opacityCell
      },
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 1,
        style: {
          lineHeight: "2em"
        },
        textOverflow: "ellipsis",
        children: referenceCountVisible ? /* @__PURE__ */jsx(WithReferringDocuments, {
          id,
          children: _ref95 => {
            let {
              isLoading,
              referringDocuments
            } = _ref95;
            const uniqueDocuments = getUniqueDocuments(referringDocuments);
            return isLoading ? /* @__PURE__ */jsx(Fragment, {
              children: "-"
            }) : /* @__PURE__ */jsx(Fragment, {
              children: Array.isArray(uniqueDocuments) ? uniqueDocuments.length : 0
            });
          }
        }) : /* @__PURE__ */jsx(Fragment, {
          children: "-"
        })
      })
    }), /* @__PURE__ */jsx(Flex, {
      align: "center",
      justify: "center",
      style: {
        gridColumn: mediaIndex < 3 ? 4 : 9,
        gridRowStart: "1",
        gridRowEnd: mediaIndex < 3 ? "span 5" : "auto",
        opacity: opacityCell
      },
      children: error && /* @__PURE__ */jsx(Box, {
        padding: 2,
        children: /* @__PURE__ */jsx(Tooltip, {
          content: /* @__PURE__ */jsx(Container$2, {
            padding: 2,
            width: 0,
            children: /* @__PURE__ */jsx(Text, {
              size: 1,
              children: error
            })
          }),
          placement: "left",
          portal: true,
          children: /* @__PURE__ */jsx(Text, {
            size: 1,
            children: /* @__PURE__ */jsx(StyledWarningIcon, {
              color: "critical"
            })
          })
        })
      })
    })]
  });
};
var TableRowAsset$1 = memo(TableRowAsset);
const TableRowUpload = props => {
  const {
    id
  } = props;
  const {
    scheme
  } = useColorScheme();
  const dispatch = useDispatch();
  const item = useTypedSelector(state => selectUploadById(state, id));
  const mediaIndex = useMediaIndex();
  if (!item) {
    return null;
  }
  const fileSize = filesize(item.size, {
    base: 10,
    round: 0
  });
  const percentLoaded = Math.round(item.percent || 0);
  const isComplete = item.status === "complete";
  const isUploading = item.status === "uploading";
  const isQueued = item.status === "queued";
  let status;
  if (isComplete) {
    status = "Verifying";
  }
  if (isUploading) {
    status = "".concat(percentLoaded, "%");
  }
  if (isQueued) {
    status = "Queued";
  }
  const handleCancelUpload = () => {
    dispatch(uploadsActions.uploadCancel({
      hash: item.hash
    }));
  };
  return /* @__PURE__ */jsxs(Grid, {
    style: {
      alignItems: "center",
      background: getSchemeColor(scheme, "bg"),
      gridColumnGap: mediaIndex < 3 ? 0 : "16px",
      gridRowGap: 0,
      gridTemplateColumns: mediaIndex < 3 ? GRID_TEMPLATE_COLUMNS.SMALL : GRID_TEMPLATE_COLUMNS.LARGE,
      gridTemplateRows: mediaIndex < 3 ? "auto" : "1fr",
      height: "100%",
      position: "relative"
    },
    children: [/* @__PURE__ */jsx("div", {
      style: {
        background: "var(--card-fg-color)",
        bottom: 0,
        height: "1px",
        left: 0,
        position: "absolute",
        width: "100%",
        transform: "scaleX(".concat(percentLoaded * 0.01, ")"),
        transformOrigin: "bottom left",
        transition: "all 1000ms ease-out"
      }
    }), /* @__PURE__ */jsx(Box, {
      style: {
        gridColumn: 2,
        gridRowStart: mediaIndex < 3 ? 1 : "auto",
        gridRowEnd: mediaIndex < 3 ? "span 4" : "auto",
        height: "90px",
        width: "100px"
      },
      children: /* @__PURE__ */jsxs(Box, {
        style: {
          height: "100%",
          position: "relative"
        },
        children: [item.assetType === "image" && (item == null ? void 0 : item.objectUrl) && /* @__PURE__ */jsx(Image$1, {
          draggable: false,
          scheme,
          src: item.objectUrl,
          style: {
            opacity: 0.25
          }
        }), item.assetType === "file" && /* @__PURE__ */jsx("div", {
          style: {
            height: "100%",
            opacity: 0.1
          },
          children: /* @__PURE__ */jsx(FileIcon, {
            width: "40px"
          })
        }), !isComplete && percentLoaded !== 100 && /* @__PURE__ */jsx(Flex, {
          align: "center",
          justify: "center",
          style: {
            position: "absolute",
            height: "100%",
            left: 0,
            top: 0,
            width: "100%"
          },
          children: /* @__PURE__ */jsx(Button, {
            fontSize: 3,
            icon: CloseIcon,
            mode: "bleed",
            onClick: handleCancelUpload,
            padding: 2,
            style: {
              background: "none",
              boxShadow: "none"
            },
            tone: "critical"
          })
        })]
      })
    }), /* @__PURE__ */jsx(Box, {
      style: {
        gridColumn: mediaIndex < 3 ? 3 : "3/8",
        gridRow: mediaIndex < 3 ? "2/4" : "auto",
        marginLeft: mediaIndex < 3 ? 3 : 0
      },
      children: /* @__PURE__ */jsxs(Stack, {
        space: 3,
        children: [/* @__PURE__ */jsxs(Text, {
          muted: true,
          size: 1,
          textOverflow: "ellipsis",
          children: [item.name, " (", fileSize, ")"]
        }), /* @__PURE__ */jsx(Text, {
          size: 1,
          textOverflow: "ellipsis",
          weight: "semibold",
          children: status
        })]
      })
    })]
  });
};
const VirtualRow$2 = memo(_ref96 => {
  let {
    item,
    selected
  } = _ref96;
  if ((item == null ? void 0 : item.type) === "asset") {
    return /* @__PURE__ */jsx(Box, {
      style: {
        height: "100px"
      },
      children: /* @__PURE__ */jsx(TableRowAsset$1, {
        id: item.id,
        selected
      })
    });
  }
  if ((item == null ? void 0 : item.type) === "upload") {
    return /* @__PURE__ */jsx(Box, {
      style: {
        height: "100px"
      },
      children: /* @__PURE__ */jsx(TableRowUpload, {
        id: item.id
      })
    });
  }
  return null;
});
const AssetTableVirtualized = props => {
  const {
    items,
    onLoadMore
  } = props;
  const selectedAssets = useTypedSelector(state => state.selected.assets);
  const selectedIds = selectedAssets && selectedAssets.map(asset => asset._id) || [];
  const totalCount = items == null ? void 0 : items.length;
  if (totalCount === 0) {
    return null;
  }
  return /* @__PURE__ */jsx(GroupedVirtuoso, {
    className: "media__custom-scrollbar",
    computeItemKey: index => {
      const item = items[index];
      return (item == null ? void 0 : item.id) || index;
    },
    endReached: onLoadMore,
    groupCounts: Array(1).fill(totalCount),
    groupContent: () => {
      return /* @__PURE__ */jsx(TableHeader, {});
    },
    itemContent: index => {
      const item = items[index];
      const selected = selectedIds.includes(item == null ? void 0 : item.id);
      return /* @__PURE__ */jsx(VirtualRow$2, {
        item,
        selected
      });
    },
    style: {
      overflowX: "hidden"
    }
  });
};
const Items = () => {
  const dispatch = useDispatch();
  const fetchCount = useTypedSelector(state => state.assets.fetchCount);
  const fetching = useTypedSelector(state => state.assets.fetching);
  const tagsPanelVisible = useTypedSelector(state => state.tags.panelVisible);
  const view = useTypedSelector(state => state.assets.view);
  const combinedItems = useTypedSelector(selectCombinedItems);
  const breakpointIndex = useBreakpointIndex();
  const hasFetchedOnce = fetchCount >= 0;
  const hasItems = combinedItems.length > 0;
  const handleLoadMoreItems = () => {
    if (!fetching) {
      dispatch(assetsActions.loadNextPage());
    }
  };
  useEffect(() => {
    if (breakpointIndex <= 1 && tagsPanelVisible) {
      dispatch(tagsActions.panelVisibleSet({
        panelVisible: false
      }));
    }
  }, [breakpointIndex]);
  const isEmpty = !hasItems && hasFetchedOnce && !fetching;
  return /* @__PURE__ */jsx(Box, {
    flex: 1,
    style: {
      width: "100%"
    },
    children: isEmpty ? /* @__PURE__ */jsx(Box, {
      padding: 4,
      children: /* @__PURE__ */jsx(Text, {
        size: 1,
        weight: "semibold",
        children: "No results for the current query"
      })
    }) : /* @__PURE__ */jsxs(Fragment, {
      children: [view === "grid" && /* @__PURE__ */jsx(AssetGridVirtualized, {
        items: combinedItems,
        onLoadMore: handleLoadMoreItems
      }), view === "table" && /* @__PURE__ */jsx(AssetTableVirtualized, {
        items: combinedItems,
        onLoadMore: handleLoadMoreItems
      })]
    })
  });
};
const Notifications = () => {
  const items = useTypedSelector(state => state.notifications.items);
  const toast = useToast();
  useEffect(() => {
    if (items.length > 0) {
      const lastItem = items[items.length - 1];
      toast.push({
        closable: true,
        status: lastItem.status,
        title: lastItem.title
      });
    }
  }, [items.length]);
  return null;
};
const PickedBar = () => {
  const {
    scheme
  } = useColorScheme();
  const dispatch = useDispatch();
  const assetsPicked = useTypedSelector(selectAssetsPicked);
  const handlePickClear = () => {
    dispatch(assetsActions.pickClear());
  };
  const handleMassEdit = () => {
    dispatch(dialogActions.showMassAssetEdit());
  };
  const handleDeletePicked = () => {
    dispatch(dialogActions.showConfirmDeleteAssets({
      assets: assetsPicked
    }));
  };
  if (assetsPicked.length === 0) {
    return null;
  }
  return /* @__PURE__ */jsx(Flex, {
    align: "center",
    justify: "flex-start",
    style: {
      background: getSchemeColor(scheme, "bg"),
      borderBottom: "1px solid var(--card-border-color)",
      height: "".concat(PANEL_HEIGHT, "px"),
      position: "relative",
      width: "100%"
    },
    children: /* @__PURE__ */jsxs(Flex, {
      align: "center",
      paddingX: 3,
      children: [/* @__PURE__ */jsx(Box, {
        paddingRight: 2,
        children: /* @__PURE__ */jsxs(Label, {
          size: 0,
          style: {
            color: "inherit"
          },
          children: [assetsPicked.length, " ", pluralize("asset", assetsPicked.length), " selected"]
        })
      }), /* @__PURE__ */jsx(Button, {
        mode: "bleed",
        onClick: handleMassEdit,
        padding: 2,
        style: {
          background: "none",
          boxShadow: "none"
        },
        tone: "default",
        children: /* @__PURE__ */jsx(Label, {
          size: 0,
          children: "Edit"
        })
      }), /* @__PURE__ */jsx(Button, {
        mode: "bleed",
        onClick: handlePickClear,
        padding: 2,
        style: {
          background: "none",
          boxShadow: "none"
        },
        tone: "default",
        children: /* @__PURE__ */jsx(Label, {
          size: 0,
          children: "Deselect"
        })
      }), /* @__PURE__ */jsx(Button, {
        mode: "bleed",
        onClick: handleDeletePicked,
        padding: 2,
        style: {
          background: "none",
          boxShadow: "none"
        },
        tone: "critical",
        children: /* @__PURE__ */jsx(Label, {
          size: 0,
          children: "Delete"
        })
      })]
    })
  });
};
const initialState$1 = {
  assets: [],
  document: void 0,
  documentAssetIds: []
};
const selectedSlice = createSlice({
  name: "selected",
  initialState: initialState$1,
  reducers: {}
});
var selectedReducer = selectedSlice.reducer;
const initialState = {
  items: []
};
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    add(state, action) {
      const {
        asset,
        status,
        title
      } = action.payload;
      state.items.push({
        asset,
        status,
        title
      });
    }
  }
});
const notificationsAssetsDeleteCompleteEpic = action$ => action$.pipe(filter(assetsActions.deleteComplete.match), mergeMap(action => {
  const {
    assetIds
  } = action.payload;
  const deletedCount = assetIds.length;
  return of(notificationsSlice.actions.add({
    status: "info",
    title: "".concat(deletedCount, " ").concat(pluralize("asset", deletedCount), " deleted")
  }));
}));
const notificationsAssetsDeleteErrorEpic = action$ => action$.pipe(filter(assetsActions.deleteError.match), mergeMap(action => {
  const {
    assetIds
  } = action.payload;
  const count = assetIds.length;
  return of(notificationsSlice.actions.add({
    status: "error",
    title: "Unable to delete ".concat(count, " ").concat(pluralize("asset", count), ". Please review any asset errors and try again.")
  }));
}));
const notificationsAssetsTagsAddCompleteEpic = action$ => action$.pipe(filter(ASSETS_ACTIONS.tagsAddComplete.match), mergeMap(action => {
  var _a, _b;
  const count = (_b = (_a = action == null ? void 0 : action.payload) == null ? void 0 : _a.assets) == null ? void 0 : _b.length;
  return of(notificationsSlice.actions.add({
    status: "info",
    title: "Tag added to ".concat(count, " ").concat(pluralize("asset", count))
  }));
}));
const notificationsAssetsTagsRemoveCompleteEpic = action$ => action$.pipe(filter(ASSETS_ACTIONS.tagsRemoveComplete.match), mergeMap(action => {
  var _a, _b;
  const count = (_b = (_a = action == null ? void 0 : action.payload) == null ? void 0 : _a.assets) == null ? void 0 : _b.length;
  return of(notificationsSlice.actions.add({
    status: "info",
    title: "Tag removed from ".concat(count, " ").concat(pluralize("asset", count))
  }));
}));
const notificationsAssetsUpdateCompleteEpic = action$ => action$.pipe(filter(assetsActions.updateComplete.match), bufferTime(2e3), filter(actions => actions.length > 0), mergeMap(actions => {
  const updatedCount = actions.length;
  return of(notificationsSlice.actions.add({
    status: "info",
    title: "".concat(updatedCount, " ").concat(pluralize("asset", updatedCount), " updated")
  }));
}));
const notificationsGenericErrorEpic = action$ => action$.pipe(ofType(assetsActions.fetchError.type, assetsActions.updateError.type, tagsActions.createError.type, tagsActions.deleteError.type, tagsActions.fetchError.type, tagsActions.updateError.type, uploadsActions.uploadError.type), mergeMap(action => {
  var _a;
  const error = (_a = action.payload) == null ? void 0 : _a.error;
  return of(notificationsSlice.actions.add({
    status: "error",
    title: "An error occured: ".concat(error.message)
  }));
}));
const notificationsTagCreateCompleteEpic = action$ => action$.pipe(filter(tagsActions.createComplete.match), mergeMap(() => of(notificationsSlice.actions.add({
  status: "info",
  title: "Tag created"
}))));
const notificationsTagDeleteCompleteEpic = action$ => action$.pipe(filter(tagsActions.deleteComplete.match), mergeMap(() => of(notificationsSlice.actions.add({
  status: "info",
  title: "Tag deleted"
}))));
const notificationsTagUpdateCompleteEpic = action$ => action$.pipe(filter(tagsActions.updateComplete.match), mergeMap(() => of(notificationsSlice.actions.add({
  status: "info",
  title: "Tag updated"
}))));
const notificationsActions = notificationsSlice.actions;
var notificationsReducer = notificationsSlice.reducer;
const rootEpic = combineEpics(assetsDeleteEpic, assetsFetchEpic, assetsFetchAfterDeleteAllEpic, assetsFetchNextPageEpic, assetsFetchPageIndexEpic, assetsListenerCreateQueueEpic, assetsListenerDeleteQueueEpic, assetsListenerUpdateQueueEpic, assetsOrderSetEpic, assetsSearchEpic, assetsSortEpic, assetsTagsAddEpic, assetsTagsRemoveEpic, assetsUnpickEpic, assetsUpdateEpic, assetsMassUpdateEpic, dialogClearOnAssetUpdateEpic, dialogTagCreateEpic, dialogTagDeleteEpic, notificationsAssetsDeleteErrorEpic, notificationsAssetsDeleteCompleteEpic, notificationsAssetsTagsAddCompleteEpic, notificationsAssetsTagsRemoveCompleteEpic, notificationsAssetsUpdateCompleteEpic, notificationsGenericErrorEpic, notificationsTagCreateCompleteEpic, notificationsTagDeleteCompleteEpic, notificationsTagUpdateCompleteEpic, searchFacetTagUpdateEpic, tagsCreateEpic, tagsDeleteEpic, tagsFetchEpic, tagsListenerCreateQueueEpic, tagsListenerDeleteQueueEpic, tagsListenerUpdateQueueEpic, tagsSortEpic, tagsUpdateEpic, uploadsAssetStartEpic, uploadsAssetUploadEpic, uploadsCheckRequestEpic, uploadsCompleteQueueEpic, seasonsCreateEpic, seasonsUpdateEpic, seasonsDeleteEpic, seasonsFetchEpic, collaborationFetchEpic, collaborationsCreateEpic, collaborationUpdateEpic, collaborationsDeleteEpic);
const reducers = {
  assets: assetsReducer,
  seasons: seasonsReducer,
  collaborations: collaborationsReducer,
  debug: debugReducer,
  dialog: dialogReducer,
  notifications: notificationsReducer,
  search: searchReducer,
  selected: selectedReducer,
  tags: tagsReducer,
  uploads: uploadsReducer
};
const rootReducer = combineReducers(reducers);
const isPlainObject = value => value !== null && typeof value === "object" && !Array.isArray(value);
const getAssetIds = function (node) {
  let acc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var _a, _b;
  if (Array.isArray(node)) {
    node.forEach(v => {
      getAssetIds(v, acc);
    });
  }
  if (isPlainObject(node)) {
    if (((_a = node == null ? void 0 : node.asset) == null ? void 0 : _a._type) === "reference" && ((_b = node == null ? void 0 : node.asset) == null ? void 0 : _b._ref)) {
      acc.push(node.asset._ref);
    }
    Object.values(node).forEach(val => {
      getAssetIds(val, acc);
    });
  }
  return acc;
};
const getDocumentAssetIds = document => {
  const assetIds = getAssetIds(document);
  return [...new Set(assetIds.sort())];
};
var __defProp$4 = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp$4(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class ReduxProvider extends Component {
  constructor(props) {
    super(props);
    __publicField(this, "store");
    const epicMiddleware = createEpicMiddleware({
      dependencies: {
        client: props.client
        // inject sanity client as a dependency to all epics
      }
    });

    this.store = configureStore({
      reducer: rootReducer,
      middleware: getDefaultMiddleware => getDefaultMiddleware({
        /*
        serializableCheck: {
          ignoredActions: [
            assetsActions.deleteError.type,
            uploadsActions.uploadRequest.type,
            uploadsActions.uploadStart.type,
          ]
        },
        */
        // TODO: remove once we're no longer storing non-serializable data in the store
        serializableCheck: false,
        thunk: false
      }).prepend(epicMiddleware),
      devTools: true,
      preloadedState: {
        assets: {
          ...initialState$7,
          assetTypes: (props == null ? void 0 : props.assetType) ? [props.assetType] : ["file", "image"]
        },
        selected: {
          assets: props.selectedAssets || [],
          document: props.document,
          documentAssetIds: props.document ? getDocumentAssetIds(props.document) : []
        }
      }
    });
    epicMiddleware.run(rootEpic);
  }
  render() {
    return /* @__PURE__ */jsx(Provider, {
      store: this.store,
      children: this.props.children
    });
  }
}
var __freeze$3 = Object.freeze;
var __defProp$3 = Object.defineProperty;
var __template$3 = (cooked, raw) => __freeze$3(__defProp$3(cooked, "raw", {
  value: __freeze$3(raw || cooked.slice())
}));
var _a$3, _b$3;
const UploadContainer = styled.div(_a$3 || (_a$3 = __template$3(["\n  color: white;\n  height: 100%;\n  min-height: 100%;\n  right: 0;\n  top: 0;\n  width: 100%;\n\n  &:focus {\n    outline: none;\n  }\n"])));
const DragActiveContainer = styled.div(_b$3 || (_b$3 = __template$3(["\n  align-items: center;\n  background: rgba(0, 0, 0, 0.75);\n  display: flex;\n  height: 100%;\n  justify-content: center;\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 100%;\n  z-index: 3;\n"])));
async function filterFiles(fileList) {
  const files = Array.from(fileList);
  const filteredFiles = [];
  for (const file of files) {
    try {
      await file.slice(0, 1).arrayBuffer();
      filteredFiles.push(file);
    } catch (err) {}
  }
  return filteredFiles;
}
const UploadDropzone = props => {
  const {
    children
  } = props;
  const {
    onSelect
  } = useAssetSourceActions();
  const dispatch = useDispatch();
  const assetTypes = useTypedSelector(state => state.assets.assetTypes);
  const isImageAssetType = assetTypes.length === 1 && assetTypes[0] === "image";
  const handleDrop = async acceptedFiles => {
    acceptedFiles.forEach(file => dispatch(uploadsActions.uploadRequest({
      file,
      forceAsAssetType: assetTypes.length === 1 ? assetTypes[0] : void 0
    })));
  };
  const handleFileGetter = async event => {
    var _a2;
    let fileList;
    if (event.type === "drop" && "dataTransfer" in event) {
      fileList = (_a2 = event == null ? void 0 : event.dataTransfer) == null ? void 0 : _a2.files;
    }
    if (event.type === "change") {
      const target = event == null ? void 0 : event.target;
      if (target == null ? void 0 : target.files) {
        fileList = target.files;
      }
    }
    if (!fileList) {
      return [];
    }
    const files = await filterFiles(fileList);
    if ((fileList == null ? void 0 : fileList.length) !== files.length) {
      dispatch(notificationsActions.add({
        status: "error",
        title: "Unable to upload some items (folders and packages aren't supported)"
      }));
    }
    return files;
  };
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open
  } = useDropzone({
    accept: isImageAssetType ? "image/*" : "",
    getFilesFromEvent: handleFileGetter,
    noClick: true,
    // HACK: Disable drag and drop functionality when in a selecting context
    // (This is currently due to Sanity's native image input taking precedence with drag and drop)
    noDrag: !!onSelect,
    onDrop: handleDrop
  });
  return /* @__PURE__ */jsx(DropzoneDispatchProvider, {
    open,
    children: /* @__PURE__ */jsxs(UploadContainer, {
      ...getRootProps(),
      children: [/* @__PURE__ */jsx("input", {
        ...getInputProps()
      }), isDragActive && /* @__PURE__ */jsx(DragActiveContainer, {
        children: /* @__PURE__ */jsx(Flex, {
          direction: "column",
          justify: "center",
          style: {
            color: white.hex
          },
          children: /* @__PURE__ */jsx(Text, {
            size: 3,
            style: {
              color: "inherit"
            },
            children: "Drop files to upload"
          })
        })
      }), children]
    })
  });
};
var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", {
  value: __freeze$2(raw || cooked.slice())
}));
var _a$2, _b$2;
const SeasonContainer$1 = styled(Flex)(_a$2 || (_a$2 = __template$2(["\n  height: ", "px;\n"])), PANEL_HEIGHT);
const ButtonContainer$1 = styled(Flex)(_b$2 || (_b$2 = __template$2(["\n  @media (pointer: fine) {\n    visibility: hidden;\n  }\n\n  @media (hover: hover) and (pointer: fine) {\n    ", ":hover & {\n      visibility: visible;\n    }\n  }\n"])), SeasonContainer$1);
const SeasonButton$1 = props => {
  const {
    disabled,
    icon,
    onClick,
    tone,
    tooltip
  } = props;
  return /* @__PURE__ */jsx(Tooltip, {
    content: /* @__PURE__ */jsx(Container$2, {
      padding: 2,
      width: 0,
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 1,
        children: tooltip
      })
    }),
    disabled: "ontouchstart" in window,
    placement: "top",
    portal: true,
    children: /* @__PURE__ */jsx(Button, {
      disabled,
      fontSize: 1,
      icon,
      mode: "bleed",
      onClick,
      padding: 2,
      tone
    })
  });
};
const Season$1 = props => {
  var _a2, _b2;
  const {
    actions,
    season
  } = props;
  const dispatch = useDispatch();
  const assetsPicked = useTypedSelector(selectAssetsPicked);
  const isSearchFacetTag = useTypedSelector(state => {
    var _a3;
    return selectIsSearchFacetTag(state, (_a3 = season == null ? void 0 : season.season) == null ? void 0 : _a3._id);
  });
  const handleSearchFacetTagRemove = () => {
    dispatch(searchActions.facetsRemoveBySeason({
      seasonId: season.season._id
    }));
  };
  const handleShowAddSeasonToAssetsDialog = () => {
    dispatch(dialogActions.showConfirmAssetsSeasonAdd({
      assetsPicked,
      season: season.season
    }));
  };
  const handleShowRemoveSeasonFromAssetsDialog = () => {
    dispatch(dialogActions.showConfirmAssetsSeasonRemove({
      assetsPicked,
      season: season.season
    }));
  };
  const handleShowSeasonDeleteDialog = () => {
    dispatch(dialogActions.showConfirmDeleteSeason({
      season: season.season
    }));
  };
  const handleShowSeasonEditDialog = () => {
    var _a3;
    dispatch(DIALOG_ACTIONS.showSeasonEdit({
      seasonId: (_a3 = season == null ? void 0 : season.season) == null ? void 0 : _a3._id
    }));
  };
  const handleSearchFacetTagAddOrUpdate = () => {
    var _a3, _b3, _c;
    const searchFacet = {
      //@ts-ignore
      ...inputs.season,
      value: {
        label: (_b3 = (_a3 = season == null ? void 0 : season.season) == null ? void 0 : _a3.name) == null ? void 0 : _b3.current,
        value: (_c = season == null ? void 0 : season.season) == null ? void 0 : _c._id
      }
    };
    if (isSearchFacetTag) {
      dispatch(searchActions.facetsUpdate({
        name: "tag",
        operatorType: "references",
        value: searchFacet.value
      }));
    } else {
      dispatch(searchActions.facetsAdd({
        facet: searchFacet
      }));
    }
  };
  return /* @__PURE__ */jsxs(SeasonContainer$1, {
    align: "center",
    flex: 1,
    justify: "space-between",
    paddingLeft: 3,
    children: [/* @__PURE__ */jsx(Box, {
      flex: 1,
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 1,
        style: {
          opacity: (season == null ? void 0 : season.updating) ? 0.5 : 1,
          userSelect: "none"
        },
        textOverflow: "ellipsis",
        children: (_b2 = (_a2 = season == null ? void 0 : season.season) == null ? void 0 : _a2.name) == null ? void 0 : _b2.current
      })
    }), /* @__PURE__ */jsxs(ButtonContainer$1, {
      align: "center",
      style: {
        flexShrink: 0
      },
      children: [(actions == null ? void 0 : actions.includes("search")) && /* @__PURE__ */jsx(SeasonButton$1, {
        disabled: season == null ? void 0 : season.updating,
        icon: isSearchFacetTag ? /* @__PURE__ */jsx(CloseIcon, {}) : /* @__PURE__ */jsx(SearchIcon, {}),
        onClick: isSearchFacetTag ? handleSearchFacetTagRemove : handleSearchFacetTagAddOrUpdate,
        tooltip: isSearchFacetTag ? "Remove filter" : "Filter by tag"
      }), (actions == null ? void 0 : actions.includes("edit")) && /* @__PURE__ */jsx(SeasonButton$1, {
        disabled: season == null ? void 0 : season.updating,
        icon: /* @__PURE__ */jsx(EditIcon, {}),
        onClick: handleShowSeasonEditDialog,
        tone: "primary",
        tooltip: "Edit Season"
      }), (actions == null ? void 0 : actions.includes("applyAll")) && /* @__PURE__ */jsx(SeasonButton$1, {
        disabled: season == null ? void 0 : season.updating,
        icon: /* @__PURE__ */jsx(ArrowUpIcon, {}),
        onClick: handleShowAddSeasonToAssetsDialog,
        tone: "primary",
        tooltip: "Add Season to selected assets"
      }), (actions == null ? void 0 : actions.includes("removeAll")) && /* @__PURE__ */jsx(SeasonButton$1, {
        disabled: season == null ? void 0 : season.updating,
        icon: /* @__PURE__ */jsx(ArrowDownIcon, {}),
        onClick: handleShowRemoveSeasonFromAssetsDialog,
        tone: "critical",
        tooltip: "Remove Season from selected assets"
      }), (actions == null ? void 0 : actions.includes("delete")) && /* @__PURE__ */jsx(SeasonButton$1, {
        disabled: season == null ? void 0 : season.updating,
        icon: /* @__PURE__ */jsx(TrashIcon, {}),
        onClick: handleShowSeasonDeleteDialog,
        tone: "critical",
        tooltip: "Delete tag"
      })]
    })]
  });
};
const VirtualRow$1 = memo(_ref97 => {
  let {
    isScrolling,
    item
  } = _ref97;
  var _a;
  if (typeof item === "string") {
    return /* @__PURE__ */jsx(Flex, {
      align: "center",
      justify: "space-between",
      paddingX: 3,
      style: {
        height: "".concat(PANEL_HEIGHT, "px")
      },
      children: /* @__PURE__ */jsx(Label, {
        size: 0,
        children: item
      })
    }, item);
  }
  return /* @__PURE__ */jsx(Season$1, {
    actions: isScrolling ? void 0 : item.actions,
    season: item
  }, (_a = item.season) == null ? void 0 : _a._id);
});
const SeasonsVirtualized = () => {
  const assetsPicked = useTypedSelector(selectAssetsPicked);
  const seasons = useTypedSelector(selectSeasons);
  const [isScrolling, setIsScrolling] = useState(false);
  const pickedSeasonsIds = assetsPicked == null ? void 0 : assetsPicked.reduce((acc, val) => {
    var _a, _b;
    const assetTagIds = ((_b = (_a = val == null ? void 0 : val.asset) == null ? void 0 : _a.seasons) == null ? void 0 : _b.map(each => each.season._id)) || [];
    acc = acc.concat(assetTagIds);
    return acc;
  }, []);
  const pickedSeasonIdsUnique = [...new Set(pickedSeasonsIds)];
  const seasonIdsSegmented = pickedSeasonIdsUnique.reduce((acc, seasonId) => {
    const seasonIsInEveryAsset = assetsPicked.every(assetItem => {
      return assetItem.asset.season === seasonId;
    });
    if (seasonIsInEveryAsset) {
      acc.appliedToAll.push(seasonId);
    } else {
      acc.appliedToSome.push(seasonId);
    }
    return acc;
  }, {
    appliedToAll: [],
    appliedToSome: []
  });
  const seasonsAppliedToAll = seasons.filter(season => seasonIdsSegmented.appliedToAll.includes(season.season._id)).map(seasonItem => ({
    ...seasonItem,
    actions: ["delete", "edit"]
  }));
  const seasonsAppliedToSome = seasons.filter(season => seasonIdsSegmented.appliedToSome.includes(season.season._id)).map(seasonItem => ({
    ...seasonItem,
    actions: ["delete", "edit"]
  }));
  const tagsUnused = seasons.filter(season => !pickedSeasonIdsUnique.includes(season.season._id)).map(seasonItem => ({
    ...seasonItem,
    actions: ["delete", "edit"]
  }));
  let items = [];
  if (assetsPicked.length === 0) {
    items = seasons.map(seasonItem => ({
      ...seasonItem,
      actions: ["delete", "edit"]
    }));
  } else {
    if ((seasonsAppliedToAll == null ? void 0 : seasonsAppliedToAll.length) > 0) {
      items = [...items,
      //
      assetsPicked.length === 1 ? "Used" : "Used by all", ...seasonsAppliedToAll];
    }
    if ((seasonsAppliedToSome == null ? void 0 : seasonsAppliedToSome.length) > 0) {
      items = [...items,
      //
      "Used by some", ...seasonsAppliedToSome];
    }
    if ((tagsUnused == null ? void 0 : tagsUnused.length) > 0) {
      items = [...items,
      //
      "Unused", ...tagsUnused];
    }
  }
  return /* @__PURE__ */jsx(Virtuoso, {
    className: "media__custom-scrollbar",
    computeItemKey: index => {
      const item = items[index];
      if (typeof item === "string") {
        return item;
      }
      return item.season._id;
    },
    isScrolling: setIsScrolling,
    itemContent: index => {
      return /* @__PURE__ */jsx(VirtualRow$1, {
        isScrolling,
        item: items[index]
      });
    },
    style: {
      flex: 1,
      overflowX: "hidden"
    },
    totalCount: items.length
  });
};
const SeasonViewHeader = _ref98 => {
  let {
    allowCreate,
    light,
    title
  } = _ref98;
  const {
    scheme
  } = useColorScheme();
  const dispatch = useDispatch();
  const tagsCreating = useTypedSelector(state => state.seasons.creating);
  const tagsFetching = useTypedSelector(state => state.seasons.fetching);
  const handleTagCreate = () => {
    dispatch(DIALOG_ACTIONS.showSeasonCreate());
  };
  return /* @__PURE__ */jsx(Fragment, {
    children: /* @__PURE__ */jsxs(Flex, {
      align: "center",
      justify: "space-between",
      paddingLeft: 3,
      style: {
        background: light ? getSchemeColor(scheme, "bg") : "inherit",
        borderBottom: "1px solid var(--card-border-color)",
        flexShrink: 0,
        height: "".concat(PANEL_HEIGHT, "px")
      },
      children: [/* @__PURE__ */jsxs(Inline, {
        space: 2,
        children: [/* @__PURE__ */jsx(Label, {
          size: 0,
          children: title
        }), tagsFetching && /* @__PURE__ */jsx(Label, {
          size: 0,
          style: {
            opacity: 0.3
          },
          children: "Loading..."
        })]
      }), allowCreate && /* @__PURE__ */jsx(Box, {
        marginRight: 1,
        children: /* @__PURE__ */jsx(Button, {
          disabled: tagsCreating,
          fontSize: 1,
          icon: ComposeIcon,
          mode: "bleed",
          onClick: handleTagCreate,
          style: {
            background: "transparent",
            boxShadow: "none"
          }
        })
      })]
    })
  });
};
const SeasonView = () => {
  const numPickedAssets = useTypedSelector(selectAssetsPickedLength);
  const seasons = useTypedSelector(selectSeasons);
  const fetching = useTypedSelector(state => state.seasons.fetching);
  const fetchCount = useTypedSelector(state => state.seasons.fetchCount);
  const fetchComplete = fetchCount !== -1;
  const hasTags = !fetching && (seasons == null ? void 0 : seasons.length) > 0;
  const hasPicked = !!(numPickedAssets > 0);
  return /* @__PURE__ */jsxs(Flex, {
    direction: "column",
    flex: 1,
    height: "fill",
    children: [/* @__PURE__ */jsx(SeasonViewHeader, {
      allowCreate: true,
      light: hasPicked,
      title: hasPicked ? "Seasons (in selection)" : "Seasons"
    }), fetchComplete && !hasTags && /* @__PURE__ */jsx(Box, {
      padding: 3,
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 1,
        children: /* @__PURE__ */jsx("em", {
          children: "No Seasons"
        })
      })
    }), hasTags && /* @__PURE__ */jsx(SeasonsVirtualized, {})]
  });
};
const SeasonsPanel = () => {
  const seasonsPanelVisible = useTypedSelector(state => state.seasons.panelVisible);
  if (!seasonsPanelVisible) {
    return null;
  }
  return /* @__PURE__ */jsx(Box, {
    style: {
      position: "relative",
      width: TAGS_PANEL_WIDTH
    },
    children: /* @__PURE__ */jsx(Box, {
      className: "media__custom-scrollbar",
      style: {
        borderLeft: "1px solid var(--card-border-color)",
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        position: "absolute",
        right: 0,
        top: 0,
        width: "100%"
      },
      children: /* @__PURE__ */jsx(SeasonView, {})
    })
  });
};
const CollaborationViewHeader = _ref99 => {
  let {
    allowCreate,
    light,
    title
  } = _ref99;
  const {
    scheme
  } = useColorScheme();
  const dispatch = useDispatch();
  const collaborationsCreating = useTypedSelector(state => state.collaborations.creating);
  const collaborationsFetching = useTypedSelector(state => state.collaborations.fetching);
  const handleTagCreate = () => {
    dispatch(DIALOG_ACTIONS.showCollaborationCreate());
  };
  return /* @__PURE__ */jsx(Fragment, {
    children: /* @__PURE__ */jsxs(Flex, {
      align: "center",
      justify: "space-between",
      paddingLeft: 3,
      style: {
        background: light ? getSchemeColor(scheme, "bg") : "inherit",
        borderBottom: "1px solid var(--card-border-color)",
        flexShrink: 0,
        height: "".concat(PANEL_HEIGHT, "px")
      },
      children: [/* @__PURE__ */jsxs(Inline, {
        space: 2,
        children: [/* @__PURE__ */jsx(Label, {
          size: 0,
          children: title
        }), collaborationsFetching && /* @__PURE__ */jsx(Label, {
          size: 0,
          style: {
            opacity: 0.3
          },
          children: "Loading..."
        })]
      }), allowCreate && /* @__PURE__ */jsx(Box, {
        marginRight: 1,
        children: /* @__PURE__ */jsx(Button, {
          disabled: collaborationsCreating,
          fontSize: 1,
          icon: ComposeIcon,
          mode: "bleed",
          onClick: handleTagCreate,
          style: {
            background: "transparent",
            boxShadow: "none"
          }
        })
      })]
    })
  });
};
var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", {
  value: __freeze$1(raw || cooked.slice())
}));
var _a$1, _b$1;
const SeasonContainer = styled(Flex)(_a$1 || (_a$1 = __template$1(["\n  height: ", "px;\n"])), PANEL_HEIGHT);
const ButtonContainer = styled(Flex)(_b$1 || (_b$1 = __template$1(["\n  @media (pointer: fine) {\n    visibility: hidden;\n  }\n\n  @media (hover: hover) and (pointer: fine) {\n    ", ":hover & {\n      visibility: visible;\n    }\n  }\n"])), SeasonContainer);
const SeasonButton = props => {
  const {
    disabled,
    icon,
    onClick,
    tone,
    tooltip
  } = props;
  return /* @__PURE__ */jsx(Tooltip, {
    content: /* @__PURE__ */jsx(Container$2, {
      padding: 2,
      width: 0,
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 1,
        children: tooltip
      })
    }),
    disabled: "ontouchstart" in window,
    placement: "top",
    portal: true,
    children: /* @__PURE__ */jsx(Button, {
      disabled,
      fontSize: 1,
      icon,
      mode: "bleed",
      onClick,
      padding: 2,
      tone
    })
  });
};
const Season = props => {
  var _a2, _b2;
  const {
    actions,
    collaboration
  } = props;
  const dispatch = useDispatch();
  const assetsPicked = useTypedSelector(selectAssetsPicked);
  const isSearchFacetTag = useTypedSelector(state => {
    var _a3;
    return selectIsSearchFacetTag(state, (_a3 = collaboration == null ? void 0 : collaboration.collaboration) == null ? void 0 : _a3._id);
  });
  const handleSearchFacetTagRemove = () => {
    dispatch(searchActions.facetsRemoveBySeason({
      seasonId: collaboration.collaboration._id
    }));
  };
  const handleShowAddSeasonToAssetsDialog = () => {
    dispatch(dialogActions.showConfirmAssetsCollaborationsAdd({
      assetsPicked,
      collaboration: collaboration.collaboration
    }));
  };
  const handleShowRemoveSeasonFromAssetsDialog = () => {
    dispatch(dialogActions.showConfirmAssetsCollaborationRemove({
      assetsPicked,
      collaboration: collaboration.collaboration
    }));
  };
  const handleShowCollaborationDeleteDialog = () => {
    dispatch(dialogActions.showConfirmDeleteCollaboration({
      collaboration: collaboration.collaboration
    }));
  };
  const handleShowSeasonEditDialog = () => {
    var _a3;
    dispatch(DIALOG_ACTIONS.showCollaborationEdit({
      collaborationId: (_a3 = collaboration == null ? void 0 : collaboration.collaboration) == null ? void 0 : _a3._id
    }));
  };
  const handleSearchFacetTagAddOrUpdate = () => {
    var _a3, _b3, _c;
    const searchFacet = {
      //@ts-ignore
      ...inputs.season,
      value: {
        label: (_b3 = (_a3 = collaboration == null ? void 0 : collaboration.collaboration) == null ? void 0 : _a3.name) == null ? void 0 : _b3.current,
        value: (_c = collaboration == null ? void 0 : collaboration.collaboration) == null ? void 0 : _c._id
      }
    };
    if (isSearchFacetTag) {
      dispatch(searchActions.facetsUpdate({
        name: "tag",
        operatorType: "references",
        value: searchFacet.value
      }));
    } else {
      dispatch(searchActions.facetsAdd({
        facet: searchFacet
      }));
    }
  };
  return /* @__PURE__ */jsxs(SeasonContainer, {
    align: "center",
    flex: 1,
    justify: "space-between",
    paddingLeft: 3,
    children: [/* @__PURE__ */jsx(Box, {
      flex: 1,
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 1,
        style: {
          opacity: (collaboration == null ? void 0 : collaboration.updating) ? 0.5 : 1,
          userSelect: "none"
        },
        textOverflow: "ellipsis",
        children: (_b2 = (_a2 = collaboration == null ? void 0 : collaboration.collaboration) == null ? void 0 : _a2.name) == null ? void 0 : _b2.current
      })
    }), /* @__PURE__ */jsxs(ButtonContainer, {
      align: "center",
      style: {
        flexShrink: 0
      },
      children: [(actions == null ? void 0 : actions.includes("search")) && /* @__PURE__ */jsx(SeasonButton, {
        disabled: collaboration == null ? void 0 : collaboration.updating,
        icon: isSearchFacetTag ? /* @__PURE__ */jsx(CloseIcon, {}) : /* @__PURE__ */jsx(SearchIcon, {}),
        onClick: isSearchFacetTag ? handleSearchFacetTagRemove : handleSearchFacetTagAddOrUpdate,
        tooltip: isSearchFacetTag ? "Remove filter" : "Filter by tag"
      }), (actions == null ? void 0 : actions.includes("edit")) && /* @__PURE__ */jsx(SeasonButton, {
        disabled: collaboration == null ? void 0 : collaboration.updating,
        icon: /* @__PURE__ */jsx(EditIcon, {}),
        onClick: handleShowSeasonEditDialog,
        tone: "primary",
        tooltip: "Edit Collaboration"
      }), (actions == null ? void 0 : actions.includes("applyAll")) && /* @__PURE__ */jsx(SeasonButton, {
        disabled: collaboration == null ? void 0 : collaboration.updating,
        icon: /* @__PURE__ */jsx(ArrowUpIcon, {}),
        onClick: handleShowAddSeasonToAssetsDialog,
        tone: "primary",
        tooltip: "Add Season to selected assets"
      }), (actions == null ? void 0 : actions.includes("removeAll")) && /* @__PURE__ */jsx(SeasonButton, {
        disabled: collaboration == null ? void 0 : collaboration.updating,
        icon: /* @__PURE__ */jsx(ArrowDownIcon, {}),
        onClick: handleShowRemoveSeasonFromAssetsDialog,
        tone: "critical",
        tooltip: "Remove Season from selected assets"
      }), (actions == null ? void 0 : actions.includes("delete")) && /* @__PURE__ */jsx(SeasonButton, {
        disabled: collaboration == null ? void 0 : collaboration.updating,
        icon: /* @__PURE__ */jsx(TrashIcon, {}),
        onClick: handleShowCollaborationDeleteDialog,
        tone: "critical",
        tooltip: "Delete Collaboration"
      })]
    })]
  });
};
const VirtualRow = memo(_ref100 => {
  let {
    isScrolling,
    item
  } = _ref100;
  var _a;
  if (typeof item === "string") {
    return /* @__PURE__ */jsx(Flex, {
      align: "center",
      justify: "space-between",
      paddingX: 3,
      style: {
        height: "".concat(PANEL_HEIGHT, "px")
      },
      children: /* @__PURE__ */jsx(Label, {
        size: 0,
        children: item
      })
    }, item);
  }
  return /* @__PURE__ */jsx(Season, {
    actions: isScrolling ? void 0 : item.actions,
    collaboration: item
  }, (_a = item.collaboration) == null ? void 0 : _a._id);
});
const CollaborationsVirtualized = () => {
  const assetsPicked = useTypedSelector(selectAssetsPicked);
  const collaborations = useTypedSelector(selectCollaborations);
  const [isScrolling, setIsScrolling] = useState(false);
  const pickedSeasonsIds = assetsPicked == null ? void 0 : assetsPicked.reduce((acc, val) => {
    var _a, _b;
    const assetTagIds = ((_b = (_a = val == null ? void 0 : val.asset) == null ? void 0 : _a.seasons) == null ? void 0 : _b.map(each => each.collaboration._id)) || [];
    acc = acc.concat(assetTagIds);
    return acc;
  }, []);
  const pickedSeasonIdsUnique = [...new Set(pickedSeasonsIds)];
  const seasonIdsSegmented = pickedSeasonIdsUnique.reduce((acc, seasonId) => {
    const seasonIsInEveryAsset = assetsPicked.every(assetItem => {
      return assetItem.asset.season === seasonId;
    });
    if (seasonIsInEveryAsset) {
      acc.appliedToAll.push(seasonId);
    } else {
      acc.appliedToSome.push(seasonId);
    }
    return acc;
  }, {
    appliedToAll: [],
    appliedToSome: []
  });
  const collaborationsAppliedToAll = collaborations.filter(collaboration => seasonIdsSegmented.appliedToAll.includes(collaboration.collaboration._id)).map(collaborationItem => ({
    ...collaborationItem,
    actions: ["delete", "edit"]
  }));
  const collaborationsAppliedToSome = collaborations.filter(collaboration => seasonIdsSegmented.appliedToSome.includes(collaboration.collaboration._id)).map(collaborationItem => ({
    ...collaborationItem,
    actions: ["delete", "edit"]
  }));
  const collaborationUnused = collaborations.filter(collaboration => !pickedSeasonIdsUnique.includes(collaboration.collaboration._id)).map(collaborationItem => ({
    ...collaborationItem,
    actions: ["delete", "edit"]
  }));
  let items = [];
  if (assetsPicked.length === 0) {
    items = collaborations.map(each => ({
      ...each,
      actions: ["delete", "edit"]
    }));
  } else {
    if ((collaborationsAppliedToAll == null ? void 0 : collaborationsAppliedToAll.length) > 0) {
      items = [...items,
      //
      assetsPicked.length === 1 ? "Used" : "Used by all", ...collaborationsAppliedToAll];
    }
    if ((collaborationsAppliedToSome == null ? void 0 : collaborationsAppliedToSome.length) > 0) {
      items = [...items,
      //
      "Used by some", ...collaborationsAppliedToSome];
    }
    if ((collaborationUnused == null ? void 0 : collaborationUnused.length) > 0) {
      items = [...items,
      //
      "Unused", ...collaborationUnused];
    }
  }
  return /* @__PURE__ */jsx(Virtuoso, {
    className: "media__custom-scrollbar",
    computeItemKey: index => {
      const item = items[index];
      if (typeof item === "string") {
        return item;
      }
      return item.collaboration._id;
    },
    isScrolling: setIsScrolling,
    itemContent: index => {
      return /* @__PURE__ */jsx(VirtualRow, {
        isScrolling,
        item: items[index]
      });
    },
    style: {
      flex: 1,
      overflowX: "hidden"
    },
    totalCount: items.length
  });
};
const CollaborationView = () => {
  const numPickedAssets = useTypedSelector(selectAssetsPickedLength);
  const collaborations = useTypedSelector(selectCollaborations);
  const fetching = useTypedSelector(state => state.collaborations.fetching);
  const fetchCount = useTypedSelector(state => state.collaborations.fetchCount);
  const fetchComplete = fetchCount !== -1;
  const hasCollaborations = !fetching && (collaborations == null ? void 0 : collaborations.length) > 0;
  const hasPicked = !!(numPickedAssets > 0);
  return /* @__PURE__ */jsxs(Flex, {
    direction: "column",
    flex: 1,
    height: "fill",
    children: [/* @__PURE__ */jsx(CollaborationViewHeader, {
      allowCreate: true,
      light: hasPicked,
      title: hasPicked ? "Collaborations (in selection)" : "Collaborations"
    }), fetchComplete && !hasCollaborations && /* @__PURE__ */jsx(Box, {
      padding: 3,
      children: /* @__PURE__ */jsx(Text, {
        muted: true,
        size: 1,
        children: /* @__PURE__ */jsx("em", {
          children: "No Collaborations"
        })
      })
    }), hasCollaborations && /* @__PURE__ */jsx(CollaborationsVirtualized, {})]
  });
};
const CollaborationsPanel = () => {
  const collaborationsPanelVisible = useTypedSelector(state => state.collaborations.panelVisible);
  if (!collaborationsPanelVisible) {
    return null;
  }
  return /* @__PURE__ */jsx(Box, {
    style: {
      position: "relative",
      width: TAGS_PANEL_WIDTH
    },
    children: /* @__PURE__ */jsx(Box, {
      className: "media__custom-scrollbar",
      style: {
        borderLeft: "1px solid var(--card-border-color)",
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        position: "absolute",
        right: 0,
        top: 0,
        width: "100%"
      },
      children: /* @__PURE__ */jsx(CollaborationView, {})
    })
  });
};
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", {
  value: __freeze(raw || cooked.slice())
}));
var _a, _b;
const BrowserContent = _ref101 => {
  let {
    onClose
  } = _ref101;
  const client = useVersionedClient();
  const [portalElement, setPortalElement] = useState(null);
  const dispatch = useDispatch();
  const handleAssetUpdate = update => {
    const {
      documentId,
      result,
      transition
    } = update;
    if (transition === "appear") {
      dispatch(assetsActions.listenerCreateQueue({
        asset: result
      }));
    }
    if (transition === "disappear") {
      dispatch(assetsActions.listenerDeleteQueue({
        assetId: documentId
      }));
    }
    if (transition === "update") {
      dispatch(assetsActions.listenerUpdateQueue({
        asset: result
      }));
    }
  };
  const handleTagUpdate = update => {
    const {
      documentId,
      result,
      transition
    } = update;
    if (transition === "appear") {
      dispatch(tagsActions.listenerCreateQueue({
        tag: result
      }));
    }
    if (transition === "disappear") {
      dispatch(tagsActions.listenerDeleteQueue({
        tagId: documentId
      }));
    }
    if (transition === "update") {
      dispatch(tagsActions.listenerUpdateQueue({
        tag: result
      }));
    }
  };
  useEffect(() => {
    dispatch(assetsActions.loadPageIndex({
      pageIndex: 0
    }));
    dispatch(tagsActions.fetchRequest());
    dispatch(seasonActions.fetchRequest());
    dispatch(collaborationActions.fetchRequest());
    const subscriptionAsset = client.listen(groq(_a || (_a = __template(['*[_type in ["sanity.fileAsset", "sanity.imageAsset"] && !(_id in path("drafts.**"))]'])))).subscribe(handleAssetUpdate);
    const subscriptionTag = client.listen(groq(_b || (_b = __template(['*[_type == "', '" && !(_id in path("drafts.**"))]'])), TAG_DOCUMENT_NAME)).subscribe(handleTagUpdate);
    return () => {
      subscriptionAsset == null ? void 0 : subscriptionAsset.unsubscribe();
      subscriptionTag == null ? void 0 : subscriptionTag.unsubscribe();
    };
  }, []);
  return /* @__PURE__ */jsx(PortalProvider, {
    element: portalElement,
    children: /* @__PURE__ */jsxs(UploadDropzone, {
      children: [/* @__PURE__ */jsx(Dialogs, {}), /* @__PURE__ */jsx(Notifications, {}), /* @__PURE__ */jsx(Card, {
        display: "flex",
        height: "fill",
        ref: setPortalElement,
        children: /* @__PURE__ */jsxs(Flex, {
          direction: "column",
          flex: 1,
          children: [/* @__PURE__ */jsx(Header, {
            onClose
          }), /* @__PURE__ */jsx(Controls, {}), /* @__PURE__ */jsxs(Flex, {
            flex: 1,
            children: [/* @__PURE__ */jsxs(Flex, {
              align: "flex-end",
              direction: "column",
              flex: 1,
              style: {
                position: "relative"
              },
              children: [/* @__PURE__ */jsx(PickedBar, {}), /* @__PURE__ */jsx(Items, {})]
            }), /* @__PURE__ */jsx(SeasonsPanel, {}), /* @__PURE__ */jsx(CollaborationsPanel, {})]
          }), /* @__PURE__ */jsx(DebugControls, {})]
        })
      })]
    })
  });
};
const Browser = props => {
  const client = useVersionedClient();
  const {
    scheme
  } = useColorScheme();
  return /* @__PURE__ */jsx(ReduxProvider, {
    assetType: props == null ? void 0 : props.assetType,
    client,
    document: props == null ? void 0 : props.document,
    selectedAssets: props == null ? void 0 : props.selectedAssets,
    children: /* @__PURE__ */jsx(ThemeProvider, {
      scheme,
      theme: studioTheme,
      children: /* @__PURE__ */jsx(ToastProvider, {
        children: /* @__PURE__ */jsxs(AssetBrowserDispatchProvider, {
          onSelect: props == null ? void 0 : props.onSelect,
          children: [/* @__PURE__ */jsx(GlobalStyle, {}), /* @__PURE__ */jsx(BrowserContent, {
            onClose: props == null ? void 0 : props.onClose
          })]
        })
      })
    })
  });
};
const FormBuilderTool = props => {
  const {
    onClose
  } = props;
  const portalElement = useRootPortalElement();
  const currentDocument = useFormValue([]);
  useKeyPress("escape", onClose);
  const handleStopPropagation = event => {
    event.nativeEvent.stopImmediatePropagation();
    event.stopPropagation();
  };
  const {
    zIndex
  } = useLayer();
  return /* @__PURE__ */jsx(PortalProvider, {
    element: portalElement,
    children: /* @__PURE__ */jsx(Portal, {
      children: /* @__PURE__ */jsx(Box, {
        onDragEnter: handleStopPropagation,
        onDragLeave: handleStopPropagation,
        onDragOver: handleStopPropagation,
        onDrop: handleStopPropagation,
        onMouseUp: handleStopPropagation,
        style: {
          bottom: 0,
          height: "auto",
          left: 0,
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex
        },
        children: /* @__PURE__ */jsx(Browser, {
          document: currentDocument,
          ...props
        })
      })
    })
  });
};
const useRootPortalElement = () => {
  const [container] = useState(() => document.createElement("div"));
  useEffect(() => {
    container.classList.add("media-portal");
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);
  return container;
};
const Tool = () => {
  return /* @__PURE__ */jsx(Flex, {
    direction: "column",
    height: "fill",
    flex: 1,
    children: /* @__PURE__ */jsx(Browser, {})
  });
};
var mediaTag = {
  title: "Media Tag",
  icon: TagIcon,
  name: TAG_DOCUMENT_NAME,
  type: "object",
  hidden: true,
  fields: [{
    title: "Name",
    name: "name",
    type: "slug"
  }],
  preview: {
    select: {
      name: "name"
    },
    prepare(selection) {
      const {
        name
      } = selection;
      return {
        media: TagIcon,
        title: name == null ? void 0 : name.current
      };
    }
  }
};
var mediaSeason = {
  title: "Season",
  icon: TagIcon,
  name: SEASONS_DOCUMENT_NAME,
  type: "document",
  fields: [{
    title: "Name",
    name: "name",
    type: "slug"
  }],
  preview: {
    select: {
      name: "name"
    },
    prepare(selection) {
      const {
        name
      } = selection;
      return {
        media: TagIcon,
        title: name == null ? void 0 : name.current
      };
    }
  }
};
var mediaCollaboration = {
  title: "Drops",
  icon: TagIcon,
  name: COLLABORATION_DOCUMENT_NAME,
  type: "document",
  fields: [{
    title: "Name",
    name: "name",
    type: "slug"
  }],
  preview: {
    select: {
      name: "name"
    },
    prepare(selection) {
      const {
        name
      } = selection;
      return {
        media: TagIcon,
        title: name == null ? void 0 : name.current
      };
    }
  }
};
const plugin = {
  icon: ImageIcon,
  name: "media",
  title: "Media"
};
const mediaAssetSource = {
  ...plugin,
  component: FormBuilderTool
};
const tool = {
  ...plugin,
  component: Tool
};
const media = definePlugin({
  name: "media",
  form: {
    file: {
      assetSources: prev => {
        return [...prev, mediaAssetSource];
      }
    },
    image: {
      assetSources: () => {
        return [mediaAssetSource];
      }
    }
  },
  schema: {
    types: [mediaTag, mediaSeason, mediaCollaboration]
  },
  tools: prev => {
    return [...prev, tool];
  }
});
export { media, mediaAssetSource };
//# sourceMappingURL=index.esm.js.map
