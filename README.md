# Sanity Media

![npm](https://img.shields.io/npm/dw/sanity-plugin-media)

A convenient way to browse, manage and refine your [Sanity](https://www.sanity.io/) assets.

Use it standalone as a browser, or optionally hook it up as a [custom asset source](https://www.sanity.io/docs/custom-asset-sources) and use it to power asset selection too.

![Grid view](https://user-images.githubusercontent.com/209129/105532350-9d847500-5ce2-11eb-8ba8-19655c416829.png)
![Asset view](https://user-images.githubusercontent.com/209129/105532355-9fe6cf00-5ce2-11eb-9982-b2bfd22f3409.png)

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

- Virtualized grid + tabular views for super speedy browsing, even with thousands of assets
- Utilises Sanity's [real time updates](https://www.sanity.io/docs/realtime-updates) for live changes from other studio members

#### Fits right in with your Sanity studio!

- Built with the same [UI components Sanity uses](https://www.sanity.io/ui) under the hood
- Fully responsive and mobile friendly

## Install

In your Sanity project folder:

```sh
sanity install media
```

This will add the Media button to your studio menu. If this is all you're after – that's all you need to do!

### Enabling it as a global [custom asset source](https://www.sanity.io/docs/custom-asset-sources)

You'll need to do this if you want to use the plugin when selecting images.

This plugin exposes `part:sanity-plugin-media/asset-source` which you import when defining custom asset sources.

In `sanity.json`, add the following snippet to the `parts` array:

```json
{
  "implements": "part:@sanity/form-builder/input/image/asset-sources",
  "path": "./parts/assetSources.js"
}
```

In `./parts/assetSources.js`:

```js
import MediaAssetSource from 'part:sanity-plugin-media/asset-source'

export default [MediaAssetSource]
```

That's it! The browser will now pop up every time you try select an image.

## Known issues

<details>
<summary>There isn't a way to edit asset fields directly from the desk (without opening the plugin)</summary>

- This is a bit of a sticking point, especially when working with large datasets
- For example, you want to edit fields for a selected image. You then open the plugin, but have to manually hunt / search for that image (which can be a laborious in a dataset of thousands of assets)
- A future change will provide the ability the 'jump' straight to a selected asset, if present
- However, exposing plugin fields on the desk (e.g. via a custom input component) is currently outside the scope of this project

</details>

<details>
<summary>Drag and drop uploads don't work when <em>selecting</em> with the plugin</summary>

- This is currently due to Sanity studio's file picker component taking precedence over window drag and drop events
- For now, you'll need to manually press the 'upload' button if you want to add images whilst in a selecting context

</details>

<details>
<summary>Downloaded images (downloaded with the <em>download</em> button) aren't the original files that were uploaded</summary>

- Any images downloaded in the plugin are those already _processed_ by Sanity without any [image transformations](https://www.sanity.io/docs/image-urls) applied. Please note these are not the _original_ uploaded images, and will be stripped of any EXIF data.
- Currently, it's not possible in Sanity to grab these original image assets within the studio - but this may change in future!

</details>

<details>
<summary>There isn't a way to use the plugin to select file (non-image) assets</summary>

- This will be possible if and when Sanity enables custom asset sources on `file` fields.

</details>

## FAQ

#### Asset fields

<details>
<summary>Where are asset fields stored?</summary>

- This plugin will read and write _directly_ on the asset document iteself. This will either a document of type `sanity.imageAsset` or `sanity.fileAsset`.
- This is analagous to setting values _globally_ across all instances of these assets.
- This is in contrast to using the `fields` property (on both [image](https://www.sanity.io/docs/image-type#fields-ab54e73207e5) and [file](https://www.sanity.io/docs/file-type#fields-93a1b58234d2) objects). Values that you define in the `fields` property can be considered 'local', or bound to instance of the document in which that asset is linked.
- In other words, if you want to set a caption for an image and have that change between different documents – use the `fields` property in your file/image field.
- If you want to set values you can query in all instances of that asset (alternate text being a good example), consider setting those in the plugin.

</details>

<details>
<summary>How can I query values I've defined in ths plugin?</summary>

The following GROQ query would return an image with additional asset text fields as well as an array of tag names.

Note that tags are namespaced within `opt.media` and tag names are accessed via the `current` property, as they're defined as slugs on the `tag.media` document schema (to ensure string uniqueness).

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

- You can now create, rename and delete tags from directly within the plugin itself
- It's _strongly recommended_ that you manually delete tags directly from within the plugin as doing so will make sure that (weak) references are removed from any linked assets
- Alternatively, you can delete tags either from the desk (if you're not using a custom desk) or via Sanity's API – just be mindful that any linked assets will have 'hanging' weak references which may cause some false positives when searching. (E.g. a search for 'all assets where tags is not empty' will yield assets that have references to tags that no longer exist)

</details>

#### Deleting assets

<details>
<summary>How come deleting multiple assets fails, even if only one asset is in use?</summary>

- Batch mutations are carried out via Sanity [transactions](https://www.sanity.io/docs/transactions). These transactions are _atomic_, meaning that if one deletion fails (often because it's referenced elsewhere), then all mutations in the transaction will fail and no changes will occur
- To get around this, simply make sure that all assets you've marked for deletion are not referenced – this can be easily accomplished by using a search facet to only show assets which are not in use

</details>

#### Uploading assets

<details>
<summary>How does the plugin determine what should uploaded as a <code>sanity.imageAsset</code> or <code>sanity.fileAsset</code>?</summary>

- The plugin will look at files' MIME type. All files of MIME type `image/*` will be uploaded as `sanity.imageAsset`, everything else as `sanity.fileAsset`.
- This means that it's not possible to upload images as `sanity.fileAsset` via the plugin. In the rare case that you do need images to be treated as files, consider uploading them outside of the plugin.

</details>

## Roadmap

- Jump to selected asset
- Asset replacemeent
- Total count displays
- Further keyboard shortcuts
- Multiple insertion into documents
- Shareable saved search facets
- Routing
- Storing browser options with local storage

## Contributing

Contributions, issues and feature requests are welcome!

## License

MIT. See [license](LICENSE)
