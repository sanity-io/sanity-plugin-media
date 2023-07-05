<!-- markdownlint-disable --><!-- textlint-disable -->

# 📓 Changelog

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.1.1-beta.1](https://github.com/sanity-io/sanity-plugin-media/compare/v2.1.0...v2.1.1-beta.1) (2023-07-05)

### Bug Fixes

- update react-hook-form, use zod for schema validation, drop legacy-peer-deps npmrc ([cc982bb](https://github.com/sanity-io/sanity-plugin-media/commit/cc982bbd193b3436d60dd0d48a7411d9c865bf11))

## [2.1.0](https://github.com/sanity-io/sanity-plugin-media/compare/v2.0.6...v2.1.0) (2023-07-03)

### Features

- add support for multiple tags ([5f5bea8](https://github.com/sanity-io/sanity-plugin-media/commit/5f5bea828abe2867c9273e57bbeca351825cec9f))

## [2.0.6](https://github.com/sanity-io/sanity-plugin-media/compare/v2.0.5...v2.0.6) (2023-07-03)

### Bug Fixes

- **deps:** update dependencies (non-major) ([#149](https://github.com/sanity-io/sanity-plugin-media/issues/149)) ([d7943e8](https://github.com/sanity-io/sanity-plugin-media/commit/d7943e821b1b987b5eda5165387af59461345558))
- ensure popovers display correctly when the plugin is invoked via an image input ([0d92ab9](https://github.com/sanity-io/sanity-plugin-media/commit/0d92ab90f1e7231d8867234c2489aaa7533fdb07))
- force overflow-y scroll to prevent grid offset on mount ([804e125](https://github.com/sanity-io/sanity-plugin-media/commit/804e12598d00688a99d4f8aa5e934a643008eaeb))
- prevent tag panel title from collapsing on small viewports ([a415924](https://github.com/sanity-io/sanity-plugin-media/commit/a41592412754078dce14db23e0d33d9035c4b346))
- suppress redux-toolkit $CombinedState errors ([b7c6fd1](https://github.com/sanity-io/sanity-plugin-media/commit/b7c6fd13536c60b848f01875650d7fe722a7b0ee))
- use tooltip portals, remove cancel upload button tooltips until portal issues are fixed in ui ([ea549e1](https://github.com/sanity-io/sanity-plugin-media/commit/ea549e1b563566c1361e30fddc8e7c48275dcc15))

## [2.0.5](https://github.com/sanity-io/sanity-plugin-media/compare/v2.0.4...v2.0.5) (2023-02-03)

### Bug Fixes

- prevent removal of last character on no filename extension ([#120](https://github.com/sanity-io/sanity-plugin-media/issues/120)) ([3c0db14](https://github.com/sanity-io/sanity-plugin-media/commit/3c0db1428d1995cd22daaf56d16dfdaaf989ab69))

## [2.0.4](https://github.com/sanity-io/sanity-plugin-media/compare/v2.0.3...v2.0.4) (2023-01-21)

### Bug Fixes

- **deps:** upgrade sanity, rxjs and redux observable ([#113](https://github.com/sanity-io/sanity-plugin-media/issues/113)) ([3c10149](https://github.com/sanity-io/sanity-plugin-media/commit/3c101498c4145b94d41ed9bd54814b5a401258c5))

## [2.0.3](https://github.com/sanity-io/sanity-plugin-media/compare/v2.0.2...v2.0.3) (2023-01-18)

### Bug Fixes

- **docs:** install version ([a00d64f](https://github.com/sanity-io/sanity-plugin-media/commit/a00d64fb08828e8222fce061cb47d6adf789d522))

## [2.0.2](https://github.com/sanity-io/sanity-plugin-media/compare/v2.0.1...v2.0.2) (2022-11-25)

### Bug Fixes

- **deps:** bump ([ed758ee](https://github.com/sanity-io/sanity-plugin-media/commit/ed758eef2a58fde92d8b451630388c52ccb37316))

## [2.0.1](https://github.com/sanity-io/sanity-plugin-media/compare/v2.0.0...v2.0.1) (2022-11-25)

### Bug Fixes

- **deps:** 3.0.0-rc.3 ([c823c5a](https://github.com/sanity-io/sanity-plugin-media/commit/c823c5a27eec30679e0aab7f9d2b2b6a5d9cd105))
- renamed import ([8f81da7](https://github.com/sanity-io/sanity-plugin-media/commit/8f81da7590020ab91e41daafdb133bdd870d5fd2))

## [2.0.0](https://github.com/sanity-io/sanity-plugin-media/compare/v1.4.13...v2.0.0) (2022-11-17)

### ⚠ BREAKING CHANGES

- this version does not work in Sanity Studio v2
- initial studio v3 version

### Features

- initial Sanity Studio v3 release ([8f6dd55](https://github.com/sanity-io/sanity-plugin-media/commit/8f6dd5561a9c811b21263b574104f9c89cc8fb36))
- initial studio v3 version ([beb5531](https://github.com/sanity-io/sanity-plugin-media/commit/beb55317235792c7337e9dbfc8c3ffe4f88ff5e5))

### Bug Fixes

- apply upstream v2-studio fixes, add semver automation workflow ([100f3eb](https://github.com/sanity-io/sanity-plugin-media/commit/100f3eb226e80d8eef81dae1dc1c688d1ceab797)), closes [#88](https://github.com/sanity-io/sanity-plugin-media/issues/88) [#50](https://github.com/sanity-io/sanity-plugin-media/issues/50) [#57](https://github.com/sanity-io/sanity-plugin-media/issues/57) [#82](https://github.com/sanity-io/sanity-plugin-media/issues/82)
- correctly infer filename from files containing uppercase extensions, tweak upload card layout ([1e96b79](https://github.com/sanity-io/sanity-plugin-media/commit/1e96b79d2bbec456fac9c39b072a487eef9932ad))
- **deps:** compiled for sanity 3.0.0-rc.0 ([20466ab](https://github.com/sanity-io/sanity-plugin-media/commit/20466abce56aae41d0406f4fa7d817a927c741e8))
- **deps:** dev-preview.21 ([4f9588a](https://github.com/sanity-io/sanity-plugin-media/commit/4f9588addd4828c5d9beb7457a2437bcb25c464c))
- initial v3 work ([4517bb5](https://github.com/sanity-io/sanity-plugin-media/commit/4517bb532b60c42eb9058887d206969b23191373))
- re-enable references tab panel ([ac698b3](https://github.com/sanity-io/sanity-plugin-media/commit/ac698b3a74be31774914c7f68981485826a67807))

## [2.0.0-v3-studio.3](https://github.com/sanity-io/sanity-plugin-media/compare/v2.0.0-v3-studio.2...v2.0.0-v3-studio.3) (2022-11-07)

### Bug Fixes

- **deps:** compiled for sanity 3.0.0-rc.0 ([20466ab](https://github.com/sanity-io/sanity-plugin-media/commit/20466abce56aae41d0406f4fa7d817a927c741e8))

## [2.0.0-v3-studio.2](https://github.com/robinpyon/sanity-plugin-media/compare/v2.0.0-v3-studio.1...v2.0.0-v3-studio.2) (2022-10-07)

### Bug Fixes

- **deps:** dev-preview.21 ([4f9588a](https://github.com/robinpyon/sanity-plugin-media/commit/4f9588addd4828c5d9beb7457a2437bcb25c464c))

## [2.0.0-v3-studio.1](https://github.com/robinpyon/sanity-plugin-media/compare/v1.4.8...v2.0.0-v3-studio.1) (2022-10-06)

### Bug Fixes

- apply upstream v2-studio fixes, add semver automation workflow ([100f3eb](https://github.com/robinpyon/sanity-plugin-media/commit/100f3eb226e80d8eef81dae1dc1c688d1ceab797)), closes [#88](https://github.com/robinpyon/sanity-plugin-media/issues/88) [#50](https://github.com/robinpyon/sanity-plugin-media/issues/50) [#57](https://github.com/robinpyon/sanity-plugin-media/issues/57) [#82](https://github.com/robinpyon/sanity-plugin-media/issues/82)
- initial v3 work ([4517bb5](https://github.com/robinpyon/sanity-plugin-media/commit/4517bb532b60c42eb9058887d206969b23191373))
- re-enable references tab panel ([ac698b3](https://github.com/robinpyon/sanity-plugin-media/commit/ac698b3a74be31774914c7f68981485826a67807))
- remove rxjs and @sanity/client from peerDependencies ([b4df1f5](https://github.com/robinpyon/sanity-plugin-media/commit/b4df1f5ba067ff0e28dda08d376b03d444967d68))

### Reverts

- Revert "fix: flatten blob gen + upload actions to ensure null blobs correctly throw errors and bubble up" ([7a387c4](https://github.com/robinpyon/sanity-plugin-media/commit/7a387c43c7a6701a9c3e7876d189722e03161e17))
