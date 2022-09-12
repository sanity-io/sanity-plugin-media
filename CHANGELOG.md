# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.4.11](https://github.com/robinpyon/sanity-plugin-media/compare/v1.4.8...v1.4.11) (2022-09-12)


### Bug Fixes

* don't hardcode z-indices, correctly render last filter item ([#57](https://github.com/robinpyon/sanity-plugin-media/issues/57), [#82](https://github.com/robinpyon/sanity-plugin-media/issues/82)) ([b16375e](https://github.com/robinpyon/sanity-plugin-media/commit/b16375e664b662b4657823c90bc6447bc7d9d5d2))
* remove rxjs and @sanity/client from peerDependencies ([b4df1f5](https://github.com/robinpyon/sanity-plugin-media/commit/b4df1f5ba067ff0e28dda08d376b03d444967d68))
* throw an error when trying to call window.crypto from insecure contexts ([#50](https://github.com/robinpyon/sanity-plugin-media/issues/50)) ([fd02d72](https://github.com/robinpyon/sanity-plugin-media/commit/fd02d727d6e6ae5771f1bcb64ef818fe2aff05dc))

### [1.4.10](https://github.com/robinpyon/sanity-plugin-media/compare/v1.4.8...v1.4.10) (2022-06-01)

### Bug Fixes

- revert "refactor: add eslint-plugin-react-hooks, fix `exhaustive-deps` issues" ([5f55231](https://github.com/robinpyon/sanity-plugin-media/commit/5f5523100e7215e143396f760e527172579f0299))

### [1.4.9](https://github.com/robinpyon/sanity-plugin-media/compare/v1.4.8...v1.4.9) (2022-05-29)

### Bug Fixes

- remove rxjs and @sanity/client from peerDependencies ([b4df1f5](https://github.com/robinpyon/sanity-plugin-media/commit/b4df1f5ba067ff0e28dda08d376b03d444967d68))
- revert "fix: flatten blob gen + upload actions to ensure null blobs correctly throw errors and bubble up" ([7a387c4](https://github.com/robinpyon/sanity-plugin-media/commit/7a387c43c7a6701a9c3e7876d189722e03161e17))

### [1.4.8](https://github.com/robinpyon/sanity-plugin-media/compare/v1.4.7...v1.4.8) (2022-05-05)

### Bug Fixes

- fix regression with onSelect not passing an array ([dae8628](https://github.com/robinpyon/sanity-plugin-media/commit/dae86286ec11555b5ed4619a7de34e3d1a8c66e4))

### [1.4.7](https://github.com/robinpyon/sanity-plugin-media/compare/v1.4.6...v1.4.7) (2022-05-04)

### Bug Fixes

- render search facets <MenuButton> in a portal to prevent clipping at smaller breakpoints ([b0c7f91](https://github.com/robinpyon/sanity-plugin-media/commit/b0c7f911d900e92096548482deb2f550913e4aa2))

### [1.4.6](https://github.com/robinpyon/sanity-plugin-media/compare/v1.4.5...v1.4.6) (2022-05-04)

### [1.4.5](https://github.com/robinpyon/sanity-plugin-media/compare/v1.4.3...v1.4.5) (2022-05-04)

### Bug Fixes

- don't re-upload files that are in the process of being uploaded ([150df9e](https://github.com/robinpyon/sanity-plugin-media/commit/150df9e8711d6e06356eb6c1be20a9ed8fa26dcb))
- extract blurhash on new uploads, move @sanity/client and rxjs to peer deps ([c67cae2](https://github.com/robinpyon/sanity-plugin-media/commit/c67cae28676689cb21f1015aca1e9576fe3a859b))
- flatten blob gen + upload actions to ensure null blobs correctly throw errors and bubble up ([834ebb0](https://github.com/robinpyon/sanity-plugin-media/commit/834ebb0eca4cb4556436b37d24735f9c45e40801))
- prevent layout issues and 'zero-sized element' errors in react-virtuoso ([c0233c9](https://github.com/robinpyon/sanity-plugin-media/commit/c0233c9e898594b6475b03ac4f0020339e02044a))
- prevent upload cancellation when asset `percentLoaded === 100` ([501e452](https://github.com/robinpyon/sanity-plugin-media/commit/501e452df91c0eae1f74ce98947fa4912c658cc1))
- wrap tool browser in a flex element, fix layout issues on smaller breakpoints ([20b1877](https://github.com/robinpyon/sanity-plugin-media/commit/20b18771a7e824ca0620cd0aa30b90978a421352))

### [1.4.4](https://github.com/robinpyon/sanity-plugin-media/compare/v1.4.3...v1.4.4) (2021-11-14)

### [1.4.3](https://github.com/robinpyon/sanity-plugin-media/compare/v1.4.2...v1.4.3) (2021-10-26)

### Bug Fixes

- expose \_id, assetId and url in default input search ([0f7d544](https://github.com/robinpyon/sanity-plugin-media/commit/0f7d544d7b688972e3d12f1fac1b6a2bc3b94a02))

### [1.4.2](https://github.com/robinpyon/sanity-plugin-media/compare/v1.4.1...v1.4.2) (2021-10-21)

### Bug Fixes

- force minimum height on canvas when generating low res previews ([8e30854](https://github.com/robinpyon/sanity-plugin-media/commit/8e3085462cb2eeaa289b83e21dfa2e6ec7787831))

### [1.4.1](https://github.com/robinpyon/sanity-plugin-media/compare/v1.4.0...v1.4.1) (2021-10-14)

### Bug Fixes

- quickfix to work around a minor regression in sanity 2.21.0 ([1abf9e8](https://github.com/robinpyon/sanity-plugin-media/commit/1abf9e8b3f5f24e3848d4193193fba187fa65ab2))

## [1.4.0](https://github.com/robinpyon/sanity-plugin-media/compare/v1.3.1...v1.4.0) (2021-09-22)

### Features

- add filename facet ([4f70fab](https://github.com/robinpyon/sanity-plugin-media/commit/4f70fabbf7a47c16e60ae3d7d861b1381a5c4a9f))
- add initial file custom asset source support: conditionally filter and facet by asset type ([7a2b988](https://github.com/robinpyon/sanity-plugin-media/commit/7a2b9883827ff5283fed842cb8635fa7d509483b))
- add overscan to asset grid view ([7b3aaba](https://github.com/robinpyon/sanity-plugin-media/commit/7b3aabafa75cdda41380c900d9b96c0b654054c9))
- disable react-select until all tags have loaded in full ([5948a94](https://github.com/robinpyon/sanity-plugin-media/commit/5948a947ee32c860edad0a47aa9b8d20ec7111e8))
- virtualize react-select views ([f712c4c](https://github.com/robinpyon/sanity-plugin-media/commit/f712c4ccec9901321bcaaef7dca237c07dbdc49c))

### Bug Fixes

- ensure that generic tag deletion errors are caught and displayed in notifications ([b65e0e6](https://github.com/robinpyon/sanity-plugin-media/commit/b65e0e69cbce78fc0b49610ba87f5c0ec2707122))
- ensure that no empty virtuoso views are rendered ([04904e5](https://github.com/robinpyon/sanity-plugin-media/commit/04904e5ca408d424e28c2dca05d0b545d1b04b21))
- force fixed positioning on sanity-ui Dialogs to prevent mobile scrolling issues ([94465a5](https://github.com/robinpyon/sanity-plugin-media/commit/94465a5c89166501cd65d9d387f09d5c7d567b41))
- force search facet <MenuButton /> to render in a portal, remove hard-coded z-index ([4afb51e](https://github.com/robinpyon/sanity-plugin-media/commit/4afb51eed57926ca7279b351fd588f3ac86c70d6))
- **tags:** render all tags in a virtualized container ([abdc7e3](https://github.com/robinpyon/sanity-plugin-media/commit/abdc7e362d4ed5f62ff5bd632e9b886fdbd36771))

### [1.3.1](https://github.com/robinpyon/sanity-plugin-media/compare/v1.3.0...v1.3.1) (2021-05-09)

### Bug Fixes

- only check against asset.\_type when searching for linked asset IDs ([39a7a77](https://github.com/robinpyon/sanity-plugin-media/commit/39a7a774b1472f40042a1fc43c53b130af6d40f7))

## [1.3.0](https://github.com/robinpyon/sanity-plugin-media/compare/v1.2.2...v1.3.0) (2021-04-27)

### Features

- add “Copy URL” button to asset metadata actions ([4cf25cc](https://github.com/robinpyon/sanity-plugin-media/commit/4cf25ccf9c7124c83aac1ce07427a2d3344b976d))
- wrap copy URL button with a timed popover and move to a separate component ([4eb579e](https://github.com/robinpyon/sanity-plugin-media/commit/4eb579ebf416bc43f545ce8320a8b20bace7f5ad))

### [1.2.2](https://github.com/robinpyon/sanity-plugin-media/compare/v1.2.1...v1.2.2) (2021-03-29)

### Bug Fixes

- fix portal container positioning: use @sanity/ui portal component with scoped provider ([ea0cb07](https://github.com/robinpyon/sanity-plugin-media/commit/ea0cb0705e986b49c8df3862425e6718e6b131f2))

### [1.2.1](https://github.com/robinpyon/sanity-plugin-media/compare/v1.2.0...v1.2.1) (2021-03-29)

## [1.2.0](https://github.com/robinpyon/sanity-plugin-media/compare/v1.1.4...v1.2.0) (2021-03-25)

### Features

- use API-versioned client if available ([c953d1e](https://github.com/robinpyon/sanity-plugin-media/commit/c953d1e19219b037010fa530269fee691573ec16))

### [1.1.4](https://github.com/robinpyon/sanity-plugin-media/compare/v1.1.3...v1.1.4) (2021-03-10)

### [1.1.3](https://github.com/robinpyon/sanity-plugin-media/compare/v1.1.2...v1.1.3) (2021-03-10)

### Bug Fixes

- move sanity-ui and styled-components into peer deps ([6c51ba3](https://github.com/robinpyon/sanity-plugin-media/commit/6c51ba3ba8b6f5241c45934838820b7d78376519))

### [1.1.2](https://github.com/robinpyon/sanity-plugin-media/compare/v1.1.1...v1.1.2) (2021-02-27)

### Bug Fixes

- re-add ability to display all assets in current document, create dedicated selected reducer ([e89702d](https://github.com/robinpyon/sanity-plugin-media/commit/e89702d1cfc73d772856b3c8dacc4bc345aa7f16))

### [1.1.1](https://github.com/robinpyon/sanity-plugin-media/compare/v1.1.0...v1.1.1) (2021-02-26)

### Bug Fixes

- prevent dnd propagation in select context to prevent accidental uploads with native inputs ([6fe2297](https://github.com/robinpyon/sanity-plugin-media/commit/6fe22972f2d63bdfcf8b0d13918e903cfceb87b4))
- revert to wrapping select browser inside a custom portal to prevent z-index clashing ([14462ab](https://github.com/robinpyon/sanity-plugin-media/commit/14462abad1170a11e3fe26364b22ed94173809ad))

## [1.1.0](https://github.com/robinpyon/sanity-plugin-media/compare/v1.0.2...v1.1.0) (2021-02-24)

## Features

- add batch tag add / remove actions, minor dialog cleanup ([5e4170d](https://github.com/robinpyon/sanity-plugin-media/commit/5e4170df5546a68863066afec0d09a586dadc72f))
- add progress bars to both upload cards + rows ([fcd80ad](https://github.com/robinpyon/sanity-plugin-media/commit/fcd80ad9dbb4eae8409605e3780a0a2854504440))
- add support for cancelling uploads, tweak upload styles slightly ([07f1bac](https://github.com/robinpyon/sanity-plugin-media/commit/07f1bac90c9c4ffa8b61319ffde7053ca4f66fb9))
- create separate form submit button component with conditional toolip ([19db57d](https://github.com/robinpyon/sanity-plugin-media/commit/19db57df8713d2826c2b9db5f04669d64302b4f5))
- first pass of tag create/edit/delete actions, add redux-toolkit, simplify redux actions ([eb5d89e](https://github.com/robinpyon/sanity-plugin-media/commit/eb5d89ed025e040ef8b6ca3cb214889248f28e94))
- first pass of uploads with react-dropzone ([955aaf5](https://github.com/robinpyon/sanity-plugin-media/commit/955aaf506b40c08324d5c39d3649b5a3c0d986d0))

### Bug Fixes

- absolutely position react-window and prevent layout shift when picking assets ([0058dd5](https://github.com/robinpyon/sanity-plugin-media/commit/0058dd5e6744408c5102d44cecc9a764b0a429e7))
- add file icon to upload cards and rows ([2148db4](https://github.com/robinpyon/sanity-plugin-media/commit/2148db4cfea234f292aa455ce5eca0c63cb45760))
- add focus / select styles to react-select components ([5378162](https://github.com/robinpyon/sanity-plugin-media/commit/5378162bfc8706836720d800bb0df77395895b18))
- add notifications for tag updates ([028122d](https://github.com/robinpyon/sanity-plugin-media/commit/028122dc65a12d5cbb735d26cb6859ed4a5d5f87))
- add null check to sanitize form ([413448b](https://github.com/robinpyon/sanity-plugin-media/commit/413448b7b68258aad84c62ae621d3342584ed374))
- add tag listener to edit form ([5038ae0](https://github.com/robinpyon/sanity-plugin-media/commit/5038ae03c129719b340db7d82fa71247926e18c1))
- add timed buffer to tag and asset listener epics to prevent action spam on batch operations ([d982b0b](https://github.com/robinpyon/sanity-plugin-media/commit/d982b0b429fec2afb12d9e030b22f9b2248299f4))
- buffer all listener changes to prevent unnecessary renders in batch operations ([a7fa67e](https://github.com/robinpyon/sanity-plugin-media/commit/a7fa67ec85c0282a53ef2289d429655cc900a72a))
- bump rhf + react-select, correctly store tag in store after creation ([b457fd6](https://github.com/robinpyon/sanity-plugin-media/commit/b457fd601f29f62d76eac5066520e300738c5cc8))
- correctly search by reference when updating search tag facets ([abbf252](https://github.com/robinpyon/sanity-plugin-media/commit/abbf252e7217ee283678fd97fcc2eccacfb0fcbc))
- correctly use @sanity/ui media queries, tweak control bar styles on small breakpoint ([bdc8064](https://github.com/robinpyon/sanity-plugin-media/commit/bdc8064866fe93bb9050fec154b53d1a2729f739))
- disable folder + package uploads ([ac05549](https://github.com/robinpyon/sanity-plugin-media/commit/ac055490a8a8338890306828095133184e9110be))
- disable submit button + tag tooltips on touch devices ([bc9a4a5](https://github.com/robinpyon/sanity-plugin-media/commit/bc9a4a5a0b931430adc7b40a0624e140b8295ec7))
- disable tag buttons during updates, don't clear tag search facet when removing active tags ([139ba16](https://github.com/robinpyon/sanity-plugin-media/commit/139ba1670a8498e5d76c50d2348467ebf0c4ecea))
- disable word wrapping on table header cells ([c4de069](https://github.com/robinpyon/sanity-plugin-media/commit/c4de0699e103bfcaf79f500c80ce7411b6cf1d62))
- display message in tag panel if there are no tags ([12689cd](https://github.com/robinpyon/sanity-plugin-media/commit/12689cd9736c8a518975de916af81d85fc05ba38))
- ensure that newly created tag ids are added to `allIds` array ([36a7e4c](https://github.com/robinpyon/sanity-plugin-media/commit/36a7e4c1fa206207c9d6b7101614c586f2c66a60))
- fix issue where asset pick status wasn't being properly cleared on view / order change ([a74c7c0](https://github.com/robinpyon/sanity-plugin-media/commit/a74c7c03b09dda4b03fbf5772dcfebe267e26f90))
- fix issue where inline created tags weren't always appearing as expected ([a5e81d2](https://github.com/robinpyon/sanity-plugin-media/commit/a5e81d2114bc1bfda3b1d317e2869b324635cfc9))
- fix issue where MIME type order wasnt being displayed in order select dropdown ([f1c73df](https://github.com/robinpyon/sanity-plugin-media/commit/f1c73dffd50c81884c13c1e43e503cf85f7f33d4))
- fix issue with autoresizer height mismatch when selecting assets ([0affa7c](https://github.com/robinpyon/sanity-plugin-media/commit/0affa7cfe8eb1fea5c6aea60dd2ed4490c0bfc96))
- fix minor visual issue with tag search facet text cropping descenders ([0bd0249](https://github.com/robinpyon/sanity-plugin-media/commit/0bd0249269103bd1384b938fad3a85d1e523f89a))
- fix regession with shared delete asset epic - no longer refer to current state, only payload ([a13c79d](https://github.com/robinpyon/sanity-plugin-media/commit/a13c79d03a571cf99b06d625bd94a18e278f410a))
- fix regression with progress bar transform origin + order select dropdown z-index ([8dcca3f](https://github.com/robinpyon/sanity-plugin-media/commit/8dcca3fcbbd92b8d9b843ae5e702313149116d17))
- fix regression with selected assets not appearing correctly ([eb5a9e0](https://github.com/robinpyon/sanity-plugin-media/commit/eb5a9e08f0692ed7fad47d8e67a2c6802bad664f))
- fix spinner positioning and table row / card opacity during updates ([71f9bd9](https://github.com/robinpyon/sanity-plugin-media/commit/71f9bd92cb7cd9c963308bc94858a58f0ee5609d))
- force local tag + asset updates (in addition to those received by listeners) ([4dde089](https://github.com/robinpyon/sanity-plugin-media/commit/4dde08999cc97bab4e9c8c26115310b4919a567a))
- include \_createdAt in projection to try resolve ordering issues ([4f7295a](https://github.com/robinpyon/sanity-plugin-media/commit/4f7295a7a7f076a94151946518f56ee317aad2c0))
- on tag delete: create sanity transaction and delete referenced tags from linked assets ([625104a](https://github.com/robinpyon/sanity-plugin-media/commit/625104a2be6aab88b94d3ab5f60cf2a100e61bcb))
- only allow image uploads in select context, update upload button label ([9313a00](https://github.com/robinpyon/sanity-plugin-media/commit/9313a00d7ac8c1795f0a60ff9fb53e17f55e0bef))
- render react-select menu list in a portal, avoid hardcoding z-index, use BEM class syntax ([0e52a4c](https://github.com/robinpyon/sanity-plugin-media/commit/0e52a4cbbb4ee9abd6e4c4be33d524f346f9fa2d))
- temporarily disable serializable check ([f2a27ad](https://github.com/robinpyon/sanity-plugin-media/commit/f2a27ad3ed082022724cf9b0f0b17ad99214d92b))
- trim all formdata strings across both asset + tag dialog forms ([59ac8a1](https://github.com/robinpyon/sanity-plugin-media/commit/59ac8a18bf40e6cbd8fe2614dfd2128e5be21776))
- update page index after asset deletes, force asset fetch when deleting all visible assets ([c3178d7](https://github.com/robinpyon/sanity-plugin-media/commit/c3178d78dbcdfb0c5d5fb56ceb762a365d72250b))
- upon creation, don't add ids to store if already present ([b8645cc](https://github.com/robinpyon/sanity-plugin-media/commit/b8645cc12e33d7faee6c9e2cc2b769d0ed8da970))
- upon tag creation, don't add ids to store if already present ([7866076](https://github.com/robinpyon/sanity-plugin-media/commit/78660762d619ccc62c8c6e7e8e438ec7fa4f1dfa))
- various layout fixes to ensure compatibility with upcoming studio changes ([da027f6](https://github.com/robinpyon/sanity-plugin-media/commit/da027f6d2ea009bb59cf503a2580378f35474656))

### [1.0.2](https://github.com/robinpyon/sanity-plugin-media/compare/v1.0.1...v1.0.2) (2021-02-19)

### Bug Fixes

- determine asset select context based on the presence of `onSelect` rather than `document` ([4185c19](https://github.com/robinpyon/sanity-plugin-media/commit/4185c19ea50fc99ddb23faeaf1013b8c7294431a))

### [1.0.1](https://github.com/robinpyon/sanity-plugin-media/compare/v1.0.0...v1.0.1) (2021-01-23)

### Bug Fixes

- don't query for document ID when operating on pristine / unsaved drafts ([4083fc2](https://github.com/robinpyon/sanity-plugin-media/commit/4083fc29944c745dd019bdb7974475f9e75fbb6e)), closes [#20](https://github.com/robinpyon/sanity-plugin-media/issues/20)

## [1.0.0](https://github.com/robinpyon/sanity-plugin-media/compare/v0.5.0-beta.8...v1.0.0) (2021-01-22)

### Features

- add clear search facet button + redux action ([a072074](https://github.com/robinpyon/sanity-plugin-media/commit/a072074c58c178a8d729023ac76ca655705e5781))
- add confirmation dialog when deleting multiple assets ([031e22b](https://github.com/robinpyon/sanity-plugin-media/commit/031e22b9ee983f121290d09cd94962a7f126367f))
- add dev mode debug bar and request throttling ([c949c56](https://github.com/robinpyon/sanity-plugin-media/commit/c949c563440871d522abfcb5ee399f96ac9ed406))
- add initial support for displaying file assets ([cc01d00](https://github.com/robinpyon/sanity-plugin-media/commit/cc01d00ffdf039915e941d27d515af3b33c725c8))
- add initial tags reducer, add type safety to action creators and epics, style react-select ([66e620a](https://github.com/robinpyon/sanity-plugin-media/commit/66e620a68d4ba07a70c99541e999ab48050a8fbf))
- add keyboard shortcut to toggle debug panel, move state into debug reducer ([e76a9d6](https://github.com/robinpyon/sanity-plugin-media/commit/e76a9d6c7676d7a66e17884e493c6ba6277ecfce))
- add pick toggle checkbox to table header ([8622901](https://github.com/robinpyon/sanity-plugin-media/commit/8622901ca16354899f9699ebf7c0f748d46447d3))
- add separate search facets dialog, add small breakpoint facet layout ([def9852](https://github.com/robinpyon/sanity-plugin-media/commit/def98525bda03a2d5fe44a0445dd55db1ea26239))
- add support for context-specific search facets ([86a9c6d](https://github.com/robinpyon/sanity-plugin-media/commit/86a9c6da51f917ce9bb5424efa58eab9c8bf7e7a))
- add support for future facet groups, re-work facet schema slightly, use smaller menu item size ([bc3046b](https://github.com/robinpyon/sanity-plugin-media/commit/bc3046b621c3819f644e0d404e8559f5834ff564))
- add tag schema, add listener redux events and update asset stores on listener mutations ([63403e3](https://github.com/robinpyon/sanity-plugin-media/commit/63403e36ee3995b62db22a003da7e520a36cdef5))
- add tag search facet with custom styles ([beef859](https://github.com/robinpyon/sanity-plugin-media/commit/beef8597fa5c951133aa34f1bb2c44503cc5f20d))
- add width + height search facets, only apply modifier if function is present ([c4a7351](https://github.com/robinpyon/sanity-plugin-media/commit/c4a7351dafd20b4e45d7e1a7d41b44235c1cb667))
- allow DPR sensitive image urls to accept height values, increase image size in details dialog ([88c3e96](https://github.com/robinpyon/sanity-plugin-media/commit/88c3e961b32ebf116e978c9e3efba74f88618392))
- dialog rewrite: allow for nestable dialogs - and use shared dialog for single + multi delete" ([9ce09c9](https://github.com/robinpyon/sanity-plugin-media/commit/9ce09c938814de9c79ee6304ac07641342d76a45))
- download files with original filenames ([984a9b4](https://github.com/robinpyon/sanity-plugin-media/commit/984a9b45848860c16e5a4022fc13b165ee28febb))
- display checkmark icons and prevent click actions on selected assets ([30d174d](https://github.com/robinpyon/sanity-plugin-media/commit/30d174d2bd51a2543b8e4b9dfe6a368fe5d139d2))
- fetch and expose a limited subset of exif metadata ([da9f8bb](https://github.com/robinpyon/sanity-plugin-media/commit/da9f8bb5aa31d7bfec3f7434d483f669d339931f))
- first pass of search facet functionality, debounce redux actions rather than search input ([493825f](https://github.com/robinpyon/sanity-plugin-media/commit/493825fbb831ba13cc5c0ec9dbb0569e8e19c2aa))
- first pass of string search facet input, add operator conditional to hide inputs ([67533b5](https://github.com/robinpyon/sanity-plugin-media/commit/67533b57bff4a947ed648e4c9dae7a104d9a8332))
- initial pass of update modal, allow for targeted dialog close on update / delete ([ee93438](https://github.com/robinpyon/sanity-plugin-media/commit/ee934382f0640e1bc9d570125400bcb7ebf1ea07))
- port more components to sanity/ui, add sortable table headers with additional sort orders ([8ac5b6d](https://github.com/robinpyon/sanity-plugin-media/commit/8ac5b6d2346eed30aa03f9bef705165c99a06f94))
- significant structural changes in prep for custom tagging / editing ([63aa7e5](https://github.com/robinpyon/sanity-plugin-media/commit/63aa7e5199a4dbc98a0466af2149463a2ff66575))
- update search to find matches in altText, description and title fields ([65a81f7](https://github.com/robinpyon/sanity-plugin-media/commit/65a81f7a453e9c22db1443d576054cc9a4a9e3ce))
- update shift selection behaviour and allow for range picking ([e0a3e8f](https://github.com/robinpyon/sanity-plugin-media/commit/e0a3e8f2816be730af0a254bb495cd359a6d2534))

### Bug Fixes

- add optional chaining / existential operator when querying for picked status ([ea3cf93](https://github.com/robinpyon/sanity-plugin-media/commit/ea3cf93bc2e3a9308fa9a1d13712eed3ffa137f5))
- add tag listeners ([77e8e05](https://github.com/robinpyon/sanity-plugin-media/commit/77e8e055450b44e61c4e84eb2f946d736cc264b8))
- add text-overflow: ellipsis to header ([6f39d28](https://github.com/robinpyon/sanity-plugin-media/commit/6f39d284a1fea47ff82818353a1e97d9404e077e))
- apply logical operators to number search facet ([f6299f7](https://github.com/robinpyon/sanity-plugin-media/commit/f6299f7967ff817bc941dbd5408152befc73fa14))
- dont close all edit dialogs on update/delete ([e18565d](https://github.com/robinpyon/sanity-plugin-media/commit/e18565d487dd9a14b1c81e0707cea1dd609ba815))
- correctly adjust viewport height on asset pick, clear picked status on filter / search changes ([9d1b1b6](https://github.com/robinpyon/sanity-plugin-media/commit/9d1b1b6a2e54fe0a7ebb5e5328febee502a64c21))
- correctly dirty form when a new tag has been manually added ([c0333eb](https://github.com/robinpyon/sanity-plugin-media/commit/c0333eb5a15d0b7f2705bfb54c8175abf4e47d37))
- correctly query custom asset fields (altText, description + title) ([fc987c1](https://github.com/robinpyon/sanity-plugin-media/commit/fc987c1be06b99064163c77de0299047338de2f1))
- correctly store newly created tags, refactor custom throttle rxjs operator ([93010a1](https://github.com/robinpyon/sanity-plugin-media/commit/93010a131391eae7a0b2cbd0035750179e21153a))
- correctly store tag id when create new tags in dialog form, trim whitespace from new tag names ([36f01b3](https://github.com/robinpyon/sanity-plugin-media/commit/36f01b312383ae8a6a9d675360f13aec0776b459))
- correctly update tags field when creating new tags ([dcfeace](https://github.com/robinpyon/sanity-plugin-media/commit/dcfeace953f24e47f024eac0a82a6e16c19beb2d))
- don't display filled table header checkbox whilst fetching ([d9645d9](https://github.com/robinpyon/sanity-plugin-media/commit/d9645d97c2e20fd3c8dd322949f39352c84adbca))
- don't partially reset react-hook-form on mount ([8636f4a](https://github.com/robinpyon/sanity-plugin-media/commit/8636f4a237fa7d26637c7a54c2638beee251f609))
- dont send undefined values when submitting patches ([9293957](https://github.com/robinpyon/sanity-plugin-media/commit/92939579a72ea5a14d92da04b1a84f9d92898099))
- dont store lastTouched in assets, don't force re-fetch on search query change ([a93ad62](https://github.com/robinpyon/sanity-plugin-media/commit/a93ad62a79d5866bcd2e082773bdfea4be4894a9))
- don't try and parse empty values, default text input number to 0 ([19a4621](https://github.com/robinpyon/sanity-plugin-media/commit/19a462192f1b6ec784cf6a4c22e3a86b03eef5e2))
- ensure empty tags field returns null when empty ([9fa83c0](https://github.com/robinpyon/sanity-plugin-media/commit/9fa83c011022397577609ac316c77dd7e57a2466))
- fallback to default facet number value if none provided ([26deab6](https://github.com/robinpyon/sanity-plugin-media/commit/26deab6b9977bb81ffaf97ad6a74442c30ccabfa))
- fix asset update notification label ([9a2ae2a](https://github.com/robinpyon/sanity-plugin-media/commit/9a2ae2a1589956e0bb57205a91caceb42bf4bedc))
- fix regression with dialogs not correctly invoking from table rows ([7bb095d](https://github.com/robinpyon/sanity-plugin-media/commit/7bb095d8b42cd78c426d3ffc98eb1f7fc11c3535))
- fix regression with progress bar not displaying ([4a905b5](https://github.com/robinpyon/sanity-plugin-media/commit/4a905b5e479653f2bab8f62600ccaa3e61ff238a))
- fix regression with react-hook-form not being reset on asset listener update ([2fdf0f8](https://github.com/robinpyon/sanity-plugin-media/commit/2fdf0f87bc47d94393a511b10bb8d7c0c60eed4d))
- hide text overflow on asset metadata rows ([7f104eb](https://github.com/robinpyon/sanity-plugin-media/commit/7f104ebdb0ffc4231973b80482cb6a2c904f1585))
- ignore draft image assets in all fetch requests ([50679fb](https://github.com/robinpyon/sanity-plugin-media/commit/50679fb6cee9d49dad132168360d0a9b193231c8))
- ignore draft listener mutations, fix issues with form defaultValues and syncing ([ef83804](https://github.com/robinpyon/sanity-plugin-media/commit/ef8380424469ac9235514eab9b3d0658e6a75308))
- only pick / unpick visible assets, not the entire set ([eb78e02](https://github.com/robinpyon/sanity-plugin-media/commit/eb78e021c356d843b5230b067681198c271c6411))
- only splice / remove assets if a valid index has been found ([70d7304](https://github.com/robinpyon/sanity-plugin-media/commit/70d730405b2e2a368b8641da8236b1812824462e))
- prevent dialog from scrolling down to the download button on smaller screens ([45bbd40](https://github.com/robinpyon/sanity-plugin-media/commit/45bbd40c1b9a163b3bb4aa0478643a0308037156))
- prevent unnecesary re-renders on key presses ([8118235](https://github.com/robinpyon/sanity-plugin-media/commit/8118235b43e3415f1f2dbe923d28f5200209857c))
- remove mime type sort, allow for empty strings in number search facet input fields ([4b1a07a](https://github.com/robinpyon/sanity-plugin-media/commit/4b1a07ab720ed03ce032af22589a72d5e07ab347))
- remove redundant select lookup ([fdadc84](https://github.com/robinpyon/sanity-plugin-media/commit/fdadc843074e8b3083fd54f9f3295e23e64cf29f))
- rename footer to picked bar, correctly measure react-window container height ([071898b](https://github.com/robinpyon/sanity-plugin-media/commit/071898b43660609e990c045cfacf7c742364624f))
- rename tag document name, move media-specific fields into opt.media namespace ([d5666fc](https://github.com/robinpyon/sanity-plugin-media/commit/d5666fc32b62056be76379d50fcf64415047b7f9))
- re-sort tags on all listener mutations, fix minor rendering issue with single value tag ([c55c70a](https://github.com/robinpyon/sanity-plugin-media/commit/c55c70a651295be3864d6d5332a76f0dc49fae84))
- round custom filters to ensure correct file size comparison, use base 10 (SI) file sizes ([b3c2cfc](https://github.com/robinpyon/sanity-plugin-media/commit/b3c2cfcb58e02e4f07cfaf087631cb26d28e0c3b))
- sanitise form data before submission: strip nullish values ([17bdb4a](https://github.com/robinpyon/sanity-plugin-media/commit/17bdb4ad695e455697b6c5ac7bb325776ef8395a))
- unpick selected assets on delete, prevent pointer events / hover actions during update ([698d0e5](https://github.com/robinpyon/sanity-plugin-media/commit/698d0e555cf4b6869dc5b5bce20fa8ad5c625e18))
- use generic 'asset' term when displaying errors, picked status and delete confirmation ([74eb4ba](https://github.com/robinpyon/sanity-plugin-media/commit/74eb4baeeb5f53d1eb92666b480f1115f0ca57f5))
