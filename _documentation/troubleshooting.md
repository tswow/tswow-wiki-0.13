---
title: Troubleshooting
---

The purpose of this document is to be an extensive resource for troubleshooting common issues with TSWoW. Try `ctrl+f` on this page for any problems you may have.

## Most Common Problems

This section lists the most common problems with TSWoW that almost everyone gets sometimes. 

### Broken file handles

**Problem**: EPERM errors, anything just not working for unknown reasons  

- **Possible solution 1**: If you just ran a build script, run it again at least once.  

- **Possible solution 2**: Restart the entire VSCode/VSCodium process.  

- **Possible solution 3**: In extreme circumstances, restarting your computer or manually closing broken node.exe processes may be necessary. In 3 months of heavy development,   this happened exactly once.  

### Cannot import tswow-stdlib
**Problem**: The editor or your scripts complain that they cannot find `tswow-stdlib`  

- **Possible solution 1**: If the problem is in the editor, press F1, then type in and select `Restart TS Server`  

- **Possible solution 2**: If the problem is when building scripts (or the above did not work): Run the tswow command `clean scripts`.  

### "Your database structure is not up to date"
**Problem**: Your worldserver crashes with "your database structure is not up to date"  

- **Possible solution 1**: If using the ORM system: Double check the name of parameters to your `LoadRows` function, they have to exactly match the fields in your ORM class.  

- **Possible solution 2**: Try rebuilding your databases, or manually remove `coredata/mysql` and `coredata/mysql_plain`.  

## Cleaning and Reinstalling

Sometimes, the easiest way to get a broken component working in TSWoW is to just reinstall or force rebuild that component. 
This section will describe the various component you may wish to delete (or keep) and the consequences for doing so. 

### Restarting

There are generally 3 main processes we may wish to restart in TSWoW: The VSCodium editor, the server (worldserver) and TSWoW itself.

- `VSCodium`: Just shut down the editor entirely. If TSWoW was running in it, it should be automatically closed by this.

- `Worldserver`: Type `ws start`. This shuts down the current worldserver if it's running, and starts a new one.

- `TSWoW`: Press ctrl+c into the terminal running tswow. Sometimes, this doesn't work because tswow is waiting for a process that cannot be stopped. 

You can force shutdown the entire terminal, but this may cause stray processes that you need to shut down manually.


### Backing up files

This section list files you may wish to copy over if you're setting up a fresh installation of TSWoW.

- `coredata/maps`, `coredata/vmaps`, `coredata/mmaps`, `coredata/dbc_source`, `coredata/luaxml_source`: Contains files built from the client. They take a long time to generate, so you can copy them over to save time.

- `coredata/mysql` and `coredata/mysql_plain`: Contains all databases that TSWoW uses. Do **not** back these up while tswow is running, or you will run a very high risk of corrupting them. 

- `config`: Contains all configuration and generated ID files.

- `modules`: Contains all your installed modules. It's preferrable to back these up using git, and if you're going to move them manually, make sure to delete `modules/modulename/data/build` and `modules/modulename/scripts/build`.

## Startup Issues

This section lists commonly known startup issues and how to (usually) fix them.

### Missing Map Files
Problem: `Map file xxx doesn't exist!`  

- <span>**Possible Solution 1**: Delete `coredata/maps`, `coredata/vmaps`, `coredata/mmaps` and `coredata/dbc_source`, then restart tswow. _Explanation: Usually, this means the tswow process was stopped while it was extracting client files. 
TSWoW will only check if those directories exist at all to decide if it should generate them, and not if they were fully populated._</span>

### Worldserver crashes at "Loading Player Create Level HP/Mana Data..."
Problem: The worldserver crashes, and the last message in `coredata/Server.log` is that it's "Loading Player Create Level HP/Mana data..."

- **Possible Solution 1**: Run `build data`
_Explanation: This sometimes happens after updating TSWoW and you have created any custom classes._


### MySQL problems
**Problem**: MySQL errors during startup

- **Possible solution 1**: Change the MySQL port in `config/tswow.yaml` (e.g. to something like 3310, 3311, 3312)  
_Explanation: If you have another MySQL server running on the default port, you need to configure TSWoW to use a different port._

- **Possible solution 2**: Make sure the root user account is called "root"  
_Explanation: This is a bug in tswow we just haven't fixed yet. The root user account must be named "root"._

**Warning: Applying this solution WILL wipe clean ALL your tswow databases**  

- <span>**Possible solution 3**: Back up and/or delete `coredata/mysql` and `coredata/mysql_plain` _Explanation: Sometimes, the MySQL data directory becomes corrupt because of how aggressively TSWoW can shut it down during development._ </span>

### Data Script problems

**Problem**: Client crashes on character creation screen  

- **Possible solution 1**: Back up and remove `config/ids.txt`. (Optionally, manually delete any missing class-related entries from it)  
_Explanation: This often happens if you create a custom class, then delete it or change its registry name. This causes a gap in the present class ids, which is not permitted in the character creation screen._

- **Unfixable**: You have defined over 100 class/race pairs, including the ones from the base game.  
_Explanation: TODO but tldr it seems to be a programming error when defining 100+ rows in CharBaseInfo.dbc AND at least one row references a custom class._

### Update Issues
**Problem**: Errors after updating tswow from an `update.7z`

- **Possible solution 1**: Manually apply the update. Delete the `bin` directory in your tswow installation folder, and then manually extract the `bin` directory from the 7z file you downloaded.  
_Explanation: Sometimes, updating fails or is interrupted._

- **Possible solution 2**: Run `clean datascripts` from inside tswow.  
_Explanation: Updating tswow may rarely break some data script dependencies, running this script attempts to fix all those._

**Warning: Applying this solution WILL wipe clean ALL your tswow databases**

- **Possible solution 3**: <span>Delete/backup `coredata/mysql` and `coredata/mysql_plain`, then restart tswow.  
_Explanation: When tswow updates, it will rebuild the world database. If this process is interrupted or fails, you might end up with a corrupt world database._</span>

### Live Script problems

### Can't import data scripts from live scripts

- **Problem**: Trying to import data scripts from live scripts gives compiler errors

- **Unfixable**: You should not import data scripts from live scripts. If you need IDs you have created, you can use the auto-generated `scripts/IDs.ts` file as long as you register entities with the same `modid` as the name of your mod.

#### Ids not showing up in `IDs.ts`
**Problem:** Ids registered by data scripts doesn't show up in `IDs.ts` in the live scripting folder.

- **Possible solution 1**: Make sure you executed data scripts with the ID at least once.

- **Possible solution 2**: Make sure your `modid` is the same as the name of your module.  
_Explanation: For now, only your own mods entries are added to `IDs.ts`. This will likely change in the future._

#### Strange compiler errors

**Problem**: Code that should be valid gives compiler errors.

- **Possible solution 1:** Check our [Live Scripting documentation](LiveScripts.md)  
_Explanation: Not all valid TypeScript is valid for Live Scripts, since it's transpiled from TypeScript to C++._

- **Possible solution 2**: [Check in with us on discord](https://discord.gg/M89n6TZh9x)  
_Explanation: We may have missed something in our documentation, so it's good to tell us if you've found something that **should** work._

- **Possible solution 3**: Check the transpiled C++ in the `modules/mymodule/scripts/build` directory. If you understand C++, this may explain why what you're trying to do won't work.

### Assets problems

### Addon problems
**Problem**: Addon events not working, or addon messages not received by the client

- <span>**Possible solution 1:** Make sure you create the frame with a **unique** name: `const frame = CreateFrame('Frame','SomeGloballyUniqueName');`.</span>


#### Textures not showing in-game

**Problem**: Textures in `assets` are not visible in the game.

- **Possible solution 1**: Convert your textures using the `assets blp` command, then run `build data` again.  
_Explanation: WoW doesn't use png files, so you need to convert them to blp first for them to work._

- **Possible solution 2**: If you're replacing existing textures, double-check the path name against the blizzard path using something like [mpqeditor](http://www.zezula.net/en/mpq/download.html).  
_Explanation: This is the issue 99% of the time where solution 1 doesn't apply._

- **Possible solution 3**: Double-check the MPQ folder in your client to verify the texture has been successfully moved after a build.  
_Explanation: Very rarely asset files may fail to copy to the client directory. If you find this is the case, please report it to us._
