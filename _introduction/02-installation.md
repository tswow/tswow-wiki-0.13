---
title: Windows Installation
---

This guide will explain how to set up a fully working TSWoW development environment with a working server that you can connect to from your local computer.

**Note: Just like many tools in WoW development, TSWoW does not permit spaces in filepaths. Make sure your installation path and client files do not contain any spaces**

## Prerequisites

You will need to install the following programs:

- World of Warcraft 3.3.5a client

    - Currently, I can only verify that the _enGB_ and _enUS_ clients work, please make an [issue](https://github.com/tswow/tswow/issues) if you use another locale and you face any problems.

    - Please make sure there are **no spaces** anywhere in the pathname to your WoW client **or the TSWoW installation**.

- [Git](https://github.com/git-for-windows/git/releases/download/v2.30.0.windows.1/Git-2.30.0-64-bit.exe)

- [7-zip](https://www.7-zip.org/a/7z1900-x64.exe) (do **not** use winrar to open 7zip files, we've had reports that this breaks/ignores some files)

- [Node.js (version 12.19 or higher)](https://nodejs.org/dist/v14.15.1/node-v14.15.1-x64.msi)

- [Python 2.7](https://www.python.org/ftp/python/2.7.2/python-2.7.2.amd64.msi) (or any of 3.5, 3.6, 3.7, 3.8)

- **All** the following versions of VCRedist:

    - [Latest x86](https://aka.ms/vs/16/release/vc_redist.x86.exe)

    - [Latest x64](https://aka.ms/vs/16/release/vc_redist.x64.exe)

    - [2013 x86+x64](https://www.microsoft.com/en-us/download/details.aspx?id=40784) (Select "English", then both x86 and x64)

- [VSCodium version 1.55](https://github.com/VSCodium/vscodium/releases/download/1.55.2/VSCodiumSetup-x64-1.55.2.exe)

    - <span>Later versions will still work (including Microsofts VSCode), but there is an [active issue](https://github.com/tswow/tswow/issues/263) causing problems for datascripts in versions above 1.55. [See workarounds here](https://github.com/tswow/tswow/issues/263#issuecomment-881907723).</span>


- (Optional) To compile **live scripts**, you will also need [Visual Studio 2019 Community](https://visualstudio.microsoft.com/downloads/). The whole first part of this tutorial series will only be using data scripts, so you don't need to install this yet.

    - <span>When installing Visual Studio, you will be asked to choose what packages to install in a window similar to the following. The **only** package that is necessary for building Live Scripts is `Desktop development with C++`, as shown below. The only toggle you need to select is in the red square, everything else can use default settings.</span>

{:refdef: style="text-align: center;"}
![](../vs-installer.png)
{:refdef}

## Installation

1. [Download the latest version of TSWoW from here](https://github.com/tswow/tswow/releases)

2. Extract the TSWoW archive. The installation folder should contain (roughly) the following files and folders:

    ```
    package-lock.json
    package.json
    bin
    coredata
    modules
    node_modules
    ```
3. Start the VSCodium editor. Press F1 and type "Open folder", select the first option and select your TSWoW installation folder. This is your new development environment.

4. Configure your client path. Open the file `coredata/datasets/default/default.dataset.yaml` (shortcut. press `Ctrl+P` and type `default.dataset`) and fill in the `client_path` field. This should be the **directory** that contains your client executable. **Note: If using double quotes, you need to use double backslashes**:

valid:
```yaml
client_path: C:\dev\wow\335\client
```

valid:
```yaml
client_path: "C:\\dev\\wow\\335\\client"
```

not valid:
```
client_path: "C:\dev\wow\335\client"
```

not valid:
```
client_path: C:\\dev\\wow\\335\\client
```

## Starting the server

1. Inside VSCodium, press ``Ctrl+` `` OR press `F1` and type `Toggle Terminal` and select the first option. This should open a terminal inside VSCodium.

2. This terminal should be inside your TSWoW installation directory. If not, navigate to it using `cd` commands.

3. Run the command `npm run start`. This will start the automatic installation and then start the server.

4. Wait for the core database installation. This is a long process on the first installation and can take a long time depending on your machine. 20-30 minutes isn't rare. You know the installation is done when you see a message similar to `TrinityCore rev. 2a67a101096e 2021-04-23 09:24:53 +0200 (tswow branch) (Win64, RelWithDebInfo, Dynamic) (worldserver-daemon) ready...`.

5. To create a gm account, type the following commands (**remember the ws prefix**) into the terminal:

    - `realm send tswow account create myuser mypassword`

    - `realm send tswow account set gmlevel myuser 3 -1`

6. You can now start the client with the command `client start` and log in to the game.
