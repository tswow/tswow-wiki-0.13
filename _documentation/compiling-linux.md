---
title: Compiling on Linux
---

[Windows Guide](../compiling/)

**Please note: Linux development is currently disabled on the 0.13 branch of tswow.**

The purpose of this document is to:

1. Walk users through how to build TSWoW from source

2. Document important details and common issues

This guide has been tested on `Debian` and `Ubuntu`.

## Prerequisites
Simply run these commands in a terminal. Before anything else, run `sudo apt-get update`.
You should install dependencies in the order listed here, since they sometimes depend on each others.

#### Curl
```
sudo apt-get install curl
```

#### NodeJS
```
sudo curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Git:
```
sudo apt-get install git
```

#### TrinityCore Dependencies
```
sudo apt-get install git clang cmake make gcc g++ libmariadbclient-dev libssl-dev libbz2-dev libreadline-dev libncurses-dev libboost-all-dev mariadb-server p7zip libmariadb-client-lgpl-dev-compat
```

#### Misc Dependencies
```
sudo apt-get install bzip2-devel p7zip-full
```

### Building TSWoW

When building TSWoW from source, we are concerned about three directories:

- The `source` directory is the root directory containing all source code used to build TSWoW.

- The `build` directory contains all intermediate files and build configurations

- The `install` directory is where we install TSWoW

The source, build and install directories should all be **separate**. Do not place any of them inside any of the others. The recommended setup is to have a `tswow-root` containing all three folders.

1. Run either of the following commands (_optionally in a new empty folder_):
    - For bleeding edge: `git clone https://github.com/tswow/tswow.git --recurse`
    - For the latest release `git clone https://github.com/tswow/tswow.git --recurse --branch v0.12-beta` (change tag)
    - This will create the `source` directory, called "tswow".
    - This download is expected to take some time.
    - It is recommended to start developing on the latest release rather than the bleeding edge, as linux is often only tested for new releases.

2. <span>Copy `source/build.default.yaml` to `source/build.yaml` and open it. Here you can configure where tswow should place `build` and `install` directories.</span>

    - <span>**Do not set `install` to point at your normal TSWoW installation unless you know what you're doing, it will frequently flush out all your settings and modules!**</span>

3. <span>In the `source` directory, run the command `npm i`</span>

4. <span>In the `source` directory, run the command `npm run build-interactive` (for building everything with a single command, just run `npm run build`).</span>

6. <span>You should now have entered the main TSWoW build program. You can now build any components you want</span>

    - <span>All TypeScript for TSWoW and the transpiler is compiled automatically as long as the build program is running</span>

    - <span>We currently have a bug where the prompt doesn't allow you to enter anything. Restarting the build script seems to fix this for now.</span>

7. To get a fully working TSWoW installation, you can run the `build full` command, which will compile TrinityCore and all other components necessary.

    - <span>To build only TrinityCore, you can use the command `build trinitycore-relwithdebinfo`</span>

## MySQL Installation

If you haven't already set up mysql on your machine, you need to create a user account that can access it. 

You may need to first start the mysql service:

```
sudo service mysql start
```

Run the following command to create a new mysql user (replacing 'tswow' and 'password' with your own values):
```
sudo mysql -u root -e "SET old_passwords=0; CREATE USER 'tswow' IDENTIFIED BY 'password'; GRANT ALL PRIVILEGES ON *.* TO 'tswow';"
```

Inside your `install` directory, open `node.conf` and replace all instances of "tswow;password" with your own username/password created above. `Database.WorldSource`, `Database.WorldDest`, `Database.Auth` and `Database.Characters` should all be changed.

## Known Issues

- `build release` doesn't work with a normal `install` directory. To build a release, you must run turn off the build script, change the install directory to an empty/non-existing directory in `source/build.yaml` and start the build script again.
    - <span>This new directory can **not** be open in VSCodium/VSCode.</span>
