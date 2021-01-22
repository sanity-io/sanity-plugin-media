# Sanity Media

![npm](https://img.shields.io/npm/dw/sanity-plugin-media)

A convenient way to browse, manage and select all your [Sanity](https://www.sanity.io/) assets.

Use it standalone as a browser, or optionally hook it up as a [custom asset source](https://www.sanity.io/docs/custom-asset-sources) and use it to power asset selection too.

![Grid view](https://user-images.githubusercontent.com/209129/105532350-9d847500-5ce2-11eb-8ba8-19655c416829.png)
![Asset view](https://user-images.githubusercontent.com/209129/105532355-9fe6cf00-5ce2-11eb-9982-b2bfd22f3409.png)

## Features

- Built with Sanity's official [UI library](https://www.sanity.io/ui)
- Browse both image and file assets in one convenient place
- Asset tagging
- Faceted search: refine by tag, usage, file size, orientation, type (and more!)
- Basic text search: refine by title, description and alt text
- Previews for audio and video files
- Edit text fields native to Sanity's asset documents, such as `title`, `description`, `altText` and even `originalFilename`
- View asset metadata and a limited subset of EXIF data (if present)
- Virtualized grid + tabular views for super speedy browsing, even with thousands of assets
- Utilises Sanity's [real time updates](https://www.sanity.io/docs/realtime-updates) - for live concurrent changes from other studio members
- Multiple asset selection and deletion
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

## FAQ

<details>
<summary>How and where are asset tags stored?</summary>

- This plugin defines the document type `media.tag`.
- All tags are stored as _weak_ references and being a third-party plugin, are stored in the namespaced object `opt.media`
- This behaviour differs from asset fields such as `title`, `description` and `altText` which are stored directly on the asset as they're part of Sanity's defined asset schema

</details>

<details>
<summary>How can I hide the <em>Media Tag</em> document type which has now appeared in my desk?</summary>

- **If you're not using a custom desk**, Sanity attaches custom schema defined by third party plugins to your desk. This is currently the default behaviour.
- However, you can override this behaviour by defining your own custom desk with Sanity's [structure builder](https://www.sanity.io/docs/structure-builder-typical-use-cases) and simply omit the `media.tag` document type in your definition.

</details>

<details>
<summary>How can I edit and / or delete tags I've already created?</summary>

- Currently, the only way to do this is through Sanity's desk or via the API
- **If you're not using a custom desk**, then this will be automatically added for you once you've installed the plugin. You'll be then be able to edit tags like you do any other documents.
- **If you are using a custom desk**, then you'll need to expose the `media.tag` document type as you see fit, provided you want to expose them at all.

</details>

<details>
<summary>Can I use this to pick file (non-image) assets?</summary>

- Not just yet unfortunately! This will be possible if and when Sanity enables custom asset sources on `file` fields.

</details>

<details>
<summary>What EXIF fields are displayed and how can I get these to show up?</summary>

- ISO, aperture, focal length, exposure time and original date are displayed
- By default, Sanity won't automatically extract EXIF data unless you explicitly tell it to. Manually tell Sanity to process EXIF metadata by [updating your image field options accordingly](https://www.sanity.io/docs/image-type#metadata-5fe564e516d8)

</details>

<details>
<summary>OK, I've updated some asset fields and assigned tags – how do I go about querying this data?</summary>

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
<summary>How come images downloaded with the <em>download</em> button aren't the same as their listed size?</summary>

- Any images downloaded here are those already _processed_ by Sanity without any [image transformations](https://www.sanity.io/docs/image-urls) applied. Please note these are not the _original_ uploaded images, and will be stripped of any EXIF data.
- Currently, it's not possible in Sanity to grab these original image assets within the studio - but this may change in future!

</details>

<details>
<summary>What is API usage like?</summary>

- Batch deleting assets invokes multiple API requests - this is because [Sanity's transactions are atomic](https://www.sanity.io/docs/transactions). In other words, deleting 10 selected assets will use 10 API requests.
- You _probably_ don't want to be batch deleting hundreds of thousands of images through this plugin - such a task would be better suited to a custom script!

</details>

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
