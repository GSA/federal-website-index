# Federal Website Index Builder

## Purpose

This directory contains a Python script (`__main__.py`) that automates the process
of building the federal website index.

## Configuration

`config.py` contains the following configuration variables:

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

* In this repo, run the GitHub Action named 'Build Target URL List'.  It snapshots the source data that it is using [here](https://github.com/GSA/federal-website-index/tree/main/data/snapshots), and overwrites the specified file [here](https://github.com/GSA/federal-website-index/tree/main/data).   
