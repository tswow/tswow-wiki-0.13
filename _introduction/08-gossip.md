---
title: Gossip
---

This tutorial will be an introduction to Gossip systems. Gossip in World of Warcraft. A gossip is the chat window you see with NPCs in the world. As we have seen previously, some gossip windows are automatically generated for us when we create NPCs such as trainers, but by explicitly creating gossip windows we can fully customize how these menus act and behave.

This gossip tutorial will focus on **static** gossips, that we build with data scripts. It is however possible to create fully **dynamic** gossip systems using live scripts, that will be covered in a future tutorial.

_Temporary note: **dynamic** gossip systems are not yet implemented in TSWoW, but this tutorial only deals with **static** systems so everything here should work._

## Gossip Theory

A gossip menu has a few different parts, and we will briefly explain those here.

**Gossip Page**: A gossip page is a single displayed text window.

**Gossip Option**: A gossip option is an option that the player can click.

**Option Action**: An option action is what a gossip option does to the menu, such as opening a completely new gossip page, open a trainer window, vendor window, bank and so on. Some actions have separate menus associated with them, while others do not.

{:refdef: style="text-align: center;"}
![](../gossip-parts.png)
{:refdef}

## Creating your first Gossip

In TSWoW, we tie gossip to specific creature templates. This means the first step in creating a gossip is to create a new creature template. Create a new file `Gossip.ts` in your module and add the following code:

```ts
import { std } from "tswow-stdlib";

const MY_CREATURE = std.CreatureTemplates
    .create('mymod','mycreature',6373)
    .NPCFlags.GOSSIP.set(true)
    .NPCFlags.BANKER.set(true)
    .NPCFlags.INNKEEPER.set(true)
    .NPCFlags.VENDOR.set(true)
    .Name.set({enGB:'Gossip Test'});

// Spawns this creature just outside of the Northshire Abbey entrance
MY_CREATURE.Spawns.add('mymod','mycreature_spawn',[
    {map:0,x:-8923.843750,y:-136.506027,z:80.972542,o:1.902233}
])
```

You can rebuild your scripts and verify that this new creature is standing outside of Northshire Abbey, and you shouldn't be able to interact with it in any way.

Now, add the following to the bottom of `Gossip.ts`:

```ts
// Store the main gossip for this creature
const MAIN_GOSSIP = MY_CREATURE.Gossip.getNew();

// Set the gossip main display text
MAIN_GOSSIP.Text.add({enGB:'Hello world from Gossip window'});

// Alternate text (randomly selected)
MAIN_GOSSIP.Text.add({enGB:'Hi world from Gossip window'});
```

This is all we need to create a basic gossip window. Rebuild and check your creature again, this time you should be able to interact and you should see any the above texts in your gossip window. If you click the NPC enough times you should see both messages appear randomly.

{:refdef: style="text-align: center;"}
![](../gossip-simple.png)
{:refdef}

### Gossip Options

Let's create a few basic gossip options we can click on. Add the following code:

```ts
// Creates a new option to open a bank
const BANK_OPTION = MAIN_GOSSIP.Options.addGet()
BANK_OPTION.Action.BANKER.set()
BANK_OPTION.Icon.MONEY_BAG.set()
BANK_OPTION.Text.setSimple({enGB:'Please open my bank for me'});
```

{:refdef: style="text-align: center;"}
![](../gossip-bank.png)
{:refdef}

When you rebuild and talk to the NPC, you will notice that the bank opens automatically. This is because, in WotLK, gossips will automatically open many common options automatically if it's the only option available.

Let's add another option so we can again see our gossip window:

```ts
// Creates a new option to an innkeeper.
const INNKEEPER_OPTION = MAIN_GOSSIP.Options.addGet()
INNKEEPER_OPTION.Action.INNKEEPER.set()
INNKEEPER_OPTION.Icon.CHAT.set()
INNKEEPER_OPTION.Text.setSimple({enGB:'Can I stay here?'});
```

You should now see that you get both the gossip options you created when you click on the NPC. You should also be able to verify that both options work as intended, and you can both access your bank and set this location as an inn (_note: You cannot set your inn location if GM mode is activated_).

{:refdef: style="text-align: center;"}
![](../gossip-innkeeper.png)
{:refdef}

## Creating Sub-menus

We have now shown how to add basic gossip options, so let's try and make sub-menus. The first step is to create a new option just like before, and then to set the action to open a "new gossip window". Add the following code:

```ts
// First, we create the sub-menu option
const SUBMENU_OPTION = MAIN_GOSSIP.Options.addGet()
SUBMENU_OPTION.Icon.COGWHEEL.set()
SUBMENU_OPTION.Text.setSimple({enGB: 'Go to sub-menu'})

// Now, we create the submenu itself from the option action
SUBMENU_OPTION.Action.GOSSIP.setNew(submenu=>{
    submenu.Text.add({enGB:'Hello world from sub-menu'});
})
```

{:refdef: style="text-align: center;"}
![](../gossip-submenu-option.png)
{:refdef}

{:refdef: style="text-align: center;"}
![](../gossip-submenu.png)
{:refdef}

Now, when you click the third option in your main gossip window, you should see that it leads you to the sub-menu. Let's add a link back to the main window. complete the submenu callback as follows:

```ts
// Now, we create the submenu itself from the option action
SUBMENU_OPTION.Action.GOSSIP.setNew(submenu=>{
    submenu.Text.add({enGB:'Hello world from sub-menu'});
    const BACK_LINK = submenu.Options.addGet()
    BACK_LINK.Text.setSimple({enGB:'Go back to main menu'});
    BACK_LINK.Action.GOSSIP.setLink(MAIN_GOSSIP.ID)
})
```

You should now see that your sub-menu links back to the main menu, and you can toggle between them indefinitely.

{:refdef: style="text-align: center;"}
![](../gossip-link.png)
{:refdef}

## Creating Vendors

One of the more involved actions is a Vendor window, so let's see how to create those with TSWoW. In World of Warcraft, Vendor data is stored per creature template, but we will see how we can use TSWoW to circumvent this and access multiple vendors from a single creature.

_Multivendor functionality was made possible using [Rochet2's Multivendor module](https://rochet2.github.io/Multivendor.html)_

Add the following code:

```ts
const VENDOR_OPTION = MAIN_GOSSIP.Options.addGet()
VENDOR_OPTION.Icon.VENDOR.set()
VENDOR_OPTION.Text.setSimple({enGB: 'Text'})
VENDOR_OPTION.Action.VENDOR.setNew(vendor=>{
    vendor.Items.add(35);
});
```

You should now be able to open your vendor and purchase a Bent staff for 95 copper.

{:refdef: style="text-align: center;"}
![](../vendor-option.png)
{:refdef}

{:refdef: style="text-align: center;"}
![](../vendor-screen.png)
{:refdef}

Price informations is stored in items themselves, and we will learn more about creating items in a future tutorial. However, if you want to, you can add the following code to manipulate the price of that particular item:

```ts
// Change the price so players can sell the item for 50 copper and buy it for 1 silver.
std.Items.load(35).Price.set(50,100);
```

## Summary

This concludes our introduction to Gossips in TSWoW. You have learnt:

- How to create a simple one-page Gossip menu

- How to add gossip options for banks, innkeepers and vendors.

- How to create sub-menus and links to other gossip menus.

Our final `Gossip.ts` becomes:

```ts
import { std } from "tswow-stdlib";

const MY_CREATURE = std.CreatureTemplates
    .create('mymod','mycreature',6373)
    .Name.set({enGB:'Gossip Test'});
    .NPCFlags.GOSSIP.set(true)
    .NPCFlags.BANKER.set(true)
    .NPCFlags.INNKEEPER.set(true)
    .NPCFlags.VENDOR.set(true)

// Spawns this creature just outside of the Northshire Abbey entrance
MY_CREATURE.Spawns.add('mymod','mycreature_spawn',[
    {map:0,x:-8923.843750,y:-136.506027,z:80.972542,o:1.902233}
])

// Store the main gossip for this creature
const MAIN_GOSSIP = MY_CREATURE.Gossip.getNew();

// Set the gossip main display text
MAIN_GOSSIP.Text.add({enGB:'Hello world from Gossip window'});

// Alternate text (randomly selected)
MAIN_GOSSIP.Text.add({enGB:'Hi world from Gossip window'});

// Creates a new option to open a bank
const BANK_OPTION = MAIN_GOSSIP.Options.addGet()
BANK_OPTION.Action.BANKER.set()
BANK_OPTION.Icon.MONEY_BAG.set()
BANK_OPTION.Text.setSimple({enGB:'Please open my bank for me'});

// Creates a new option to an innkeeper.
const INNKEEPER_OPTION = MAIN_GOSSIP.Options.addGet()
INNKEEPER_OPTION.Action.INNKEEPER.set()
INNKEEPER_OPTION.Icon.CHAT.set()
INNKEEPER_OPTION.Text.setSimple({enGB:'Can I stay here?'});

// First, we create the sub-menu option
const SUBMENU_OPTION = MAIN_GOSSIP.Options.addGet()
SUBMENU_OPTION.Icon.COGWHEEL.set()
SUBMENU_OPTION.Text.setSimple({enGB: 'Go to sub-menu'})

// Now, we create the submenu itself from the option action
SUBMENU_OPTION.Action.GOSSIP.setNew(submenu=>{
    submenu.Text.add({enGB:'Hello world from sub-menu'});
    const BACK_LINK = submenu.Options.addGet()
    BACK_LINK.Text.setSimple({enGB:'Go back to main menu'});
    BACK_LINK.Action.GOSSIP.setLink(MAIN_GOSSIP.ID)
})

// Creates a vendor stored on our own Creature ID.
// The first vendor we create for a creature MUST
// use "ownVendor".
const VENDOR_OPTION = MAIN_GOSSIP.Options.addGet()
VENDOR_OPTION.Icon.VENDOR.set()
VENDOR_OPTION.Text.setSimple({enGB: 'Text'})
VENDOR_OPTION.Action.VENDOR.setNew(vendor=>{
    vendor.Items.add(35);
});

// Change the price so players can sell the item for 50 copper and buy it for 1 silver.
std.Items.load(35).Price.set(50,100);
```

Trainers windows work very similar to vendors, and you can also have multiple. Your challenge for this section is to add one or multiple class trainers to this gossip system.
