---
title: Lua (Serverside)
---

_Serverside Lua is an upcoming feature for the 0.15 release of tswow_

**Note: This article is about serverside Lua, not client [AddOn](https://tswow.github.io/tswow-wiki/documentation/addons/) Lua.**

As an alternative to [livescripts](https://tswow.github.io/tswow-wiki/documentation/livescripts/), it is possible to script your server with almost identical syntax by instead targeting Lua by using tstl. There are both benefits and drawbacks to using Lua instead of livescripts:

**Benefits**
- Much shorter compilation time, allowing faster development with syntax almost identical to livescripts.
- More mature [transpiler](https://github.com/TypeScriptToLua/TypeScriptToLua)
- More forgiving syntax rules
- More forgiving to programming errors (crashes can still happen, but a lot of errors can be caught)
- Can be written in both typescript and lua directly.
- Allows more easily porting [Eluna](https://github.com/ElunaLuaEngine/Eluna) and [AIO](https://github.com/Rochet2/AIO.git) modules to TSWoW.

**Drawbacks**
- Lua itself is less performant than transpiling to C++
- Lua does not support multithreading, so enabling Lua seriously limits the performance of the entire server even if you don't use many events.

Lua is a great option for quickly prototyping ideas before porting them to livescripts, or if you only intend to run a smaller server with at most a couple of hundred players. For larger server projects, it is recommended to disable Lua in production so that you can get the full benefit of multithreaded map updates.

## Setup

To enable Lua, you need to make sure that your `worldserver.conf` contains a line `TSWoW.EnableLua = true`. Note that enabling this setting limits the map update thread count to 1, since Lua does not support multithreading.

To add a lua endpoint to your module, create a folder named "lua" inside your module. The basic project structure should be created automatically.

To build lua scripts and reload them on the server, use the command `build lua`.

## Lua Scripting

The lua scripting API is almost identical to [Livescripts](https://tswow.github.io/tswow-wiki/documentation/livescripts/), but there are a few differences.

_Note that most examples here are written in TypeScript. Lua scripts can be written in both Lua and TypeScript._

### TSEvents

In Lua, events are registered to `TEvents` as a static file rather than an object of type `TSEvents`. A simple message listener can be written like this:

```ts
TSEvents.Player.OnSay((player,msg)=>{
    player.SendBroadcastMessage(`You said ${msg}`)
})
```

Notice how there is no "Main" function in Lua. If you would like to simulate this behavior, you can use the following basic boilerplate anywhere in your scripts:

```ts
export function Main(events: TSEvents) {
    // Register scripts here
}
Main(TSEvents as any);
```

### Missing Features

Some things are not available in lua:

- ORM
- The old `GetID` macro (use ID tags instead, like TAG, UTAG and HAS_TAG)
