# Sanity Media

Alternative media management for [Sanity](https://www.sanity.io/).

⚠ This plugin is currently in alpha. Use at your own risk! ⚠

![example](https://user-images.githubusercontent.com/209129/69345186-a013b680-0c68-11ea-9aae-0425c54bbe86.jpg)

## Background

This plugin provides a dedicated media browser for managing images within Sanity.

Out of the box, it provides a link in the menu where you can view all dataset images from anywhere within your studio.

It can also be used as a [custom asset source](https://www.sanity.io/docs/custom-asset-sources) for image fields.

## Features

- Easily access media from the menu
- View file metadata
- Select and delete multiple assets
- Grid / table views
- Display currently selected assets
- Basic filename / date sorting
- Display unused assets
- Integration with Sanity's snackbar notifications

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

- Batch deleting assets invokes multiple API requests - this is because [Sanity's transactions are atomic](https://www.sanity.io/docs/transactions). In other words, deleting 10 selected assets will use 10 API requests.

## Known issues

- GROQ queries for total `sanity.imageAssets` count is really, really slow.

## Roadmap

- Filter images by the current document
- More keyboard shortcuts
- Delete confirmation dialog
- Display current document info
- Image uploads
- Multiple selection / insertion
- More detailed metadata views
- Folder management
- Fix typings across the board, consider using `typesafe-actions`

## Contributing

Contributions, issues and feature requests are welcome!
