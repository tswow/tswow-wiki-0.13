---
title: Compiling on Linux
---

[Windows Guide](../compiling/)

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
```sudo apt-get install git clang cmake make gcc g++ libmariadbclient-dev libssl-dev libbz2-dev libreadline-dev libncurses-dev libboost-all-dev mariadb-server p7zip libmariadb-client-lgpl-dev-compat```

#### Misc Dependencies
```sudo apt-get install bzip2-devel p7zip-full```

## MySQL Installation

We will need to create a user account that can access MySQL. This is because we don't want to configure TSWoW to use the root user directly, as that usually requires 
the process itself to run as this user.

Log in to mysql as root:
```
sudo mysql -u root
```

Run the following commands inside the MySQL interactive prompt:

_This is necessary because MySQL for NodeJS does not work with newer authentication modes._
```sql
SET old_passwords=0;
```

_Recommended to change the username/password here_
```sql
CREATE USER 'tswow' IDENTIFIED BY 'password';
```

_Can replace with more granular privileges once you know the database structure_
```sql
GRANT ALL PRIVILEGES ON *.* TO 'tswow';
```

### Building TSWoW

When building TSWoW from source, we are concerned about three directories: 

- The `source` directory is the root directory containing all source code used to build TSWoW. 

- The `build` directory contains all intermediate files and build configurations

- The `install` directory is where we install TSWoW

The source, build and install directories should all be **separate**. Do not place any of them inside any of the others. The recommended setup is to have a `tswow-root` containing all three folders.

1. Run the following command (_optionally in a new empty folder_): `git clone https://github.com/tswow/tswow.git --recurse`

    - This will create the `source` directory, called "tswow".

    - This download is expected to take some time.
  
2. Copy `source/build.default.yaml` to `source/build.yaml` and open it. Here you can configure where tswow should place `build` and `install` directories. 

    - <span>**Do not set `install` to point at your normal TSWoW installation unless you know what you're doing, it will frequently flush out all your settings and modules!**</span>
  
3. In the `source` directory, run the command `npm i`

4. In the `source` directory, run the command `npm run build-interactive` (for building everything with a single command, just run `npm run build`).

6. You should now have entered the main TSWoW build program. You can now build any components you want

    - All TypeScript for TSWoW and the transpiler is compiled automatically as long as the build program is running

    - We currently have a bug where the prompt doesn't allow you to enter anything. Restarting the build script seems to fix this for now.

7. To get a fully working TSWoW installation, you can run the `build full` command, which will compile TrinityCore and all other components necessary. 

    - <span>To build only TrinityCore, you can use the command `build trinitycore-release`</span>

8. You should now be able to start TSWoW from the new installation folder.

## Known Issues

- `build release` doesn't work with a normal `install` directory. To build a release, you must run turn off the build script, change the install directory to an empty/non-existing directory in `source/build.yaml` and start the build script again.
    - <span>This new directory can **not** be open in VSCodium/VSCode.</span>
