# Federal Website Index Builder
## Overview
The Federal Website Index Builder is a component of the GSA Federal Website Index project. Its primary function is to compile and maintain an up-to-date list of public U.S. federal government websites, predominantly those with .gov domains. This index serves as a foundational resource for the Site Scanning program, enabling automated scans of federal websites to assess their health and adherence to best practices.

## Purpose
Given the vast number of agencies and subcomponents within the U.S. federal government, maintaining a comprehensive and accurate directory of public websites is challenging. The builder automates the aggregation, deduplication, and validation of various datasets to produce a reliable index of federal websites.

## Key Features
- **Data Aggregation:** Combines multiple datasets to identify active federal websites.
- **Deduplication:** Removes redundant entries to ensure a unique list of websites.
- **Validation:** Ensures that websites conform to expected patterns and are publicly accessible.
- **Automation:** Runs weekly to provide an up-to-date index every Wednesday at 6 PM ET.

## Methodology
The builder processes several datasets to generate the Federal Website Index:
- **Federal .Gov Domains List:** A comprehensive list of all registered .gov domains.
- **Digital Analytics Program (DAP) Websites:** Websites that participate in the DAP.
- **Pulse.cio.gov Snapshot:** A snapshot of federal websites from pulse.cio.gov.
- **Other .Gov Websites:** Additional sources of federal .gov websites.
- **OMB Bureau/Agency Codes:** Codes that associate websites with specific agencies and bureaus.

### The process involves:

1. Downloading and combining the datasets.

2. Removing entries with certain patterns (e.g., admin. or staging.) that typically indicate non-public websites.

3. Assigning each website to an agency and bureau using the federal .gov domains list.

4. Matching and adding agency and bureau codes using the OMB list.

5. Filtering out websites that do not have a base domain listed in the federal .gov domains list.

## Usage
To utilize the builder:
1. Install [Bun](https://bun.sh/) if not already installed:
    ```bash
    curl -fsSL https://bun.sh/install | bash
    ```
    Then follow the instructions to add Bun to your shell profile and restart your terminal.

2. Clone the repository:
    ```bash
    git clone https://github.com/GSA/federal-website-index.git
    cd federal-website-index/builder
    ```

3. Move into builder directory:
    ```bash
    cd builder
    ```

4. Install dependencies:
    ```bash
    bun install
    ```
  
4. Run the application:
    ```bash
    bun run src/main.ts
    ```