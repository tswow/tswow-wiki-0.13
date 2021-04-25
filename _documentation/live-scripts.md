---
title: Live Scripts
---

_Note: As TSWoW develops, some caveats listed on this page might disappear._

Live Scripts are the server scripts of TSWoW, just like Eluna or C++ scripts in TrinityCore. They are written in TypeScript, and then transpiled to C++ code that can be hotswapped directly into the server without restarting it.

## Entry point

The main file for all live scripts in a module is `module-name/scripts/module_name_scripts.ts`. In this file, we define an entry-point as such:

```ts
export function Main(events: TSEventHandlers) {
    events.Player.OnSay((player,type,lang,msg)=>{
        player.SendBroadcastMessage('You said'+msg.get())
    });
}
```

TSEventHandlers can then be accessed inside that function to register event handlers. We can also send it on to functions in other files if we want to spread out our module, but you should not store it to access it from within any event callbacks.

## Lifetime 
 
The `Main` function is called during server startup or when the script is reloaded. During reload, all previous event handlers are removed and any memory should be cleaned up automatically.

## Memory Management

Live scripts do their best to abstract away the manual memory management in C++ by using smart pointers and stack objects where possible. However, there are a few concerns you will have to consider.

### TS* callback arguments (TSPlayer, TSUnit, TSGroup etc.)

The types we receive from event callbacks are special pointer types. These should never be _stored_ anywhere in a live script, store their GUIDs instead (using `.GetGUID`). These types are owned by the server core, and there is no way to know if the memory they point at remain valid after the event has finished executing.

### Circular References

If two objects in TSWoW refer to each others and form a cycle, they will not be automatically cleaned up if all other references to them are lost, since C++ does not have a (built-in) garbage collector. If we use circular data types, we need to make sure that those cycles are broken when the data should be removed.

## Syntax differences

Since live scripts are transpiled to C++, they have a few caveats, but also a few improvements over normal TypeScript and JavaScript. This section should document all such caveats or changes that we can identify.

### Callback Functions

Callback functions are used either to register events to the `TSEventsHandlers`, or as callbacks to map/array higher order functions (filter, reduce, forEach etc.). 


#### Variable Access
Currently, callback functions can **not** modify scoped/non-global variables. This will likely change so forEach/reduce/filter can access its enclosing scope, but not for event listeners.

```ts
let globalCtr: uint32 = 0;

export function Main(events: TSEventHandlers) {
    let localCtr: uint32 = 0;

    let localArr: TSArray<uint32> = [1,2,3];
    localArr.forEach((k,v)=>{
        
    });

    events.Player.OnSay((player,type,lang,msg)=>{
        if(localCtr>10) {} // <-- does not work, will never work
        if(globalCtr>10) {} // <-- works!

        let innerCtr: uint32 = 0;
        let arr : TSArray<uint32> = [1,2,3];
        arr.forEach((v,i)=>{
            if(localCtr>10) {} // <-- does not work, will never work
            if(innerCtr>10) {} // <-- does not work, will likely add support later 
            if(globalCtr>10) {} // <-- works!
        });
    }
}

```

#### Callback Parameters

In normal TypeScript, we are allowed to ommit unused parameters from the right. This is not permitted in live scripts:

```ts
events.Player.OnSay((player)=>{ // <-- Will NOT work (missing paremeters)
});

events.Players.OnSay((player,type,lag,msg)=>{ // <-- works! 
});
```

### Arrays

Arrays are created by specifying their type and then assigning normally:

```ts
const arr = [1,2,3]; // <-- does not work!
const arr : TSArray<uint32> = []; // <-- works!
const arr2 : TSArray<uint32> = [1,2,3]; // <-- works!
```

#### Iteration

Looping with for...in or for...of is currently disabled, but you can still loop by index:

```ts
const arr : TSArray<uint32> = [1,2,3]

for(let value of arr) { } // <-- does not work (for .. of unsupported)
for(let value in arr) { } // <-- does not work (for .. in unsupported)

for(let i=0;i<arr.length;++i) { } // <-- works!
arr.forEach((value,index)=>{}) // <-- works!
```

#### Callback functions

A few callback functions have different arguments compared to vanilla TypeScript, which might show up incorrectly in the autocompletion examples. This section shows correct parameters of each such function.

```ts
const arr: TSArray<uint32> = [1,2,3];

// forEach
arr.forEach((value,index)=>{});

// filter
arr.filter((value,index)=>true);

// reduce
arr.reduce((prev,value,index)=>prev+value,0);
```

"Map" is not supported as it is hard to get working in C++. Instead of map, we can iterate by index:

```ts
const arr: TSArray<uint32> = [1,2,3];

const target: TSArray<uint32> = [];
for(let i=0;i<arr.length;++i) {
    target.push(arr[i]*2);
}
```

### Maps/Dictionaries

Maps are created with the special function `MakeDictionary`:

```ts
const myDictionary = { // <-- does not work (No call to MakeDictionary)
    1: "value"
}

const myDictionary : TSDictionary<uint64,string> = MakeDictionary<uint64,string>({ // <-- works!
    1: "value1",
    8: "value8"
});

```

### Access

Just like arrays, maps are accessed with get/set methods instead of []:

```ts
const myDictionary : TSDictionary<uint64,string> = MakeDictionary<uint64,string>({
    1: "value1",
    8: "value8"
});

myDictionary[3] = "value3"
console.log(myDictionary[8]);
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

## Saving/Loading

Saving and loading data is done by writing queries to either the `Characters`, `Auth` or `World` databases. Unless we are modifying existing values or under special circumstances, the standard is to use the `Characters` database for live data.

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

TSWoW has support for automatic object-relational mapping in live scripts. This means we can specify classes in TypeScript that are then automatically translated to an SQL table that we can easily save objects to. This example illustrates basic usage of an ORM class:

```ts
// Specifies the data table is in the characters database
@CharactersTable  
class PlayerCounter extends DBTable { // <-- Gives us save/delete methods

    // Specifies this field is part of this rows unique identifier ("Primary Key")
    @PrimaryKey
    playerId: uint64 = 0;

    // We can have multiple primary keys.
    @PrimaryKey
    sample: uint8 = 0;

    // Specified this field should be saved to the database, but is not a primary key.
    @Field 
    counter: uint32 = 0;

    // This field is not saved to the database.
    temp: uint8 = 0;

    constructor(playerId: uint64, counter: uint32) {
        super();
        this.playerId = playerId;
        this.counter = counter;
    }
}

export function Main(events: TSEventHandlers) {
    events.Player.OnSay((player,type,lang,msg)=>{
        // Load all rows matching this query (SQL 'where' clause)
        let rows = LoadRows(PlayerCounter,`playerId = ${player.GetGUID()}`);

        // Select first row or create a new one
        let row = rows.length > 0 ? rows.get(0) : new PlayerCounter(player.GetGUID(),0);

        // Update the counter
        row.counter++;

        // Save the row back to the database
        row.save();
    });
}
```

#### Field types

Only primitive types (ints, floats, strings) can be used as @Fields or @PrimaryKeys (strings can currently NOT be used as primary keys). The table below shows all valid field types:

| **Type** | **@Field** | **@PrimaryKey** |
|----------|------------|-----------------|
| string   | Yes        | **No**          |
| float    | Yes        | **No**          |
| double   | Yes        | **No**          |
| int      | Yes        | Yes             |
| int8     | Yes        | Yes             |
| int16    | Yes        | Yes             |
| int32    | Yes        | Yes             |
| int64    | Yes        | Yes             |
| uint8    | Yes        | Yes             |
| uint16   | Yes        | Yes             |
| uint32   | Yes        | Yes             |
| uint64   | Yes        | Yes             |
