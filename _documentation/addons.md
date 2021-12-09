---
title: Addons
---

TSWoW supports creating addons using the TypeScript programming language, and to write special message classes that allow high-level communication between addons and Live scripts.
When an addon is built, the code is transpiled into lua and automatically installed at the configured client path. The purpose of this document is to explain how addon development works
and the differences from normal addon development.

_Please note: The sources TSWoW has used to generate type definitions come from very poorly structured web pages and may not be entirely accurate. An exact specification of the Blizzard API for 3.3.5 is very hard to come by, [so we appreciate reports on any inaccuracies](https://github.com/tswow/tswow/issues/120)._

- <span>While TSWoW itself is released under a GPLv3 license, all our client libraries are exceptions to this and instead released under MIT, meaning servers have no obligation to keep their addons open source. TSWoW is server-friendly, even with addons.</span>

## Files

A single module can contain at most a single addon, which is located at `modulename/addons`. Users can generate this directory using the command `addon create modulename`.
The entrypoint for all addons is the file `addons/modulename-addon.ts`, but users may create any other amount typescript files under this directory and import them as you normally would in TypeScript. 

Addons can also access files in the `modulename/shared` directory. Since the `shared` directory is also used by live scripts, the coding style here must be valid for both addons and live scripts.  

### Special Files

When an addon is generated, the following necessary files are automatically created in the new addons directory. Users should **not** remove these files.

- `global.d.ts`: Contains type definitions for all Blizzard functions and types accessible from lua.

- `lib/Events.ts`: Contains TSWoWs custom addon event and communications systems.

- `addon.ts`: Is always the first real entrypoint of your addon. It is the only transpiled file that is automatically executed.

## TypeScript

TypeScript files are used just like lua files are in normal addon development, with the exception that it's only `addons/modulename-addon.ts` that is automatically executed.
For any other file to be executed, it must be imported by this file or any file that is itself imported.  

The type declarations allow users to write code that's usually very similar to the way normal lua addon development works:

```ts
// The Blizzard API is available globally without importing anything
let myframe = CreateFrame('Frame');
myframe.SetSize(10,10);
myframe.Show();
```

### Event Registry

TSWoW has a special system for more easily handle events, which is very similar to how events are handled on LiveScripts.  

```ts
import { Events } from "./events";

// All we need to set up an event listener is a frame with a unique name.
const frame = CreateFrame('Frame','UniqueName');

// We can now easily register an events using the "Events" interface.
Events.ChatInfo.OnChatMsgSay(frame,(text)=>{
  console.log("A player said something:"+text);
});

// We can register listeners for multiple events.
Events.ChatInfo.OnChatMsgChannel(frame,(text,playername)=>{
    console.log("Channel message: "+text);
});

// We can register multiple listeners to the same event.
Events.ChatInfo.OnChatMsgSay(frame,(text)=>{
  console.log("Event 2:"+text);
});
```

Internally, the Events interface uses `frame.SetScript('OnEvent',...)` to listen for events, meaning users **cannot** use both the Events API and manually apply an OnEvent listener to the same frame.

## XML
XML works more or less identical to how they work in normal addon development, but the way they call scripts is slightly different:

**addon/some-file.ts**
```ts
export function ExampleFunction() {
  console.log("Hello from ExampleFunction!");
}
```

**shared/some-shared-file.ts**
```ts
export function SharedFunction() {
  console.log("Hello from SharedFunction!");
}
```

**ui-file.xml**
```xml
<Ui xmlns="http://www.blizzard.com/wow/ui/"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://www.blizzard.com/wow/ui/ ..\FrameXML\UI.xsd">
   <Frame name="MyAddon_Frame">
      <Scripts>
      <!-- We must "require" the library file.   -->
      <!-- This does not work for functions in "modulename-addon.ts" -->
      <!-- This code itself is Lua, rather than TypeScript, even though it calls a TypeScript function. -->
      <OnLoad>
        require('addon.some-file').ExampleFunction()
        require('shared.some-shared-file').SharedFunction()
      </OnLoad>
      </Scripts>
   	  <Anchors>
    <Anchor point="CENTER"/>
  </Anchors>
   </Frame>
</Ui>
```

# Using Lua

Since [version 12](https://github.com/tswow/tswow/releases/tag/v0.12-beta), you can write lua directly in your addons.

## Lua Modules (Calling Typescript from Lua / Calling Lua from TypeScript)

Normally in WoW AddOns, a `.toc` file is used to specify what order lua files are loaded. AddOns written in TypeScript automatically generates this file, since they instead rely on es6-style imports just like a normal TypeScript project. 

With raw lua files, we can use a special boilerplate syntax to register modules that allow us to both export and import modules, just like we would in a TypeScript file: 

First, we create a simple TypeScript function:

_tsfile.ts:_
```ts
export function tsfunction() { console.log("Hello from tsfunction()"); } 
```

Then, we create a lua function that will call it. To call TypeScript from lua, we **must** set it up with the `tstl_register_module` boilerplate function.

_luafile.lua:_
```lua
-- This boilerplate function creates our module.
tstl_register_module(
    -- This is the name of our module. 
    -- This should always be on the form "TSAddons.my-module.addon.path.to.my.module" (don't forget the ".addon." part)
    "TSAddons.my-module.addon.luafile",
    function()
        local exports = {}
        -- Here, we can import a TypeScript module file and use its functions.
        -- Note how we must also prepend with "TSAddons.my-module.addon", just like when registering.
        -- (again, don't forget the ".addon." part)
        local tstest = require("TSAddons.my-module.addon.tsfile")
        function exports.luafunction()
            print("Hello from luafunction!")
            -- Call the tsfunction we defined in tsfile.ts above
            tstest.tsfunction()
        end
        return exports
    end
)
```

Now, we can create a definition file corresponding to the lua file we just created to be able to access its functions from TypeScript again:

_luafile.d.ts:_
```ts
export declare function luafunction();
```

_tsfile2.ts:_
```ts
import { luafunction } from "./luafile"

luafunction();

```

## Custom Load orders

As mentioned previously, when building TypeScript AddOns tswow automatically generates the .toc file to ensure all modules are included and always load before the modules entry point. 

Sometimes, we might not want to use the module syntax, or for some other reason specify that some lua files should be loaded before others. For this, we can use any of three special .toc files, placed in the addon root directory of our module (same as the entrypoint):

- `beforelib.toc`: Files listed here are loaded before even library modules and any other modules normal addon files.
- `before.toc`: Files listed here are loaded before any of the module files in this addon.
- `after.toc`: Files listed here are loaded after any of the module files in this addon.

If you wish to use any functions from files in `beforelib.toc` or `before.toc` in your TypeScript files, you can declare them in a `global.d.ts` placed in your modules addons folder.
