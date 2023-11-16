import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import Boxplot from "./boxplot";
import Violinplot from "./violin_plot";
import * as d3 from "d3";
import RadarChart from "./RadarPlot";
import Select from "react-select";
import ScatterPlot from "./ScatterPlot";

function App() {
  const attackOptions = [
    { value: "BenignTraffic", label: "Benign Traffic" },
    { value: "MITM-ArpSpoofing", label: "MITM ARP Spoofing" },
    { value: "DDoS-ICMP_Fragmentation", label: "DDoS ICMP Fragmentation" },
    { value: "Recon-OSScan", label: "Recon OS Scan" },
    { value: "DNS_Spoofing", label: "DNS Spoofing" },
    // { value: "VulnerabilityScan", label: "Vulnerability Scan" },
    { value: "Mirai-udpplain", label: "Mirai UDP Plain" }
  ];

  const [selectedAttacks, setSelectedAttacks] = useState([]);

  const handleAttackChange = (selectedOptions) => {
    setSelectedAttacks(selectedOptions);
  };

  //called to draw home screen
  function Home({ selectedAttacks }) {
    return (
      <>
        <div
          style={{
            width: "calc(100% - 2em)",
            height: "calc(100% - 2em)",
            display: "flex",
            flexDirection: "column",
            marginLeft: "1.5em",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "calc(100% - 2em)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "calc(100% - 25em)",
                border: "1px solid black",
              }}
            >
              <RadarChart selectedAttacks={selectedAttacks} />
            </div>
            <div
              style={{
                height: "100%",
                width: "calc(100% - 25em)",
                border: "1px solid black",
              }}
            >
              <Violinplot selectedAttacks={selectedAttacks} />
            </div>

            <div
              style={{
                height: "100%",
                width: "calc(100% - 25em)",
                border: "1px solid black",
              }}
            >
              <ScatterPlot selectedAttacks={selectedAttacks} />{" "}
            </div>
          </div>
          <div
            style={{
              height: "100%",
              width: "calc(100% - 2em)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "calc(100% - 25em)",
                border: "1px solid black",
              }}
            >
              <Boxplot selectedAttacks={selectedAttacks} />
            </div>
            <div
              style={{
                height: "100%",
                width: "calc(100% - 25em)",
                border: "1px solid black",
              }}
            >
              {" "}
            </div>
            <div
              style={{
                height: "100%",
                width: "calc(100% - 25em)",
                border: "1px solid black",
              }}
            ></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="App">
      <div
        className={"body"}
        style={{ height: "calc(100vh - 2.5em)", width: "100vw" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ width: "60%" }}>
            <Select
              isMulti
              options={attackOptions}
              onChange={handleAttackChange}
              value={selectedAttacks}
              styles={{ width: "50%" }}
            />
          </div>
        </div>
        <Home
          selectedAttacks={[...selectedAttacks.map((attack) => attack.value)]}
        />
      </div>
    </div>
  );
}

export default App;
