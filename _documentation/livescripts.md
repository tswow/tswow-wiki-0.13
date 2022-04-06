---
title: Live Scripts
---

_Note: As TSWoW develops, some caveats listed on this page might disappear._

Live Scripts are the server scripts of TSWoW, just like Eluna or C++ scripts in TrinityCore. They are written in TypeScript (transpiled to C++) or C++ and can be hotswapped directly into the server without restarting it.

## Building
To build livescripts, the `build scripts` command is used.

## Entry point

The main file for all live scripts in a module is `module-name/livescripts/livescripts.ts` (for C++, livescripts.h/livescripts.cpp). In this file, we define an entrypoint as such:

```ts
// "Main" is the entrypoint for tswow livescripts.
export function Main(events: TSEvents) {
    events.Player.OnSay((player,msg)=>{
        player.SendBroadcastMessage('You said: '+msg.get())
    });
}
```

## Lifetime

The `Main` function is called during server startup or when the script is reloaded. During reload, all previous event handlers are removed and any memory should be cleaned up automatically.

## Memory Management

Live scripts do their best to abstract away the manual memory management in C++ by using smart pointers and stack objects where possible. However, there are a few concerns you will have to consider.

### TS* callback arguments (TSPlayer, TSUnit, TSGroup etc.)

The types we receive from event callbacks are special pointer types. These should never be _stored_ anywhere in a live script, store their GUIDs instead (using `.GetGUID`). These types are owned by the server core, and there is no way to know if the memory they point at remain valid after the event has finished executing.

### Circular References

If two objects in TSWoW refer to each others and form a cycle, they will not be automatically cleaned up if all other references to them are lost, since C++ does not have a (built-in) garbage collector. If we use circular data types, we need to make sure that those cycles are broken when the data should be removed.

## TypeScript Syntax differences

Since livescripts written in TypeScript are transpiled to C++, they have a few caveats, but also a few improvements over normal TypeScript and JavaScript.

### Callback Functions

Callback functions are used either to register events to the `TSEvents`, or as callbacks to map/array higher order functions (filter, reduce, forEach etc.).

#### Variable Access
Asynchronoius callback functions cannot read or modify scoped/non-global variables, such as event handlers, timers or delayed events. Trying to do this should raise a compiler error.

Synchronous callbacks, such as arrays `map`/`filter`/`reduce`/`forEach`, can access their enclosing scope, but still not across asynchronous boundaries.

```ts
let globalVar: uint32 = 0;

export function Main(events: TSEvents) {
    let localVar: uint32 = 0;
    events.Player.OnSay(()=>{ // <-- asynchronous callback
        localVar = 10; // does not work
        if(localVar > 10) {} // does not work

        globalVar = 10; // works
        if(globalVar > 10) {} // works

        let cbVar: uint32 = 0;
        [].forEach(()=>{ // <-- synchronous callback
            cbVar = 10; // works
            if(cbVar > 10) {} // works

            globalVar = 10; // works
            if(globalVar > 10) {} // works
        })
    }
}
```

### Arrays

Arrays are created by specifying their type and then assigning normally:

```ts
const arr = [1,2,3]; // <-- works, but numbers assumed to be floats
const arr : TSArray<uint32> = []; // <-- works
const arr2 : TSArray<uint32> = [1,2,3]; // <-- works
```

#### Iteration

Looping with for...in or for...of is currently disabled, but you can still loop by index:

```ts
const arr : TSArray<uint32> = [1,2,3]

for(let value of arr) { } // <-- does not work (for .. of unsupported)
for(let value in arr) { } // <-- does not work (for .. in unsupported)

for(let i=0;i<arr.length;++i) { } // <-- works
arr.forEach((value,index)=>{}) // <-- works
```

#### Callback functions

A few callback functions have different arguments compared to normal TypeScript, which might show up incorrectly in the autocompletion examples. This section shows correct parameters of each such function.

```ts
const arr: TSArray<uint32> = [1,2,3];

arr.forEach((value,index)=>{});

arr.filter((value,index)=>true);

// it is recommended, but not required, to specify the output type for reduce
arr.reduce<uint32>((prev,value,index)=>prev+value,0);

// map **must** specify the output type explicity (<uint32> in this case)
arr.map<uint32>((x,i,arr)=>x+1)
```

### Dictionaries (maps)

Maps, or dictionaries, are collections that uniquely connects one value type to another. In TSWoW, we have decided to call these dictionaries to avoid confusing them with Maps in World of Warcraft.

Dictionaries are created with the special function `CreateDictionary`:

```ts
const myDictionary = { // <-- does not work (No call to CreateDictionary)
    1: "value"
}

const myDictionary : = CreateDictionary<uint64,string>({ // <-- works!
    1: "value1",
    8: "value8"
});

```

### Iteration

Maps can currently only be iterated using callback functions:

```ts
const myDict : TSDictionary<uint64,string> = MakeDictionary<uint64,string>({
    1: "value1",
    2: "value2"
});

for(const key in myDict){} // <-- does not work

myDict.reduce((prev,key,value)=>p+key,0); // <-- works
myDict.filter((key,value)=>true); // <-- works
myDict.forEach((key,value)=>{}); // <-- works
```

## Classes

Classes work mostly as usual. If a class does not extend anything else, they should extend `TSClass`:

```ts
class InnerClass extends TSClass {
    innerValue: int;

    constructor(innerValue: int) {
        super();
        this.innerValue = innerValue;
    }

}

class TestClass extends TSClass {
    a: int = 25;

    inner: InnerClass;

    constructor(innerValue: int) {
        super();
        this.inner = new InnerClass(innerValue);
    }
}

function Main(events: TSEventHandlers) {
    const cls = new TestClass(100);
    // We can print a class using its stringify method
    console.log(cls.stringify());
}
```

## IDs
Sometimes, it is necessary to reference ids generated from a datascript in a livescript. For this, there is a special function `GetID` that is resolved into a numeric ID at compile-time.

To find the the correct arguments for a datascript entity registered as `("my-mod","my-id")`, we can open the file `coredata/IDs.ts` and `CTRL+F` for `"my-mod","my-id"`, and then simply copy the line we find into our livescript.

**Important**: Some datascript entities automatically register multiple ids to a single input id pair, commonly with an index suffix (For example, `CreatureTemplate#Spawns#add`:
: [`("my-mod","my-spawn-1"),("my-mod","my-spawn-2")`]) or a subtype suffix (For example, `std.Mounts`: `[("my-mod","my-mount-spell"),("my-mod","my-mount-item")]`). Make sure that you grab the match you are looking for from `coredata/IDs.ts`.

## Timers
TSWoW supports a simple type of timer for delayed or repeated events. These timers can be applied to `TSWorldObjects` (which includes `TSUnits`, `TSCreatures`, `TSGameObjects` and `TSPlayers`) or `TSMaps`:

```ts
export function Main(events: TSEvents) {
    events.Player.OnSay((player)=>{
        // Timer on player
        player.AddTimer(1000,player=>{
            console.log(`[player]: One second passed`)
        })

        // Timer on map
        player.GetMap().AddTimer(1000,map=>{
            console.log(`[map]: One second passed`)
        })
    })
}
```

## Data tags
TSWoW can store temporary data on game entities such as `TSWorldObjects` (which includes `TSUnits`, `TSCreatures`, `TSGameObjects` and `TSPlayers`), `TSMaps` and `TSItems`. You can store either primitive values or entire custom classes:

### Primitives

We can store primitives directly on world objects using `SetNumber`/`SetString`/`SetBool`, and read them with `GetNumber`/`GetString`/`GetBool`

```ts
export function Main(events: TSEvents) {
    events.Player.OnSay((player)=>{
        player.SetNumber('my-number',10)
        player.SetString('my-string','hello world')
        player.SetBool('my-bool',true)
    })
}
```

### Custom Classes

We can also store entire custom data classes this way, suitable for more complex storage. Typically, we add it by attempting to read it and supplying a default second argument:

```ts
class MyClass extends TSClass {
    value: uint32 = 0;
}

export function Main(events: TSEvents) {
    events.Player.OnSay((player)=>{
        // Second parameter is default value added and returned
        // if we didn't already contain this object
        let cls = player.GetObject('my-object',new MyClass());
        console.log('Class value:'+cls.value++);
    });
}
```

## Persistent Data

Saving and loading data is done by writing queries to either the `Characters`, `Auth` or `World` databases. You almost always want to write live data to the `Characters` database only.

### SQL Commands

We can create SQL commands as such:

```ts
// There is also QueryAuth and QueryCharacters.
const res = QueryWorld('SELECT name FROM item_template WHERE entry=25;');

// Iterate on each row
while(res.GetRow()) {
    // Get the first captured value (we only specified one)
    console.log(res.GetString(0));
}
```

### ORM

TSWoW has support for automatic object-relational mapping (ORM) in livescripts. This means we can specify classes in TypeScript that are automatically translated to an SQL table that we can easily save objects to. Below is a simple example ORM class:

```ts
// A DBEntry is the simplest type of database class.
// It maps only to a single row in a database and can
// easily be attached to entities such as players.

// This class maps player IDs to a simple click counter

// @CharactersTable specifies that we want to save
// this table in the Characters database.
// (This is almost always what we want)
@CharactersTable
export class ORMDemoEntry extends DBEntry {
    constructor(player: uint64) {
        super();
        this.player = player
    }

    // A primary key is the variable that uniquely identifies
    // this row in the table. Since we are mapping players,
    // we use the player GUID here.
    @DBPrimaryKey
    player: uint64 = 0

    // The @Field decorator is used to specify other class
    // variables we want to store in the database
    @DBField
    clickCounter: uint32 = 0

    // If we don't specify the @Field decorator,
    // the value is not saved to the database.
    memoryValue: uint32 = 0;

    // Helper function to get and attach a database object
    // to a player.
    static get(player: TSPlayer): ORMDemoEntry {

        // This either returns a cached version of
        // the save data from the player object (from a previous call),
        // or if it isn't found, creates a new save object
        // and stores it on the player.
        return player.GetObject('ORMDemoEntry'

            // LoadDBEntry is the normal global function
            // we use to load DBEntry classes.
            , LoadDBEntry(new ORMDemoEntry(player.GetGUID()))
        )
    }

    static Save(player: TSPlayer) {
        ORMDemoEntry.get(player).Save();
    }

    static Delete(playerGuid: uint64) {
        LoadDBEntry(new ORMDemoEntry(playerGuid)).Delete()
    }

    static Reset(player: TSPlayer){
        ORMDemoEntry.get(player).clickCounter = 0
    }

    static Increase(player: TSPlayer) {
        ORMDemoEntry.get(player).clickCounter++;
    }
}
```

#### Field types

Only primitive types (ints, floats, strings) can be used as @Fields or @PrimaryKeys (strings can currently NOT be used as primary keys). The table below shows all valid field types:

| **Type** | **@DBField** | **@DBPrimaryKey** |
|----------|--------------|-------------------|
| string   | Yes          | Yes*              |
| float    | Yes          | **No**            |
| double   | Yes          | **No**            |
| int      | Yes          | Yes               |
| int8     | Yes          | Yes               |
| int16    | Yes          | Yes               |
| int32    | Yes          | Yes               |
| int64    | Yes          | Yes               |
| uint8    | Yes          | Yes               |
| uint16   | Yes          | Yes               |
| uint32   | Yes          | Yes               |
| uint64   | Yes          | Yes               |

*_strings must use @DBPrimaryKeyVarChar(charCount) to be primary keys_

## Using C++

LiveScripts can also be written in C++ directly, it is however considered a more advanced feature of TSWoW, and a few special functions (GetObject, AddTimer) have slightly different syntax when written in C++. ORM classes are not supported in C++ at all.

### Calling C++ from TypeScript

First, we create a header `raw-file.h`
```cpp
void cpp_function();
```

Then, a corresponding cpp `raw-file.cpp`
```cpp
#include <iostream>

void cpp_function()
{
    std::cout << "Hello world from C++!" << "\n";
}
```

Then, we'll need a type declaration file `raw-file.d.ts`
```ts
export declare function cpp_function(): void;
```

Finally, we can call this function from our main function (or any other TypeScript module).
```ts
import { cpp_function } from "./raw-file"

export function Main(events: TSEventHandlers) {
    // will print the hello world message when script is reloaded
    cpp_function();
}
```

_Note: The main file of a project must always be a TypeScript file_

### Calling TypeScript from C++

Create a typescript file `ts-file.ts`
```ts
export function ts_function() {
    console.log("Hello world from TypeScript!");
}
```

Then, from any c++ file as created above, simply do the following:

```cpp
#include "ts-file.h"
// (if the file was in a subdirectory, the include should instead be #include "subdir/ts-file.h")

void some_function()
{
    ts_function();
}
```

## Custom CMakeLists.txt

You can create a special `CMakeLists.txt` placed in your root livescripts directory to link external libraries. You do not need to set up the entire project in this file, it will be included after TSWoW has created a target named after your module (module named `module-a` has a target `module-a` ready when the file is loaded). Simply add any libraries or external headers to this file.

_Note: Do not place external library files into the livescripts directory, since TSWoW will think it should compile them as part of the script itself._

_Note: Remember that livescripts are completely unloaded from memory any time you rebuild them, but it's your responsibility to handle heap allocations_

## Passing arguments

Livescript TypeScript uses different conventions depending on what type it is, and may require including special headers. For example, user types are (currently) always wrapped in `std::shared_ptr` while `TS*` types are always sent as is. The `string` type is called `TSString` in C++.

To figure out how to accept an argument of a specific type, try writing a TypeScript function and look at the C++ the transpiler produces at `livescripts/build/cpp/livescripts`.
