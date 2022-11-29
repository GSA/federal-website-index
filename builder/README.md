# Federal Website Index Builder

## Purpose

This directory contains a Python script (`__main__.py`) that automates the process
of building the federal website index.

## Configuration

`config.py` contains the following configuration variables used during the building process:

- `gov_source_url`: the URL hosting the [list of Federal .Gov Domains](https://github.com/GSA/federal-website-index/blob/main/source-data/dotgov-registry-federal.md)
- `pulse_source_url`: the URL hosting the [2020 pulse.cio.gov Snapshot](https://github.com/GSA/federal-website-index/blob/main/source-data/pulse-snapshot.md)
- `dap_source_url`: the URL hosting the [list of Websites That Participate In The Digital Analytics Program](https://github.com/GSA/federal-website-index/blob/main/source-data/dap.md)
- `omb_source_url`: the URL hosting [OMB Bureau/Agency Codes](https://github.com/GSA/federal-website-index/blob/main/source-data/omb-codes.md)
- `additional_data_path`: a CSV file containing additional federal domains
- `ignore_list_path`: a CSV file listing terms to ignore in the URL datasets
- `todays_snapshot_path`: the directory for the current day's data snapshot
- `target_url_list_path`: the location of the built federal website index produced by `main.py`

## Dependencies

All dependencies are listed in `requirements.txt`.

## GitHub Action

`.github/workflows/build-list.yml` specifies the GitHub action for building the
federal website index.

## Running the Action

- In this repo, run the GitHub Action named 'Build Target URL List'. It snapshots the source data that it is using [here](https://github.com/GSA/federal-website-index/tree/main/data/snapshots), and overwrites the specified file [here](https://github.com/GSA/federal-website-index/tree/main/data).

## Snapshots

`config.py` contains the following configuration variables used to document snapshots of data handled during the building process:

- `gov_snapshot_path`: the state of the federal URL list at the time of build
- `pulse_snapshot_path`: the state of the pulse URL list at the time of build
- `dap_snapshot_path`: the state of the DAP URL list at the time of build
- `combined_snapshot_path`: the combined list of all URLs from the three lists above
- `deduped_snapshot_path`: the deduped list
- `dedup_removed`: URLs removed during the deduplication process
- `remove_ignore_path`: the list after URLs containing strings specified in `ignore-list-path` are removed
- `ignored_removed`: URLs removed due to `ignore-list-path`
- `nonfederal_removed`: URLs removed that do not contain `.gov`
