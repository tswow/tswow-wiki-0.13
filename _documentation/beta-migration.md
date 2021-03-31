---
title: TSWoW Alpha to Beta Migration
---

_Note: This tutorial is not finished and may change until the beta releases._

The purpose of this guide is to explain the differences between the TSWoW alpha and beta versions, and the steps needed to migrate from one to the other.

Because the TSWoW beta has quite a few differences from the old versions, you cannot use the old "update.7z" method. Instead, you need to install the beta separately,
and manually move over your module and configuration files to the new installation.

There may have been things we've missed here, so please contact us on [Discord](https://discord.gg/M89n6TZh9x) if you have any difficulties upgrading.

## Modules

- The `addons` directory in modules are now called `addon`, you need to rename yours manually.

- The `data` directory in modules are now called `datascripts`, you need to rename yours manually.

- The `scripts` directory in modules are now called `livescripts`, you need to rename yours manually.

- `addons/BinReader.ts` is now `addon/lib/BinReader.ts`, and `addons/events.ts` is `addon/lib/Events.ts`. You must remove the old files, rebuild, and update your references.

- `scripts/my_module_scripts.ts` is now `livescripts/my-module-scripts.ts`. Dashes can and should now be used in livescript filenames instead of underscores.

- AddOns are now rendered to FrameXML inside the built MPQ instead of AddOns, you need to remove the old `client/Interface/AddOns/my-addon` files.

### Server files (dbc,luaxml,map,vmaps etc.)

- If you wish to keep your old server data, you must move them from the old `coredata` folder to `coredata/datasets/default`.

- If you migrate your old `luaxml` files, you need to manually extract the file `Interface/FrameXML/FrameXML.toc` from your client 
and place it at `coredata/datasets/default/luaxml_source/Interface/FrameXML/FrameXML.toc`


### ID files

- If you wish to keep your old ID mappings, you must go through your `config/ids.txt` file and:
  - Move any rows not relating to addon messages to `coredata/datasets/default/ids.txt`
  - Move any rows relating to addon messages to `ids.txt` in the new installation root.
