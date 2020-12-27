# Windows Installation

[Back to Table of Contents](README.md)

This guide will explain how to set up a fully working TSWoW development environment with a working server that you can connect to from your local computer.

## Prerequisites

You will need to install the following programs:

- World of Warcraft 3.3.5a client 
    - Currently, I can only verify that the _enGB_ and _enUS_ clients work, please make an [issue](https://github.com/tswow/tswow/issues) if you use another locale and you face any problems. 
- [Node.js (version 12.19 or higher)](https://nodejs.org/dist/v14.15.1/node-v14.15.1-x64.msi)

- **All** the following versions of VCRedist:
    - [Latest x86](https://aka.ms/vs/16/release/vc_redist.x86.exe)
    - [Latest x64](https://aka.ms/vs/16/release/vc_redist.x64.exe)
    - [2013 x86+x64](https://www.microsoft.com/en-us/download/details.aspx?id=40784) (Select "English", then both x86 and x64)

- [VSCodium version 1.45](https://github.com/VSCodium/vscodium/releases/tag/1.45.1)
    - Later versions **should** work (including Microsofts VSCode), but I had general performance issues with 1.51 so I don't use it.

- (Optional) To compile **live scripts**, you will also need [Visual Studio 2019 Community](https://visualstudio.microsoft.com/downloads/). The whole first part of this tutorial series will only be using data scripts, so you don't need to install this yet.


## Installation

1. [Download the latest version of TSWoW from here](https://github.com/tswow/tswow/releases)

2. Extract the TSWoW archive. The installation folder should contain (roughly) the following files and folders:

    ```
    package-lock.json
    package.json
    bin
    config
    coredata
    modules
    node_modules
    ```
3. Open the file `config/tswow.yaml` with a text editor, and change the client directory path to where you placed your 3.3.5 client (the root folder containing wow.exe).

4. Start the VSCodium editor. Press F1 and type "Open folder", select the first option and select your TSWoW installation folder. This is your new development environment.

## Starting the server

1. Inside VSCodium, press ``Ctrl+` `` OR press `F1` and type `Toggle Terminal` and select the first option. This should open a terminal inside VSCodium.

2. This terminal should be inside your TSWoW installation directory. If not, navigate to it using `cd` commands.

3. Run the command `npm run start`. This will start the automatic installation and then start the server.

4. Wait for the automatic installation, which can take a while depending on your machine. For me, it's about 10 minutes to set everything up.
    - If you get any errors, double check you wrote the correct client path in `config/tswow.yaml`, otherwise [submit an issue](https://github.com/tswow/tswow/issues) and include the log file (log.txt in your installation directory). 

5. When the installation is done, it will make a bell sound and you will see a message similar to ```Initialized tswow in 67.70s``` in the terminal.

6. To create a gm account, type the following commands (**remember the ws prefix**) into the terminal:
    - `ws account create myuser mypassword`
    - `ws account set gmlevel myuser 3 -1`

7. Installation complete! You can now move on and [create your first module](3_YourFirstModule.md)
