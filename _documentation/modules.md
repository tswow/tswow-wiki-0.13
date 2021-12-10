---
title: Modules
---

A module in TSWoW is a single coherent modification of the World of Warcraft client and the TrinityCore server. The most basic command for creating a module is `module create module-name`

## Naming Conventions

Modules should follow the form `creator-modulename`, optionally with multiple dashes (-) in the module name itself. This is to ensure there are never two modules with identical names.

Examples of **good** module names:

* `yourusername-testmodule`

* `yourusername-test-module`

Examples of **bad** module names:

* `my-samplemodule` _<-- use a unique username_

* `yourusernamemodule`  _<-- use a dash (-) to separate your name from the module_

* `my_module`  _<-- Use a dash (-) instead of underscore._

## Endpoints

A module can contain a set of special folders called _endpoints_ that serve a specific purpose. Unless tswow is started with the `--minimal` flag, you can simply create one of these folders in your module and tswow will populate it with appropriate boilerplate and configurations automatically.

### Simple Endpoints
- _datascripts_ - Contains all datascripts for this module. Written using TypeScript.
- _livescripts_ - Contains all livescripts for this module. Written using TypeScript or C++
- _addon_ - Contains all addon files related to this module. Written using TypeScript or lua.
- _assets_ - Contains asset files (blps, adts, m2s, wmo, mp3, wav) or build files (png, psd)

### Advanced Endpoints
- _realms_ - Contains realms specified by this module. Allows modules to contain realm configurations.
- _datasets_ - Contains datasets specified by this module. Allows modules to contain id configurations, build settings and source data.

## Submodules

Modules can contain other modules, called submodules. Any folder inside a module _that is not an endpoint_ is considered a submodule.

- Dataset configurations and build command that specify a parent module will automatically also target its children, you need to explicitly exclude them to avoid this.

- Submodules are named by combining their parent names with a dot (.). For example, a submodule `my-submodule` living inside a parent module `my-module` has the full name `my-module.my-submodule` in tswow commands and configuration files.

- Submodules require no special command to be created, you can simply create a folder not named `modules` or an `endpoint` and it will be considered a submodule by tswow.

- Submodules are completely separate from their parents and vice-versa, just as root-level modules are. They cannot locally include each others datascript files, and their livescript/addon projects are completely separate.

Example directory structure using a basic submodule:
```
└── tswow-install/
    └── modules/
        └── my-module/
            ├── datascripts     <-- parent module datascripts
            └── my-submodule/   <-- submodule
                └── datascripts <-- submodule datascripts
```

## Git

A TSWoW module is just a folder that is placed inside the `modules` subdirectory in your tswow installation. However, many users also make their modules git repositories to version check their scripts and data. This section will include some best practices and considerations to make when using version control with your tswow modules.

_While it's not necessary to understand git to use tswow, we strongly recommend users get familiar with at least the basic commands. The following sections will assume a basic understanding of git, repositories, remotes and merge conflicts._

### Turning an existing module into a git repository

There are two sets of instructions depending on if your remote repository contains any initial commits or default files (README, LICENSE).

#### Remote with default files (LICENSE, README etc)

- Create a remote repository somewhere, such as [GitHub](https://github.com/) or [GitLab](https://gitlab.com/). **Make sure you add at least one default file for this workflow to work**
- Check the name of the default branch on this repository, such as `master` or `main`.
- Navigate to your module with a terminal and initialize a new git repository: `git init`
- Type the command: `git remote add origin url-to-your-git-repository`
    - GitHub Example: `git remote add origin https://github.com/myusername/myrepo.git`
- Check the name of the default branch in your remote repository, such as `master` or `main`.
- Type the command: `git pull origin default-branch-name`

#### Remote with no default files (No commits)

- Create a remote repository somewhere, such as [GitHub](https://github.com/) or [GitLab](https://gitlab.com/). **Make sure you add NO default files for this workflow to work**
- Navigate to your module with a terminal and initialize a new git repository: `git init`
- Type the command `git remote add origin url-to-your-git-repository`
    - GitHub Example: `git remote add origin https://github.com/myusername/myrepo.git`
- Commit your local files
- Check the name of the default branch in your local repository, such as `master` or `main`
- Push your branch to the remote: `git push -u origin default-branch-name`

### Gitignore

TSWoW will a default `.gitignore` if you create a module using the `create module` command:

```
# Build/Garbage
build/
DBFilesClient/
global.d.ts
tsconfig.json
Crashes/
logs/
Server.log
DBErrors.log
*.conf.dist
*_backup/

# Extracted client data
**/datasets/*/dbc_source
**/datasets/*/dbc
**/datasets/*/maps
**/datasets/*/mmaps
**/datasets/*/vmaps
**/datasets/*/Buildings
**/datasets/*/Cameras
**/datasets/*/luaxml
**/datasets/*/luaxml_source
```

### Committing asset files

The default gitignore may be a good start for what files you can safely leave out when committing to your repository. However, when dealing with asset files, there are some additional considerations you will need to make:

- Warcraft assets can get quite large even for small projects, and committing multiple versions for them will make your repository very slow to clone. One way to avoid this is to use [Git LFS](https://docs.github.com/en/repositories/working-with-files/managing-large-files/installing-git-large-file-storage).

- If hosting your repository with GitHub or GitLab, be aware that the quota for repositories is quite small (~1GB for free repos), and even with Git LFS every commit you make counts towards this quota. GitHub is the worst choice for this, as once your quota fills up, you have no way to push to your repository anymore until you completely delete it along with any stars or forks it has.

- TSWoW can automatically convert png and psd files to blp when building datascripts. You may wish to individually filter out generated blps in some directories, while keeping them as blps in others. Remember that you can place additional `.gitignores` in subdirectories.

### Submodules

TSWoW submodules have no relation to git submodules, but you can of course implement one using the other if you wish.