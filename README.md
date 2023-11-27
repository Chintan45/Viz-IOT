# Viz IoT: Visualizing IoT Attack Trends ([&#128279;](attacks-on-iot.netlify.app/))

![React](https://img.shields.io/badge/React-v18.2.0-blue?logo=react) ![D3](https://img.shields.io/badge/D3.js-v7.8.5-orange?logo=d3.js)

## Overview
This project aims to analyze trends between different types of attacks and their effects on IoT (Internet of Things) devices, considering their specializations and causes. The system provides a suite of interactive and filterable visual components built using **`React.js`** and **`D3.js`** libraries.

## Interface Description
The interface has five essential visual components:

1. **Radar Chart**: Illustrates attribute contributions across various attacks using min-max scaling. Users can hover over points to access original attribute values.

2. **Attack Duration Distribution**: Demonstrates the pace of different attack types within a system. Users can filter out unwanted attacks for detailed comparative analysis.

3. **Payload Size Scatter Plot**: Depicts total payload size over time for each attack type. Equipped with tooltips, it offers insights into payload sizes at specific durations during an attack.

4. **Network Graph**: Represents attack similarities, with nodes representing individual attack types and edges depicting similarity levels. Darker shades signify higher similarity.

5. **Dynamic Line Graph**: Presents trends in header length across various attacks over regular durations. It dynamically scales axes based on attack selection.

## Technologies Used
- React.js
- D3.js


## Usage
1. Clone the repository and move to directory.
    ```
    git clone git@github.com:Chintan45/Viz-IOT.git
    cd Viz-IOT
    ```
2. Install dependencies using 
    ```
    npm install
    ```
3. Run the application using 
    ```
    npm run start
    ```
4. Access the application through URL
    ```
    http://localhost:3000/
    ```

#### Credits
1. [Chintan Dobariya](https://github.com/Chintan45)
2. [Arka Pal](https://github.com/ArkaPal-uic)
3. [Sudhanshu Basu Roy](https://github.com/parading-purple-drumhead)
4. [Andrew Wentzel](https://github.com/tehwentzel)