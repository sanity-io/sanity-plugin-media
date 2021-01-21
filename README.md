# Sanity Media

![npm](https://img.shields.io/npm/dw/sanity-plugin-media)

<!-- ![example](https://user-images.githubusercontent.com/209129/96188577-e2a44880-0f36-11eb-96dd-f19c12bef017.jpg) -->

A convenient way to browse, manage and select all your [Sanity](https://www.sanity.io/) assets.

Use it standalone as a browser, or optionally hook it up as a [custom asset source](https://www.sanity.io/docs/custom-asset-sources) and use it to power asset selection too.

## Features

- Built with Sanity's official [UI library](https://www.sanity.io/ui)
- Browse both image and file assets in one convenient place
- Asset tagging
- Faceted search: refine by tag, usage, file size, orientation, type (and more!)
- Basic text search: refine by title, description and alt text
- Previews for audio and video files
- Edit text fields native to Sanity's asset documents, such as `title`, `description`, `altText` and even `originalFilename`
- View asset metadata and a limited subset of EXIF data (if present)
- Virtualized grid + tabular views for super speedy browsing
- Multiple asset selection and deletion
- Fully responsive and mobile friendly

## Install

In your Sanity project folder:

```sh
sanity install media
```

This will add the Media button to your studio menu. If this is all you're after – that's all you need to do!

### Enabling it as a global custom asset source

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

Now clicking 'select' on every image field will invoke the plugin.

Read more about Sanity's [custom asset sources](https://www.sanity.io/docs/custom-asset-sources).

## FAQ

<details>
<summary>How and where are asset tags stored?</summary>
<br />

- This plugin defines the document type `media.tag`.
- All tags are stored as _weak_ references, and being a third-party plugin, are stored in the namespaced object `opt.media`
- This behaviour differs from asset fields such as `title`, `description` and `altText` which are stored directly on the asset as they're part of the official asset schema

</details>

<br />

<details>
<summary>How can I edit and / or delete tags I've already created?</summary>
<br />

- _Right now_, the only way to do this is through Sanity's desk or via the API
- **If you're not using a custom desk**, then this will be automatically added for you once you've installed the plugin. You'll be then be able to edit tags like you do any other documents.
- **If you are using a custom desk**, you'll need to expose the `media.tag` document type as you see fit.

Read more about custom desks with Sanity's structure builder [structure builder](https://www.sanity.io/docs/structure-builder-typical-use-cases)

</details>

<br />

<details>
<summary>Can I use this to pick file (non-image) assets?</summary>
<br />

- Not just yet unfortunately! This will be possible if and when Sanity enables custom asset sources on `file` fields.

</details>

<br />

<details>
<summary>What EXIF fields are displayed and how can I get these to show up?</summary>
<br />

- ISO, aperture, focal length, exposure time and original date are displayed
- By default, Sanity won't automatically extract EXIF data unless you explicitly tell it to. Manully tell Sanity to process EXIF metadata by [updating your image field options accordingly](https://www.sanity.io/docs/image-type#metadata-5fe564e516d8)

</details>

<br />

<details>
<summary>OK, I've updated some asset fields and assigned tags – how do I go about querying this data?</summary>
<br />

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

## Good to know

- Batch deleting assets invokes multiple API requests - this is because [Sanity's transactions are atomic](https://www.sanity.io/docs/transactions). In other words, deleting 10 selected assets will use 10 API requests.

## Roadmap

- Single + batch uploads
- Batch tagging
- Asset replacemeent
- Total count displays
- Further keyboard shortcuts
- Multiple insertion into documents
- Shareable saved search facets
- Routing support
- Storing browser options with local storage

## Contributing

Contributions, issues and feature requests are welcome!

## License

MIT. See [license](LICENSE)
