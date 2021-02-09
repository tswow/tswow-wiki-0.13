# Addons

TSWoW supports creating addons using the TypeScript programming language, and to write special message classes that allow high-level communication between addons and Live scripts.
When an addon is built, the code is transpiled into lua and automatically installed at the configured client path. The purpose of this document is to explain how addon development works
and the differences from normal addon development.

_Please note: The sources TSWoW has used to generate type definitions come from very poorly structured web pages and may not be entirely accurate. An exact specification of the Blizzard API for 3.3.5 is very hard to come by, so we appreciate reports on any inaccuracies._

## Files

A single module can contain at most a single addon, which is located at `modulename/addons`. Users can generate this directory using the command `addon create modulename`.
The entrypoint for all addons is the file `addons/modulename-addon.ts`, but users may create any other amount typescript files under this directory and import them as you normally would in TypeScript. 

Addons can also access files in the `modulename/shared` directory. Since the `shared` directory is also used by live scripts, the coding style here must be valid for both addons and live scripts.  

### Special Files

When an addon is generated, the following necessary files are automatically created in the new addons directory. Users should not remove these files.

- `modulename.toc`: Allows users to specify addon metadata. Do **not** add filenames to this file manually.
- `global.d.ts`: Contains type definitions for all Blizzard functions and types accessible from lua.
- `events.ts`: Contains TSWoWs custom addon event and communications systems.
- `modulename-addon.ts`: Is always the first real entrypoint of your addon. It is the only transpiled file that is automatically executed.
- `BinReader.ts`: Contains functions for writing binary data for client/server communications, mostly just used internally by .

#### The .toc File

When an addon is generated with the `addon create modulename` command, a file called `addons/modulename.toc` is generated with it. Here, users can configure the following fields:

- Interface Version (Should always be 30300, do not change!)
- Title (Displayed name of the addon)
- Version
- Notes (Longer description when the addon is hovered on the Addon screen
- Author

Nothing else should be manually entered into this file. Filenames will be automatically added when the addon is built.

## TypeScript

TypeScript files are used just like lua files are in normal addon development, with the exception that it's only `addons/modulename-addon.ts` that is automatically executed.
For any other file to be executed, it must be imported by this file or any file that is itself imported.  

The type declarations allow users to write code that's usually very similar to the way normal lua addon development works:

```ts
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

Internally, the Events interface uses `frame.SetScript('OnEvent',...)` to listen for events, meaning users cannot use both the Events API and manually apply an OnEvent listener to the same frame.

### Client/Server communication

TSWoW has support for a simple client/server communication system with custom data types that both addons and live scripts can access. 
The `shared` directory in modules can be accessed by both live scripts and addons, which can be used to store "Message classes".

#### Example
This section will demonstrate a basic addon/server communication system.

**shared/ExampleMessage.ts**
```ts

// Declares this class can be sent between an addon and a live script.
@Message
export class ExampleMessage {
  // Without a decorator, this field will be ignored during transmission.
  transient: uint32 = 80;

  // Declares this field is a primitive that should be serialized
  @MsgPrimitive 
  field: uint32 = 25;
  
  // Declares this field is a primitive array with at most 3 entries
  @MsgPrimitiveArray(3) 
  array: TSArray<uint32> = [1,2,3,4] // This is valid, but the fourth entry will be ignored when this message is serialized.
  
  // Declares this field is a string with at most 5 characters
  @MsgString(5) 
  str: string = "abcdefg" // Also valid, but only 5 characters will be transmitted.
  
  // Declares this field is a string array of at most 2 entries with at most 3 characters each.
  @MsgStringArray(2,3)
  stringArr: TSArray<string> = ["abcd","aaaa",""]
}

@Message
export class WrapperMessage {
  // Messages can contain other message classes
  @MsgClass
  inner: ExampleMessage = new ExampleMessage(); // Inner message classes should always be initialized.
  
  // Declares this field is an array of at most 2 inner classes
  @MsgClassArray(2)
  innerArray: TSArray<ExampleMessage> = [new ExampleMessage(), new ExampleMessage(), new ExampleMessage()];
}
```

**addon/modulename-addon.ts**
```ts
import { ExampleMessage } from "../shared/ExampleMessage";

const frame = CreateFrame('Frame','UniqueName');

// Registers a listener for "ExampleMessage" packets
Events.AddOns.OnMessage(frame,ExampleMessage,(msg)=>{
    console.log("Addon received an ExampleMessage from the server!");
    // Sends back a new message to the server
    SendToServer(new ExampleMessage());
});
```

**scripts/modulename_scripts.ts**
```ts
import { ExampleMessage } from "../shared/Data";

export function Main(events: TSEventHandlers) {
    // Use a basic OnSay event to trigger the transmission
    events.Player.OnSay((player,type,lang,msg)=>{
      // Sends an example message that will fire the event in the addon.
      player.SendData(new ExampleMessage());
    });

    // Wait for clients to send this message back
    events.Addon.OnMessageID(MessageClass,(player,msg)=>{
        player.SendBroadcastMessage("Server received an ExampleMessage from the client!");
        
    });    
}
```

### Notes
- When changing anything about message classes, you must both `build addon && build scripts` for changes to apply both on the server and the client.
- When a message class is compiled, a special opcode is automatically generated and stored in `config/ids.txt`.
- Received data may be malicious or corrupt, but is harmless on its own and protected from buffer overflows.
- Players can still very easily forge any valid message, so remember to never trust data sent from players as authoritative
- All messages have a fixed size, and arrays will be automatically padded to fill the expected size. If the server receives any message that does not match the expected size exactly, the message will be discarded.
- The maximum size of a single message is ~180 bytes, and the compiler will give an error if you try to exceed this. 
- String values received may not be valid strings, even in non-malicious packets (multi-byte characters etc).

## XML
XML works more or less identical to how they work in normal addon development, but the way they call scripts is slightly different:

**some-file.ts**
```ts
export function ExampleFunction() {
  console.log("Hello from ExampleFunction!");
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
      <OnLoad>require('some-file').ExampleFunction()</OnLoad>
      </Scripts>
   	  <Anchors>
    <Anchor point="CENTER"/>
  </Anchors>
   </Frame>
</Ui>
```
