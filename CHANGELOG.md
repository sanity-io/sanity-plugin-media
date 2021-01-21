# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.5.0-beta.8](https://github.com/robinpyon/sanity-plugin-media/compare/v0.5.0-beta.7...v0.5.0-beta.8) (2021-01-21)

## [0.5.0-beta.7](https://github.com/robinpyon/sanity-plugin-media/compare/v0.5.0-beta.6...v0.5.0-beta.7) (2021-01-19)


### Features

* display checkmark icons and prevent click actions on selected assets ([30d174d](https://github.com/robinpyon/sanity-plugin-media/commit/30d174d2bd51a2543b8e4b9dfe6a368fe5d139d2))


### Bug Fixes

* add text-overflow: ellipsis to header ([6f39d28](https://github.com/robinpyon/sanity-plugin-media/commit/6f39d284a1fea47ff82818353a1e97d9404e077e))
* dont close all edit dialogs on update/delete ([e18565d](https://github.com/robinpyon/sanity-plugin-media/commit/e18565d487dd9a14b1c81e0707cea1dd609ba815))
* fix asset update notification label ([9a2ae2a](https://github.com/robinpyon/sanity-plugin-media/commit/9a2ae2a1589956e0bb57205a91caceb42bf4bedc))
* rename tag document name, move media-specific fields into opt.media namespace ([d5666fc](https://github.com/robinpyon/sanity-plugin-media/commit/d5666fc32b62056be76379d50fcf64415047b7f9))

## [0.5.0-beta.6](https://github.com/robinpyon/sanity-plugin-media/compare/v0.5.0-beta.5...v0.5.0-beta.6) (2021-01-10)


### Bug Fixes

* use generic 'asset' term when displaying errors, picked status and delete confirmation ([74eb4ba](https://github.com/robinpyon/sanity-plugin-media/commit/74eb4baeeb5f53d1eb92666b480f1115f0ca57f5))

## [0.5.0-beta.5](https://github.com/robinpyon/sanity-plugin-media/compare/v0.5.0-beta.4...v0.5.0-beta.5) (2021-01-10)


### Features

* add support for context-specific search facets ([86a9c6d](https://github.com/robinpyon/sanity-plugin-media/commit/86a9c6da51f917ce9bb5424efa58eab9c8bf7e7a))

## [0.5.0-beta.4](https://github.com/robinpyon/sanity-plugin-media/compare/v0.5.0-beta.3...v0.5.0-beta.4) (2021-01-10)


### Features

* add initial support for displaying file assets ([cc01d00](https://github.com/robinpyon/sanity-plugin-media/commit/cc01d00ffdf039915e941d27d515af3b33c725c8))
* add support for future facet groups, re-work facet schema slightly, use smaller menu item size ([bc3046b](https://github.com/robinpyon/sanity-plugin-media/commit/bc3046b621c3819f644e0d404e8559f5834ff564))


### Bug Fixes

* hide text overflow on asset metadata rows ([7f104eb](https://github.com/robinpyon/sanity-plugin-media/commit/7f104ebdb0ffc4231973b80482cb6a2c904f1585))

## [0.5.0-beta.3](https://github.com/robinpyon/sanity-plugin-media/compare/v0.5.0-beta.2...v0.5.0-beta.3) (2021-01-08)

## [0.5.0-beta.2](https://github.com/robinpyon/sanity-plugin-media/compare/v0.5.0-beta.1...v0.5.0-beta.2) (2021-01-07)


### Features

* fetch and expose a limited subset of exif metadata ([da9f8bb](https://github.com/robinpyon/sanity-plugin-media/commit/da9f8bb5aa31d7bfec3f7434d483f669d339931f))

## [0.5.0-beta.1](https://github.com/robinpyon/sanity-plugin-media/compare/v0.5.0-beta.0...v0.5.0-beta.1) (2021-01-07)


### Features

* add confirmation dialog when deleting multiple assets ([031e22b](https://github.com/robinpyon/sanity-plugin-media/commit/031e22b9ee983f121290d09cd94962a7f126367f))
* add dev mode debug bar and request throttling ([c949c56](https://github.com/robinpyon/sanity-plugin-media/commit/c949c563440871d522abfcb5ee399f96ac9ed406))
* add initial tags reducer, add type safety to action creators and epics, style react-select ([66e620a](https://github.com/robinpyon/sanity-plugin-media/commit/66e620a68d4ba07a70c99541e999ab48050a8fbf))
* add keyboard shortcut to toggle debug panel, move state into debug reducer ([e76a9d6](https://github.com/robinpyon/sanity-plugin-media/commit/e76a9d6c7676d7a66e17884e493c6ba6277ecfce))
* add separate search facets dialog, add small breakpoint facet layout ([def9852](https://github.com/robinpyon/sanity-plugin-media/commit/def98525bda03a2d5fe44a0445dd55db1ea26239))
* add tag schema, add listener redux events and update asset stores on listener mutations ([63403e3](https://github.com/robinpyon/sanity-plugin-media/commit/63403e36ee3995b62db22a003da7e520a36cdef5))
* add tag search facet with custom styles ([beef859](https://github.com/robinpyon/sanity-plugin-media/commit/beef8597fa5c951133aa34f1bb2c44503cc5f20d))
* allow DPR sensitive image urls to accept height values, increase image size in details dialog ([88c3e96](https://github.com/robinpyon/sanity-plugin-media/commit/88c3e961b32ebf116e978c9e3efba74f88618392))
* dialog rewrite: allow for nestable dialogs - and use shared dialog for single + multi delete" ([9ce09c9](https://github.com/robinpyon/sanity-plugin-media/commit/9ce09c938814de9c79ee6304ac07641342d76a45))
* download files with original filenames ([984a9b4](https://github.com/robinpyon/sanity-plugin-media/commit/984a9b45848860c16e5a4022fc13b165ee28febb))
* first pass of string search facet input, add operator conditional to hide inputs ([67533b5](https://github.com/robinpyon/sanity-plugin-media/commit/67533b57bff4a947ed648e4c9dae7a104d9a8332))
* initial pass of update modal, allow for targeted dialog close on update / delete ([ee93438](https://github.com/robinpyon/sanity-plugin-media/commit/ee934382f0640e1bc9d570125400bcb7ebf1ea07))
* update search to find matches in altText, description and title fields ([65a81f7](https://github.com/robinpyon/sanity-plugin-media/commit/65a81f7a453e9c22db1443d576054cc9a4a9e3ce))


### Bug Fixes

* add optional chaining / existential operator when querying for picked status ([ea3cf93](https://github.com/robinpyon/sanity-plugin-media/commit/ea3cf93bc2e3a9308fa9a1d13712eed3ffa137f5))
* add tag listeners ([77e8e05](https://github.com/robinpyon/sanity-plugin-media/commit/77e8e055450b44e61c4e84eb2f946d736cc264b8))
* correctly adjust viewport height on asset pick, clear picked status on filter / search changes ([9d1b1b6](https://github.com/robinpyon/sanity-plugin-media/commit/9d1b1b6a2e54fe0a7ebb5e5328febee502a64c21))
* correctly dirty form when a new tag has been manually added ([c0333eb](https://github.com/robinpyon/sanity-plugin-media/commit/c0333eb5a15d0b7f2705bfb54c8175abf4e47d37))
* correctly query custom asset fields (altText, description + title) ([fc987c1](https://github.com/robinpyon/sanity-plugin-media/commit/fc987c1be06b99064163c77de0299047338de2f1))
* correctly store newly created tags, refactor custom throttle rxjs operator ([93010a1](https://github.com/robinpyon/sanity-plugin-media/commit/93010a131391eae7a0b2cbd0035750179e21153a))
* correctly store tag id when create new tags in dialog form, trim whitespace from new tag names ([36f01b3](https://github.com/robinpyon/sanity-plugin-media/commit/36f01b312383ae8a6a9d675360f13aec0776b459))
* correctly update tags field when creating new tags ([dcfeace](https://github.com/robinpyon/sanity-plugin-media/commit/dcfeace953f24e47f024eac0a82a6e16c19beb2d))
* don't partially reset react-hook-form on mount ([8636f4a](https://github.com/robinpyon/sanity-plugin-media/commit/8636f4a237fa7d26637c7a54c2638beee251f609))
* dont send undefined values when submitting patches ([9293957](https://github.com/robinpyon/sanity-plugin-media/commit/92939579a72ea5a14d92da04b1a84f9d92898099))
* dont store lastTouched in assets, don't force re-fetch on search query change ([a93ad62](https://github.com/robinpyon/sanity-plugin-media/commit/a93ad62a79d5866bcd2e082773bdfea4be4894a9))
* ensure empty tags field returns null when empty ([9fa83c0](https://github.com/robinpyon/sanity-plugin-media/commit/9fa83c011022397577609ac316c77dd7e57a2466))
* fallback to default facet number value if none provided ([26deab6](https://github.com/robinpyon/sanity-plugin-media/commit/26deab6b9977bb81ffaf97ad6a74442c30ccabfa))
* fix regression with dialogs not correctly invoking from table rows ([7bb095d](https://github.com/robinpyon/sanity-plugin-media/commit/7bb095d8b42cd78c426d3ffc98eb1f7fc11c3535))
* fix regression with react-hook-form not being reset on asset listener update ([2fdf0f8](https://github.com/robinpyon/sanity-plugin-media/commit/2fdf0f87bc47d94393a511b10bb8d7c0c60eed4d))
* ignore draft image assets in all fetch requests ([50679fb](https://github.com/robinpyon/sanity-plugin-media/commit/50679fb6cee9d49dad132168360d0a9b193231c8))
* ignore draft listener mutations, fix issues with form defaultValues and syncing ([ef83804](https://github.com/robinpyon/sanity-plugin-media/commit/ef8380424469ac9235514eab9b3d0658e6a75308))
* only pick / unpick visible assets, not the entire set ([eb78e02](https://github.com/robinpyon/sanity-plugin-media/commit/eb78e021c356d843b5230b067681198c271c6411))
* only splice / remove assets if a valid index has been found ([70d7304](https://github.com/robinpyon/sanity-plugin-media/commit/70d730405b2e2a368b8641da8236b1812824462e))
* prevent dialog from scrolling down to the download button on smaller screens ([45bbd40](https://github.com/robinpyon/sanity-plugin-media/commit/45bbd40c1b9a163b3bb4aa0478643a0308037156))
* prevent unnecesary re-renders on key presses ([8118235](https://github.com/robinpyon/sanity-plugin-media/commit/8118235b43e3415f1f2dbe923d28f5200209857c))
* re-sort tags on all listener mutations, fix minor rendering issue with single value tag ([c55c70a](https://github.com/robinpyon/sanity-plugin-media/commit/c55c70a651295be3864d6d5332a76f0dc49fae84))
* remove mime type sort, allow for empty strings in number search facet input fields ([4b1a07a](https://github.com/robinpyon/sanity-plugin-media/commit/4b1a07ab720ed03ce032af22589a72d5e07ab347))
* remove redundant select lookup ([fdadc84](https://github.com/robinpyon/sanity-plugin-media/commit/fdadc843074e8b3083fd54f9f3295e23e64cf29f))
* round custom filters to ensure correct file size comparison, use base 10 (SI) file sizes ([b3c2cfc](https://github.com/robinpyon/sanity-plugin-media/commit/b3c2cfcb58e02e4f07cfaf087631cb26d28e0c3b))
* sanitise form data before submission: strip nullish values ([17bdb4a](https://github.com/robinpyon/sanity-plugin-media/commit/17bdb4ad695e455697b6c5ac7bb325776ef8395a))
* unpick selected assets on delete, prevent pointer events / hover actions during update ([698d0e5](https://github.com/robinpyon/sanity-plugin-media/commit/698d0e555cf4b6869dc5b5bce20fa8ad5c625e18))

## [0.5.0-beta.0](https://github.com/robinpyon/sanity-plugin-media/compare/v0.4.0...v0.5.0-beta.0) (2020-12-16)


### Features

* add clear search facet button + redux action ([a072074](https://github.com/robinpyon/sanity-plugin-media/commit/a072074c58c178a8d729023ac76ca655705e5781))
* add pick toggle checkbox to table header ([8622901](https://github.com/robinpyon/sanity-plugin-media/commit/8622901ca16354899f9699ebf7c0f748d46447d3))
* add width + height search facets, only apply modifier if function is present ([c4a7351](https://github.com/robinpyon/sanity-plugin-media/commit/c4a7351dafd20b4e45d7e1a7d41b44235c1cb667))
* first pass of search facet functionality, debounce redux actions rather than search input ([493825f](https://github.com/robinpyon/sanity-plugin-media/commit/493825fbb831ba13cc5c0ec9dbb0569e8e19c2aa))
* port more components to sanity/ui, add sortable table headers with additional sort orders ([8ac5b6d](https://github.com/robinpyon/sanity-plugin-media/commit/8ac5b6d2346eed30aa03f9bef705165c99a06f94))
* significant structural changes in prep for custom tagging / editing ([63aa7e5](https://github.com/robinpyon/sanity-plugin-media/commit/63aa7e5199a4dbc98a0466af2149463a2ff66575))
* update shift selection behaviour and allow for range picking ([e0a3e8f](https://github.com/robinpyon/sanity-plugin-media/commit/e0a3e8f2816be730af0a254bb495cd359a6d2534))


### Bug Fixes

* apply logical operators to number search facet ([f6299f7](https://github.com/robinpyon/sanity-plugin-media/commit/f6299f7967ff817bc941dbd5408152befc73fa14))
* don't display filled table header checkbox whilst fetching ([d9645d9](https://github.com/robinpyon/sanity-plugin-media/commit/d9645d97c2e20fd3c8dd322949f39352c84adbca))
* don't try and parse empty values, default text input number to 0 ([19a4621](https://github.com/robinpyon/sanity-plugin-media/commit/19a462192f1b6ec784cf6a4c22e3a86b03eef5e2))
* fix regression with progress bar not displaying ([4a905b5](https://github.com/robinpyon/sanity-plugin-media/commit/4a905b5e479653f2bab8f62600ccaa3e61ff238a))
* rename footer to picked bar, correctly measure react-window container height ([071898b](https://github.com/robinpyon/sanity-plugin-media/commit/071898b43660609e990c045cfacf7c742364624f))

## [0.5.0-beta.0](https://github.com/robinpyon/sanity-plugin-media/compare/v0.4.0...v0.5.0-beta.0) (2020-12-16)


### Features

* add clear search facet button + redux action ([a072074](https://github.com/robinpyon/sanity-plugin-media/commit/a072074c58c178a8d729023ac76ca655705e5781))
* add pick toggle checkbox to table header ([8622901](https://github.com/robinpyon/sanity-plugin-media/commit/8622901ca16354899f9699ebf7c0f748d46447d3))
* add width + height search facets, only apply modifier if function is present ([c4a7351](https://github.com/robinpyon/sanity-plugin-media/commit/c4a7351dafd20b4e45d7e1a7d41b44235c1cb667))
* first pass of search facet functionality, debounce redux actions rather than search input ([493825f](https://github.com/robinpyon/sanity-plugin-media/commit/493825fbb831ba13cc5c0ec9dbb0569e8e19c2aa))
* port more components to sanity/ui, add sortable table headers with additional sort orders ([8ac5b6d](https://github.com/robinpyon/sanity-plugin-media/commit/8ac5b6d2346eed30aa03f9bef705165c99a06f94))
* significant structural changes in prep for custom tagging / editing ([63aa7e5](https://github.com/robinpyon/sanity-plugin-media/commit/63aa7e5199a4dbc98a0466af2149463a2ff66575))
* update shift selection behaviour and allow for range picking ([e0a3e8f](https://github.com/robinpyon/sanity-plugin-media/commit/e0a3e8f2816be730af0a254bb495cd359a6d2534))


### Bug Fixes

* apply logical operators to number search facet ([f6299f7](https://github.com/robinpyon/sanity-plugin-media/commit/f6299f7967ff817bc941dbd5408152befc73fa14))
* don't display filled table header checkbox whilst fetching ([d9645d9](https://github.com/robinpyon/sanity-plugin-media/commit/d9645d97c2e20fd3c8dd322949f39352c84adbca))
* don't try and parse empty values, default text input number to 0 ([19a4621](https://github.com/robinpyon/sanity-plugin-media/commit/19a462192f1b6ec784cf6a4c22e3a86b03eef5e2))
* fix regression with progress bar not displaying ([4a905b5](https://github.com/robinpyon/sanity-plugin-media/commit/4a905b5e479653f2bab8f62600ccaa3e61ff238a))
* rename footer to picked bar, correctly measure react-window container height ([071898b](https://github.com/robinpyon/sanity-plugin-media/commit/071898b43660609e990c045cfacf7c742364624f))
