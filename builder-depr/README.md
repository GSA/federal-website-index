# Federal Website Index Builder

## Purpose

This directory contains a Python script (`main.py`) that automates the process
of building the federal website index.

## Dependencies

All dependencies are listed in `requirements.txt`.

## GitHub Action

`.github/workflows/build-list.yml` specifies the GitHub action for building the
federal website index.

## Running the Action

- In this repo, run the GitHub Action named 'Build Target URL List'. It snapshots the source data that it is using [here](https://github.com/GSA/federal-website-index/tree/main/data/snapshots), and overwrites the specified file [here](https://github.com/GSA/federal-website-index/tree/main/data).

## Snapshots

`main.py` contains the following configuration variables used to document snapshots of data handled during the building process:

- `GOV_SNAPSHOT_PATH`: the state of the federal URL list at the time of build
- `PULSE_SNAPSHOT_PATH`: the state of the pulse URL list at the time of build
- `DAP_SNAPSHOT_PATH`: the state of the DAP URL list at the time of build
- `COMBINED_SNAPSHOT_PATH`: the combined list of all URLs from the three lists above
- `DEDUPED_SNAPSHOT_PATH`: the deduped list
- `DEDUP_REMOVED_SNAPSHOT_PATH`: URLs removed during the deduplication process
- `REMOVE_IGNORE_BEGINS_PATH` and `REMOVE_IGNORE_CONTAINS_PATH`: the list after URLs containing strings specified in `INGORE_LIST_BEGINS_PATH` and `IGNORE_LIST_CONTAINS_PATH` are removed
- `INGORED_REMOVED_BEGINS_PATH` and `IGNORED_REMOVED_CONTAINS_PATH`: URLs removed during the prior step
- `NONFEDERAL_REMOVED_PATH`: URLs removed that are not federal URLs
