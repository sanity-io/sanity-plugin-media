# Sanity Media

Alternative media management for [Sanity](https://www.sanity.io/).

![example](https://user-images.githubusercontent.com/209129/96188577-e2a44880-0f36-11eb-96dd-f19c12bef017.jpg)

## Background

This plugin provides a dedicated media browser for managing images within Sanity.

Out of the box, it provides a link in the menu where you can view all dataset images from anywhere within the studio.

It can also be used as a [custom asset source](https://www.sanity.io/docs/custom-asset-sources) for image fields.

## Features

- Adds a menu item / tool for easy access from anywhere in the studio
- Grid / table views
- Basic filename search with support for:
  - searching by orientation `orientation:landscape|portrait|square`
  - searching by file extension `extension:gif|jpg|png`
- Multiple selection (hold down the shift key) and deletion
- Custom filters to display unused assets and those referenced in the current document
- Basic filename / date sorting
- If using as a custom asset source: displays the current document title that you're inserting into
- View basic file metadata: original file name and size, dimensions and MIME type
- Integration with Sanity's snackbar notifications
- Single click to download high quality versions of your assets
- Virtualized displays (with `react-window`) for speedy browsing of large datasets

When `sanity-plugin-media` is accessed via a custom asset source, you'll have the option to insert assets as well as view the currently selected image for that field.

## Install

In your Sanity project folder:

```sh
sanity install media
```

This will add the Media button to your studio menu. If this is all you're after – that's all you need to do!

### Enabling it as a global custom asset source

This plugin exposes `part:sanity-plugin-media/asset-source` as a part you can import when defining custom asset sources.

In `sanity.json`, add the following snippet the `parts` array:

```json
{
  "implements": "part:@sanity/form-builder/input/image/asset-sources",
  "path": "./parts/assetSources.js"
}
```

`./parts/assetSources.js`:

```js
import MediaAssetSource from 'part:sanity-plugin-media/asset-source'

export default [MediaAssetSource]
```

Now clicking 'select' on every image field will invoke `sanity-plugin-media`.

Read more about Sanity's [custom asset sources](https://www.sanity.io/docs/custom-asset-sources).

## Good to know

- Displaying unused assets and assets referenced in the currrent document can be slow on large datasets (with thousands of images). This may be improved in future with changes to the GROQ query engine.

- Batch deleting assets invokes multiple API requests - this is because [Sanity's transactions are atomic](https://www.sanity.io/docs/transactions). In other words, deleting 10 selected assets will use 10 API requests.

## Roadmap

- Display total image count (Contingent on query engine rewrite)
- More keyboard shortcuts
- Delete confirmation dialog
- Image uploads
- Multiple insertion into documents
- More detailed metadata views
- Folder management (!)
- Remember browser options with local storage

## Contributing

Contributions, issues and feature requests are welcome!
