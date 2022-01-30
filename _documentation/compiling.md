---
title: Compiling on Windows
---

[Linux Guide](../compiling-linux/)

The purpose of this document is to:

1. Walk users through how to build TSWoW from source

2. Document important details and common issues

## Prerequisites

- [Git](https://github.com/git-for-windows/git/releases/download/v2.30.0.windows.2/Git-2.30.0.2-64-bit.exe)

- [Visual Studio 2019+](https://visualstudio.microsoft.com/downloads/)

All other dependencies can be installed during the installation.

### Installation

When building TSWoW from source, we are concerned about three directories: 

- The `source` directory is the root directory containing all source code used to build TSWoW. 

- The `build` directory contains all intermediate files and build configurations

- The `install` directory is where we install TSWoW

The source, build and install directories should all be **separate**. Do not place any of them inside any of the others. The recommended setup is to have a `tswow-root` containing all three folders.

1. Run the following command (_optionally in a new empty folder_): `git clone https://github.com/tswow/tswow.git --recurse`

    - This will create the `source` directory, called "tswow".

    - This download is expected to take some time.
  
2. Copy `source/build.default.conf` to `source/build.conf` and open it. Here you can configure where tswow should place `build` and `install` directories. 

    - <span>**Do not set `install` to point at your normal TSWoW installation unless you know what you're doing, it will frequently flush out all your settings and modules!**</span>
  
3. In the `source` directory, run the command `npm i`

4. In the `source` directory, run the command `npm run build-interactive` (to build everything without an interactive prompt, use `npm run build`).

5. Install dependencies (TSWoW expects these to be in the `build` directory, so you need most even if you normally compile TrinityCore

    - <span>[Install Boost](https://sourceforge.net/projects/boost/files/boost-binaries/1.72.0/boost_1_72_0-msvc-14.2-64.exe/download)</span>
        - <span>The typical path to install this to is `C:\local\boost_1_72_0`</span>
        - <span>Open an elevated command prompt and type this command: `"setx BOOST_ROOT C:/local/boost_1_72_0" /M` (replacing the path with your boost path)</span>
        - <span>Should not be necessary if you can already compile TrinityCore</span>
    - <span>[Install CMake](https://github.com/Kitware/CMake/releases/download/v3.18.3/cmake-3.18.3-win64-x64.zip)</span>
        - <span>Install it to `build/cmake` (The path `build/cmake/cmake-3.18.3-win64-x64` should exist) </span>
    - <span>[Install OpenSSL v1.1.1](https://slproweb.com/products/Win32OpenSSL.html)</span>
        - <span>Set installation path to `build/openssl` </span>
        - <span>Set it to copy OpenSSL binaries to "The OpenSSL binaries (/bin) directory".</span>
    - <span>[Install MySQL v5.7.32-x64](https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.32-winx64.zip)</span>
        - <span>Extract it to `build/mysql` (The path `build/mysql/mysql-mysql-5.7.32-winx64` should exist)</span>
    - <span>[Install blpconverter](https://github.com/tswow/BLPConverter/releases/download/1.0/BLPConverter.exe)</span>
        - <span>Place it at `build/blpconverter.exe`</span>
        
6. You should now have entered the main TSWoW build program. You can now build any components you want

    - All TypeScript for TSWoW and the transpiler is compiled automatically as long as the build program is running

    - We currently have a bug where the prompt doesn't allow you to enter anything. Restarting the build script seems to fix this for now.

7. To get a fully working TSWoW installation, you can run the `build full` command, which will compile TrinityCore and all other components necessary. 

    - <span>To build only TrinityCore, you can use the command `build trinitycore-relwithdebinfo`</span>

8. You should now be able to start TSWoW from the new installation folder.

## Known Issues

### Release build install directory
`build release` doesn't work with a normal `install` directory. To build a release, you must run turn off the build script, change the install directory to an empty/non-existing directory in `source/build.conf` and start the build script again.
    - <span>This new directory can **not** be open in VSCodium/VSCode.</span>

### Missing Windows sdk errors (MSB8036)

- This issue might be related to building on Windows 7 or having multiple instances of Visual Studio installed.
- If you have this issue, [please let us know](https://discord.gg/M89n6TZh9x) and what your operating system / visual studio versions you have installed.

Some users have reported getting issues when building TrinityCore that looks similar to this in the log:

```
CMake Error at CMakeLists.txt:18 (project):
  Failed to run MSBuild command:

    C:/Program Files (x86)/Microsoft Visual Studio/2019/Community/MSBuild/Current/Bin/MSBuild.exe

  to get the value of VCTargetsPath:

    Microsoft (R) Build Engine version 16.11.2+f32259642 for .NET Framework
    Copyright (C) Microsoft Corporation. All rights reserved.

    Build started 1/29/2022 3:09:38 PM.
    Project "D:\WowDev\Tools\TSWoW\tswow-build\TrinityCore\CMakeFiles\3.18.3\VCTargetsPath.vcxproj" on node 1 (default targets).
    C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\MSBuild\Microsoft\VC\v160\Microsoft.Cpp.WindowsSDK.targets(46,5): error MSB8036: The Windows S
DK version 10.0.19041.0 was not found. Install the required version of Windows SDK or change the SDK version in the project property pages or by right-clicking
the solution and selecting "Retarget solution". [D:\WowDev\Tools\TSWoW\tswow-build\TrinityCore\CMakeFiles\3.18.3\VCTargetsPath.vcxproj]
    Done Building Project "D:\WowDev\Tools\TSWoW\tswow-build\TrinityCore\CMakeFiles\3.18.3\VCTargetsPath.vcxproj" (default targets) -- FAILED.

    Build FAILED.
```

Note the windows sdk version that it requests (10.0.19041.0 in the above example). We managed to get this to work by editing the file `C:\Program Files (x86)\Windows Kits\10\DesignTime\CommonConfiguration\Neutral\UAP\<windows-sdk-version>\UAP.props` (replacing `<windows-sdk-version>` with the version from your error log) and commenting out the line starting with `<WindowsSdkDir>`:

```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">

  <PropertyGroup>
     <!-- Force WindowsSdkDir to always be a parent to this props file -->
<!--     <WindowsSdkDir>$([MSBUILD]::GetDirectoryNameOfFileAbove('$(MSBUILDTHISFILEDIRECTORY)', 'sdkmanifest.xml'))</WindowsSdkDir> -->
...
  </PropertyGroup>
```

[Original post](https://gitlab.kitware.com/cmake/cmake/-/issues/22440#note_986549)
