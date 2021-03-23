---
title: Modules
---

A module in TSWoW is a single coherent modification of the World of Warcraft client and the TrinityCore server. The most basic command for creating a module is `module create module-name`

## Naming Conventions

All modules should follow the form `creator-modulename`, optionally with multiple dashes (-) in the module name itself. This is to ensure there are never two modules with identical names.

Examples of **good** module names:

* `yourusername-testmodule`

* `yourusername-test-module`  

Examples of **bad** module names:

* `my-samplemodule` _<-- use a unique username_

* `yourusernamemodule`  _<-- use a dash (-) to separate your name from the module_

* `my_module`  _<-- Use a dash (-) instead of underscore._

## Git

_Git is not required knowledge to use TSWoW, but we strongly recommend users at least learn the basics. There are many tutorials for it online, and you can pick any that you prefer._

Module management in TSWoW is based on Git, and we do not use a separate package manager. 

When a module is created, it is either cloned from a remote repository or initialized as a local repository. 
Once created, you can interact with it just like with any normal repository.

### Creation

To set up a repository for a new module: 

1. Create a remote repository e.g. on GitHub 

2. Create the new module with the command `module create repository-url`

This will clone the remote repository and create the default files just like a normal local module. 

### Installation

To install a module from a remote repository:

1. Find the remote url

2. Install the module with the command `module install remote-url`

The only difference between creating and installing a remote module is that creating it automatically initializes default directories, while installation does not.
