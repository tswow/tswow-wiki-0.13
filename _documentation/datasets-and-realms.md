---
title: Datasets and Realms
---

TSWoW supports managing multiple realms from a single installation, and additionally managing separate sets of module data that should be applied for each realm.

Since version 0.13, realms and datasets are stored in the special module endpoints `datasets` and `realms`.

## Realms

A realm manages its own character database, `worldserver.conf` and a `worldserver` process, but shares account information with the entire TSWoW installation.

Realms are configured to one and only one dataset, which defines what world database is used and what client versions can connect to it.

- Realms can be created simply by creating a folder `realms/my-new-realm` to a module.

- Realms are referenced by the full name of their parent module followed by a dot and the realm name. For example, the realm `my-realm` inside the module `my-module` has the full name `my-module.my-realm`.

_Please note that it is not permitted to have realms, datasets or submodules sharing the same full name._

## Datasets
A dataset manages a full set of modules and the data used to build them. Datasets allow tswow developers to maintain multiple discrete sets of gamedata from a single installation. Different datasets can be built with different input dbc data, and filter out different modules from a build.

Since datasets builds completely different client and server files, each dataset manages its own `world` database and server files, such as `dbc`, `luaxml`, `maps/vmaps/mmaps` and `ids`.

- Datasets can be created simply by creating a folder `datasets/my-new-dataset` to a module.

- Datasets are referenced by the full name of their parent module followed by a dot and the dataset name. For example, the dataset `my-dataset` inside the module `my-module` has the full name `my-module.my-dataset`.

- Datasets can be specifically targeted with build commands simply by including its full name: `build data my-module.my-dataset`.

- An alternative name suggested for datasets during development was `expansions`. We ultimately rejected this to not give users the idea that tswow supported multiple blizzard expansions (_which we don't_), but the reasoning behind it might be helpful for some users to understand the purpose of datasets. Datasets allow you to effectively manage multiple custom expansions to the base game from a single installation, since they can build completely different data for different realms depending on what modules or submodules they build.

## Defaults
TSWoW includes a default dataset and realm inside the `default` module to make development easier for new users. When using commands such as `build data` or `start realm`, tswow will automatically select this dataset and this realm unless another name is specified.

You can change the default dataset that tswow selects in `node.conf` (inside the root directory of your tswow installation) by changing the fields `Default.Realm` and `Default.Dataset`. This is recommended if you wish to bundle your own datasets and realms in your modules.