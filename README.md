# Sanity Media (for Sanity Studio v3)

> This plugin is for **Sanity Studio v3**.  
> The Sanity Studio v2 version of this plugin is no longer maintained, but still accessible on the [v2 branch](https://github.com/sanity-io/sanity-plugin-media/tree/studio-v2).

## What is it?

![npm-v](https://img.shields.io/npm/v/sanity-plugin-media?style=flat-square)
![npm-dw](https://img.shields.io/npm/dw/sanity-plugin-media?style=flat-square)

A convenient way to browse, manage and refine your [Sanity](https://www.sanity.io/) assets.

Use it standalone as a browser, or optionally hook it up as a [custom asset source](https://www.sanity.io/docs/custom-asset-sources) and use it to power both image and file selection too.

![Grid view](https://user-images.githubusercontent.com/209129/108927411-21aa7f00-7638-11eb-9cf7-334598ac4103.png)
_Default grid view_

![Asset view](https://user-images.githubusercontent.com/209129/132573482-fa866da9-7ee0-42db-b39f-25a0e48bba9f.png)
_Individual asset view_

## Features

#### Manage and organise your assets

- Support for batch uploads with drag and drop support
- Edit text fields native to Sanity's asset documents, such as `title`, `description`, `altText` and `originalFilename`
- View asset metadata and a limited subset of EXIF data, if present
- Tag your assets individually or in bulk
- Manage tags directly within the plugin
- Get previews for audio and video files
- Easily select and delete multiple assets in bulk

#### Granular search tools

- Refine your search with any combination of search facets such as filtering by tag name, asset usage, file size, orientation, type (and more)
- Use text search for a quick lookup by title, description and alt text

#### Built for large datasets and collaborative editing in mind

- Virtualized grid + tabular views for super speedy browsing, even with thousands of assets and tags
- Utilises Sanity's [real time updates](https://www.sanity.io/docs/realtime-updates) for live changes from other studio members

#### Fits right in with your Sanity studio

- Built with the same [UI components Sanity uses](https://www.sanity.io/ui) under the hood
- Fully responsive and mobile friendly

## Install (Sanity Studio v3)

In your Sanity project folder:

```sh
npm install --save sanity-plugin-media
```

or

```sh
yarn add sanity-plugin-media
```

## Usage

Add it as a plugin in your `sanity.config.ts` (or .js) file:

```js
import {media} from 'sanity-plugin-media'

export default defineConfig({
  // ...
  plugins: [media()]
})
```

This will enable the Media plugin as both a standalone tool (accessible in your studio menu) and as an additional asset source for your image and file fields.

### Customizing the asset source

You can configure your studio to use this asset source either exclusively, or conditionally enable it based on the type of asset (image or file).

```js
import {media, mediaAssetSource} from 'sanity-plugin-media'

export default defineConfig({
  // ...
  plugins: [media()],
  form: {
    // Don't use this plugin when selecting files only (but allow all other enabled asset sources)
    file: {
      assetSources: previousAssetSources => {
        return previousAssetSources.filter(assetSource => assetSource !== mediaAssetSource)
      }
    }
  }
})
```

### Plugin Config

```ts
// sanity.config.ts
import {media} from 'sanity-plugin-media'
import {CustomDetails} from './MyCustomDetails'

export default defineConfig({
  //...
  plugins: [
    media({
      creditLine: {
        enabled: true,
        // boolean - enables an optional "Credit Line" field in the plugin.
        // Used to store credits e.g. photographer, licence information
        excludeSources: ['unsplash']
        // string | string[] - when used with 3rd party asset sources, you may
        // wish to prevent users overwriting the creditLine based on the `source.name`
      },
      maximumUploadSize: 10000000,
      // number - maximum file size (in bytes) that can be uploaded through the plugin interface
      directUploads: true,
      // boolean - enable / disable direct uploads through the plugin interface (default true)
      components: {
        details: CustomDetails
        // Custom component for asset details (see below)
      },
      // Custom components to override default UI (see below)
      locales: [
        // { id: string, title: string, ...extra }[] - enable localization for asset fields. Each object must have a unique id and a human-readable title.
        // You may include extra keys (e.g. isDefault) for compatibility with Sanity's recommended pattern; only id and title are used by the plugin, all other keys are ignored.
        // When set, all localizable fields (title, altText, description, creditLine) will be shown in tabs by language.
        {id: 'en', title: 'English', isDefault: true},
        {id: 'it', title: 'Italian'},
        {id: 'es', title: 'Spanish'},
        {id: 'fr', title: 'French'},
        {id: 'de', title: 'German'},
        {id: 'pt', title: 'Portuguese'},
        {id: 'ja', title: 'Japanese'},
        {id: 'zh', title: 'Chinese'},
        {id: 'ru', title: 'Russian'},
        {id: 'ar', title: 'Arabic'}
      ]
    })
  ]
})
```

### Localization (Optional)

You can enable localization support by passing a `locales` array to the plugin config, following the [Sanity recommended scheme](https://www.sanity.io/docs/studio/localization#k4da239411955):

If omitted, localization features will be disabled and the plugin will work as usual.

**Fallback for missing translations:**
The plugin does not apply any automatic fallback for missing translations. You can decide how to handle this in your queries or frontend logic. For example, to show the default language if a translation is missing, you can use GROQ's `coalesce()`:

```
coalesce(altText.it, altText.en)
```

**UI note:**
When `locales` are provided, all localized fields (title, altText, description, creditLine) are grouped by language in tabs. Each tab shows all fields for a single language, making it easy to edit translations for many languages in a compact interface.

This will return the Italian value if present, otherwise English, otherwise French, etc. Adjust the order as needed for your project.

#### Custom Asset Details Component

Custom React component for the asset details form via the plugin config. This allows you to override or extend the default asset details UI.

Your component will receive all form props and a `renderDefaultDetails(props)` function for fallback or composition.

```tsx
// Example custom details component
export function CustomDetails(props) {
  // You can render the default details, or add your own fields
  return (
    <>
      <h3>Custom header</h3>
      {/* Change the UI as you see fit */}
      {props.renderDefaultDetails(props)}
    </>
  )
}
```

## Known issues

<details>
<summary>There isn't a way to edit asset fields directly from the desk (without opening the plugin)</summary>

- This is a bit of a sticking point, especially when working with large datasets
- For example, if you want to edit fields for an already selected image – you'll need to go into the plugin and then have to manually find that image (which can be laborious when sifting through thousands of assets)
- A future update will provide the ability to 'jump' straight to a selected asset
- However, exposing plugin fields directly on the desk (e.g. via a custom input component) is currently outside the scope of this project

</details>

<details>
<summary>Drag and drop uploads don't work when <em>selecting</em> with the plugin</summary>

- This is currently due to Sanity studio's file picker component taking precedence over window drag and drop events
- For now, you'll need to manually press the 'upload' button if you want to add images whilst in a selecting context

</details>

<details>
<summary>Downloaded images (downloaded with the <em>download</em> button) aren't the originally uploaded files</summary>

- Any images downloaded in the plugin are those _already processed_ by Sanity without any [image transformations](https://www.sanity.io/docs/image-urls) applied
- Please note these are not the original uploaded images: they will likely have a smaller file size and will be stripped of any EXIF data.
- Currently, it's not possible in Sanity to grab these original image assets within the studio - but this may change in future!

</details>

<details>
<summary>Limitations when using Sanity's GraphQL endpoints</summary>

- Currently, `opt.media.tags` on assets aren't accessible via GraphQL. This is because `opt` is a custom object used by this plugin and not part of Sanity's asset schema.

</details>

## FAQ

#### Asset fields

<details>
<summary>Where are asset fields stored?</summary>

- This plugin will read and write _directly_ on the asset document itself. This will either a document of type `sanity.imageAsset` or `sanity.fileAsset`
- This is analagous to setting values _globally_ across all instances of these assets
- This is in contrast to using the `fields` property when defining your document schema (on both [image](https://www.sanity.io/docs/image-type#fields-ab54e73207e5) and [file](https://www.sanity.io/docs/file-type#fields-93a1b58234d2) objects). Values that you define in the `fields` property can be considered 'local', or bound to the the document where that asset is linked.
- In other words, if you want to set a caption for an image and have that change between different documents – customise the `fields` property in your document schema's file/image field
- If you want to set values you can query in all instances of that asset (alternate text being a good example), consider setting those in the plugin

</details>

<details>
<summary>How can I query asset fields I've set in this plugin?</summary>

The following GROQ query will return an image with additional asset text fields as well as an array of tag names.

Note that tags are namespaced within `opt.media` and tag names are accessed via the `current` property (as they're defined as slugs on the `tag.media` document schema).

```
*[_id == 'my-document-id'] {
  image {
    asset->{
      _ref,
      _type,
      altText,
      description,
      "tags": opt.media.tags[]->name.current,
      title
    }
  }
}
```

</details>

<details>
<summary>What EXIF fields are displayed and how can I get these to show up?</summary>

- ISO, aperture, focal length, exposure time and original date are displayed
- By default, Sanity won't automatically extract EXIF data unless you explicitly tell it to
- Manually tell Sanity to process EXIF metadata by [updating your image field options accordingly](https://www.sanity.io/docs/image-type#metadata-5fe564e516d8)
- Note that all images uploaded directly within the plugin will include all metadata by default

</details>

#### Tags

<details>
<summary>How and where are asset tags stored?</summary>

- This plugin defines the document type `media.tag`
- All tags are stored as _weak_ references and being a third-party plugin, are stored in the namespaced object `opt.media`
- This behaviour differs from asset fields such as `title`, `description` and `altText` which are stored directly on the asset as they're part of Sanity's defined asset schema

</details>

<details>
<summary>How can I hide the <em>Media Tag</em> document type which has now appeared in my desk?</summary>

- If you're not using a custom desk, Sanity attaches custom schema defined by third party plugins to your desk. This is currently the default behaviour
- However, you can override this behaviour by defining your own custom desk with Sanity's [structure builder](https://www.sanity.io/docs/structure-builder-typical-use-cases) and simply omit the `media.tag` document type in your definition

</details>

<details>
<summary>How can I edit and / or delete tags I've already created?</summary>

- You can create, rename and delete tags from directly within the plugin itself
- It is _strongly recommended_ that you manually delete tags directly from within the plugin – doing so will ensure that (weak) references are removed from any linked assets
- Alternatively, you can delete tags either from the desk (if you're not using a custom desk) or via Sanity's API – just be mindful that any assets previously assigned to deleted tags will have 'hanging' weak references. This won't cause serious issues, but it may cause some false positives when searching. (E.g. a search for 'all assets where tags is not empty' will yield assets that have references to tags that no longer exist)

</details>

#### Deleting assets

<details>
<summary>Why am I unable to delete multiple assets, even if only one asset is in use?</summary>

- Batch mutations are carried out via Sanity [transactions](https://www.sanity.io/docs/transactions). These transactions are _atomic_, meaning that if one deletion fails (often because it's referenced elsewhere), then all mutations in the transaction will fail and no changes will occur
- To get around this, simply make sure that all assets you've marked for deletion are not referenced – this can be easily accomplished by using a search facet to only show assets which are not in use

</details>

#### Uploading assets

<details>
<summary>How does the plugin determine what should uploaded as a <code>sanity.imageAsset</code> or <code>sanity.fileAsset</code>?</summary>

- As a rule of thumb, when uploading when accessing the plugin as a _tool_ (e.g. if you've acceessed it via the studio menu), it will look at any incoming files' MIME type. All files of type `image/*` will be uploaded as `sanity.imageAsset` whilst everything else will be treated as `sanity.fileAsset`
- If you upload when using the plugin in a _file_ selection context, these be uploaded as `sanity.fileAsset` regardless of their MIME type. This is probably not what you want, since images uploaded as files won't have associated metadata nor will they work in Sanity's image pipeline.

</details>

## Contributing

Contributions, issues and feature requests are welcome!

## License

[MIT](LICENSE) © Sanity.io

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hot-reload in the studio.

### Release new version

Run the ["CI & Release" workflow](https://github.com/robinpyon/sanity-plugin-media/actions/workflows/main.yml). Make sure to select the main branch and check "Release new version".

Semantic release will only release on configured branches, so it is safe to run the workflow on any branch.
