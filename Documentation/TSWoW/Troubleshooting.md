# Troubleshooting

The purpose of this document is to be an extensive resource for troubleshooting common issues with TSWoW. 

## Most Common Problems

This section lists the most common problems with TSWoW that almost everyone gets sometimes. 

- A lot of problems with TSWoW are related to **file handles** and the VSCodium/VSCode editor. These are almost always fixed by either:
  - Re-running a build script if that caused it.
  - Restart the entire VSCode/VSCodium process. 
  - In extreme circumstances, restarting your computer or manually closing broken node.exe processes may be necessary. In 3 months of heavy development, this happened exactly once.
  
- Scripts and/or the editor can't import `tswow-stdlib`
  - In the editor: Press F1 -> Type in and select `Restart TS Sserver` 
  - When building scripts: Use the tswow command `clean scripts`.

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
Possible Solution 1: Delete `coredata/maps`, `coredata/vmaps`, `coredata/mmaps` and `coredata/dbc_source`, then restart tswow.  
_Explanation: Usually, this means the tswow process was stopped while it was extracting client files. 
TSWoW will only check if those directories exist at all to decide if it should generate them, and not if they were fully populated._

### MySQL problems
**Problem**: MySQL errors during startup

**Possible solution 1**: Change the MySQL port in `config/tswow.yaml` (e.g. to something like 3310, 3311, 3312)  
_Explanation: If you have another MySQL server running on the default port, you need to configure TSWoW to use a different port._

**Possible solution 2**: Make sure the root user account is called "root"  
_Explanation: This is a bug in tswow we just haven't fixed yet. The root user account must be named "root"._

**Warning: Applying this solution WILL wipe clean ALL your tswow databases**  
**Possible solution 3**: Back up and/or delete `coredata/mysql` and `coredata/mysql_plain`  
_Explanation: Sometimes, the MySQL data directory becomes corrupt because of how aggressively TSWoW can shut it down during development._

### Data Script problems

**Problem**: Client crashes on character creation screen

**Possible solution 1**: Back up and remove `config/ids.txt`. (Optionally, manually delete any missing class-related entries from it)
_Explanation: This often happens if you create a custom class, then delete it or change its registry name. This causes a gap in the present class ids, which is not permitted in the character creation screen._

**Unfixable**: You have defined over 100 class/race pairs, including the ones from the base game.
_Explanation: TODO but tldr it seems to be a programming error when defining 100+ rows in CharBaseInfo.dbc AND at least one row references a custom class._
