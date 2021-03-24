---
title: Datasets and Realms
---

_Datasets and realms are a new feature from TSWoW version 0.11_

_This article is under construction_

TSWoW supports managing multiple realms from a single installation, and additionally managing separate sets of modules that should be applied for each realm.

## Realms

Realms can be managed by the `realm` command and are stored in the folder `coredata/realms`.
Each realm manages its own characters database and `worldserver` process, but shares account information with the entire TSWoW installation.
If TSWoW starts with no realms created, a default realm `tswow` will be automatically created. 

### Creating a new realm

To create a new realm, use the command `realm create <realmname>`. This will create the configuration file `coredata/realms/<realmname>/realm.yaml`, 
where you can configure the port number and addresses this realm should use. To start the worldserver for a new realm, run `auth start` to restart the authserver and then `realm start <realmname>` to start the worldserver.

### realm.yaml

The contents of this file are read whenever TSWoW starts the authserver, and contains the information necessary for the authserver to point at the realms worldserver. 
All the settings, except for `dataset` are analogous to the settings described in the TrinityCore server [realmlist table](https://trinitycore.atlassian.net/wiki/spaces/tc/pages/2130016/realmlist) (not to be confused with the clients `realmlist.wtf`).

### Default behavior

To make TSWoW as easy to use for beginners as possible, if no realms are created a default realm `tswow` will be created automatically, 
and most `realm` commands will select this realm by default if no other realm name is provided.

## Datasets
All realms must configure a _dataset_ to use, which defines what modules are applied for that realm. A dataset manages its own `world` and `world_source` databases, and multiple realms may share a single dataset.

Since datasets may build completely different client and server files from each others, each dataset manages its own `world` databases and server files, such as `dbc`, `luaxml`, `map` and `id` data.

_Note: For now, all datasets share the same addon message ids, but all other ids are and will remain separate._

_Note: There is currently no way  

### Creating a new dataset

To create a new dataset, use the command `dataset create <dataset>`. This will create the configuration file `coredata/datasets/<dataset>/<dataset>.dataset.yaml`.

### `dataset.yaml`

This is the main configuration file for your dataset. You can specify whether to `use_mmaps`, the `client_path` and what `modules` to build. 
Since datasets may build vastly different client files, it is recommended that you use different development clients for each dataset unless you're sure they only differ in server data.

### Default behavior

TSWoW always has a `default` dataset, which by default specifies that it uses all modules. Similarly to how realms use the `tswow` realm by default, 
dataset commands will assume the default dataset if no other dataset is provided.
