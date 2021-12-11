---
title: Modding Introduction
---

_Note: This tutorial series was recently rewritten to work with tswow version 0.13. Some code is not very well explained here, and the later sections have not yet been rewritten as we're looking at replacing this with a better tutorial altogether. Please reach out if there is anything you would like to know, we can usually provide basic code examples for most types of mods in the game._

In this section, we will briefly explain how modding with TSWoW looks and feels like. There are no exercises here, just read it through and try to understand the basic concepts. When finished, you're not expected to understand **how** to create these types of mods, but simply know that they exist.

With TSWoW, we use the TypeScript programming language in the VSCodium/VSCode editor to modify the games data and behavior. Below is how modding typically looks, we have a code window and a terminal open to compile our code, and to restart and communicate with the server and client.

{:refdef: style="text-align: center;"}
![](../tswow-layout.png)
<br/><br/>
_A typical TSWoW development environment_
{: refdef}

## Module Structure
TSWoW mods are divided into _modules_. A module is a folder containing scripts and game assets that modifies the game in some way. All modules are placed in the `modules` subdirectory in your TSWoW installation.

{:refdef: style="text-align: center;"}
![](../modules.png)
_Two modules installed_
{: refdef}

{:refdef: style="text-align: center;"}
![](../module-contents.png)
_Contents of a typical TSWoW module_
{: refdef}

{:refdef: style="text-align: center;"}
![](../module-vscodium.png)
<br/><br/>
_Module as viewed from VSCodium_
{: refdef}

## The Three Types of TSWoW Mods

There are three types of mods that we can create with TSWoW: **Data Scripts**, **Live Scripts** and **Assets**. As you can see above, in each module we have a dedicated folder for each type. The **datadata** folder is for data scripts, the **livescripts** folder is for live scripts and the **assets** folder is for assets. We will now briefly explain what each type of mod is used for.


### Data Scripts

Data scripts are TypeScript code files that modify the World of Warcraft game data in some way by creating or modifying existing game entities, such as classes, items, quests, titles, and languages. These files are run only during development to create data files for the server and client, and never when the game is actually running. Below is an example of how a data script might look.

```ts
import { std } from "tswow-stdlib";

// Create a class with id "tswow:necromancer" based on the Mage class.
export const NECROMANCER = std.Classes
    .create('tswow','necromancer','MAGE')
    .Races.add(['HUMAN','ORC','DWARF','UNDEAD','BLOODELF'])
    .Name.set({enGB:"Necromancer"})
    .Stats.SpellCrit.set((x)=>x*2)
    .Stats.MeleePowerType.MAGE.set()
```

{:refdef: style="text-align: center;"}
![](../custom-class.png)
<br/><br/>
_Code example of a fully working custom class made with a Data Script_
{: refdef}

### Live Scripts

Sometimes, we need extra custom behavior that data scripts cannot achieve, since all they do is modify or create static game data. For this, we use Live scripts, which allows us to run live code in the server when certain events happen, such as a creature taking damage, a player logging in or a guild being created. We write live scripts in TypeScript, and TSWoW transforms it into C++ that can be reloaded into the server without restarting it. For modding veterans, this is the TSWoW version of C++ scripts or Eluna lua scripts.  With live scripts, we get the best of both worlds since scripts are both easy to write thanks to autocompletion and highly performant thanks to the C++ transpiler.

However, because Live Scripts are transformed into C++ they only support a **subset** of TypeScript, and are intended to register event listeners in a specific way. You can not use npm packages, and there are generally a lot of restrictions on how you can write this code.

```ts
// The main entry point a module
export function Main(events: TSEvents) {
    // Register an event when a player says something
    events.Player.OnSay((player,message)=>{
        // Send a message to the player from the server
        player.SendBroadcastMessage(`You said "${message.get()}"!`);
    });
}
```
{:refdef: style="text-align: center;"}
![](../live-script.png)
<br/><br/>
_Code example of a Live Script_
{:refdef}

### Assets

Assets are simply resource files such as 3D models, textures and audio. These files will be automatically bundled to the client directory when you run your data scripts, and can both replace existing game assets and add new ones. Below is an example of using an asset replacement to change the texture of ivory boars.

_Note to veterans: To modify DBC, LUA or XML files you use data scripts, not assets._

{:refdef: style="text-align: center;"}
![](../boar-file.png)
![](../boar-ingame.png)
_Silly boar recoloring using an asset replacement_
{:refdef}

### The Fourth Mod Type

Since version 0.10, there is a new type of TSWoW mod: [AddOns](../../documentation/addons/) which allows you to create clientside AddOns that can communicate with the server. Just like every other type of mod, AddOns can be written in TypeScript instead of lua. This type of mod is a more advanced feature of TSWoW and won't be covered in the introductory tutorial.

## Summary

You have now learnt the three things you can do with TSWoW:

- Use Data Scripts to modify **game data**

- Use Assets to replace **resource files and game assets**

- Use Live scripts to **script the server**

- Use AddOns to modify the **client interface and scripts**
