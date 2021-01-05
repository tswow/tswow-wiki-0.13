# Live Scripting

It is now time to discuss live scripting, the type of scripts that run directly on the server to modify its behavior in real-time. Live Scripting is generally considered more advanced than data scripting, however since it's mostly up to you as a scripter to decide yourself what they do, there will generally be a little less to explain about them. We encourage you to play around with them, crash the server a few times and get a hang of what you can and cannot do with them. Remember to let the autocompletion guide you, and you should easily find what you're looking for in most situations.

## Before we start

Make sure you have installed Visual Studio according to the [installation instructions](2_Installation.md). No further setup is required, and TSWoW comes bundled with all the other tools to compile your scripts.

## Our first Live Script

Live Scripts are stored in the `scripts` subdirectory of a module. There should always be a file named inside `modulename_scripts.ts`. Inside of this file, we always have the following function:

```ts
```

This function is the "main" entry point for all data scripts, and is called when the script is loaded (either when it's reloaded or when the server starts). All the code we write for the following sections should be entered into this main functions, or a function that it calls.

## Events

All live scripting is about subscribing to events. An event is something that happens on the server, such as a particular spell being cast, a player dying or a guild being formed. TSWoW comes with a predefined set of events that you can subscribe to, and they can all be easily found through the `TSEventHandler` struct that's passed to the Main function.

Let's create a very simple hello world application: When the player writes a chat message, we print out a message for them.

```ts
export function Main(events: TSEventHandlers) {
    events.Player.OnSay((player,msgType,lang,msg)=>{
        player.SendBroadcastMessage('Hello world!');
    });
}
```

To rebuild a live script, all we have to do is use the command `build scripts`, optionally followed by the name of a specific module we want to rebuild. As opposed to data scripts, we do not need to restart the server when we do, and we can even keep the client loaded. Try typing a message into the ingame chat, and you should receive the yellow message "Hello world!". In the [next tutorial](14_SpellCreature.md), we will look at how to create scripts for specific spells and creatures.