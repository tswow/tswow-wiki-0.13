# Dangers

This file should attempt to list all the dangerous things users and developers should avoid before they happen. 
See the [troubleshooting document](Troubleshooting.md) for how to fix errors once they appear.

### Do not parallelize data/live/addon builds

They all read the same `ids.txt` and will overwrite each others data. This needs to be fixed before these steps can be parallelized.
