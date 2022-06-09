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

- [All the normal tswow dependencies](https://tswow.github.io/tswow-wiki/introduction/02-installation/#prerequisites)

All further dependencies are automatically installed by tswow.

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
        
5. You should now have entered the main TSWoW build program. You can now build any components you want

    - All TypeScript for TSWoW and the transpiler is compiled automatically as long as the build program is running

    - We currently have a bug where the prompt doesn't allow you to enter anything. Restarting the build script seems to fix this for now.

6. To get a fully working TSWoW installation, you can run the `build full` command, which will compile TrinityCore and all other components necessary. 

    - <span>To build only TrinityCore, you can use the command `build trinitycore-relwithdebinfo`</span>

7. You should now be able to start TSWoW from the new installation folder.

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
