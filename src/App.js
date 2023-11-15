import React, {useState,useEffect, useMemo} from 'react';
import './App.css';
import Boxplot from './boxplot';
import Violinplot from './violin_plot';
import * as d3 from 'd3';
import RadarChart from './RadarPlot';
import Select from 'react-select'

function App() {
  
  const attackOptions = [
    { value: 'DDoS-SynonymousIP_Flood', label: 'DDoS Synonymous IP Flood' },
    { value: 'DoS-TCP_Flood', label: 'DoS TCP Flood' },
    { value: 'DDoS-RSTFINFlood', label: 'DDoS RST FIN Flood' },
    { value: 'DDoS-ICMP_Flood', label: 'DDoS ICMP Flood' },
    { value: 'Mirai-udpplain', label: 'Mirai UDP Plain' },
    { value: 'DDoS-SYN_Flood', label: 'DDoS SYN Flood' },
    { value: 'DDoS-TCP_Flood', label: 'DDoS TCP Flood' },
    { value: 'DDoS-PSHACK_Flood', label: 'DDoS PSH ACK Flood' },
    { value: 'Mirai-greeth_flood', label: 'Mirai Greeth Flood' },
    { value: 'Recon-HostDiscovery', label: 'Recon Host Discovery' },
    { value: 'DDoS-UDP_Flood', label: 'DDoS UDP Flood' },
    { value: 'BenignTraffic', label: 'Benign Traffic' },
    { value: 'MITM-ArpSpoofing', label: 'MITM ARP Spoofing' },
    { value: 'DoS-UDP_Flood', label: 'DoS UDP Flood' },
    { value: 'DDoS-UDP_Fragmentation', label: 'DDoS UDP Fragmentation' },
    { value: 'DoS-HTTP_Flood', label: 'DoS HTTP Flood' },
    { value: 'DoS-SYN_Flood', label: 'DoS SYN Flood' },
    { value: 'DDoS-ICMP_Fragmentation', label: 'DDoS ICMP Fragmentation' },
    { value: 'Recon-OSScan', label: 'Recon OS Scan' },
    { value: 'DNS_Spoofing', label: 'DNS Spoofing' },
    { value: 'DDoS-ACK_Fragmentation', label: 'DDoS ACK Fragmentation' },
    { value: 'Mirai-greip_flood', label: 'Mirai Gre IP Flood' },
    { value: 'Recon-PortScan', label: 'Recon Port Scan' },
    { value: 'VulnerabilityScan', label: 'Vulnerability Scan' },
    { value: 'DDoS-HTTP_Flood', label: 'DDoS HTTP Flood' },
    { value: 'XSS', label: 'Cross-Site Scripting (XSS)' },
    { value: 'DDoS-SlowLoris', label: 'DDoS SlowLoris' },
    { value: 'CommandInjection', label: 'Command Injection' },
    { value: 'Recon-PingSweep', label: 'Recon Ping Sweep' },
    { value: 'BrowserHijacking', label: 'Browser Hijacking' },
    { value: 'DictionaryBruteForce', label: 'Dictionary Brute Force' },
    { value: 'SqlInjection', label: 'SQL Injection' },
    { value: 'Uploading_Attack', label: 'Uploading Attack' },
    { value: 'Backdoor_Malware', label: 'Backdoor Malware' },
  ];

  const [selectedAttacks, setSelectedAttacks] = useState([]);

  const handleAttackChange = (selectedOptions) => {
    setSelectedAttacks(selectedOptions);
  };

  //called to draw home screen
  function Home({selectedAttacks}){
        return (
          <>
            <div style={{'width':'calc(100% - 2em)','height':'calc(100% - 2em)','display':'flex', 'flexDirection': 'column', 'marginLeft': '1.5em'}}>
              <div style={{'height': '100%','width':'calc(100% - 2em)', 'display':'flex', 'justifyContent':'space-between'}}>
                  <div style={{ 'height': '100%', 'width':'calc(100% - 25em)', 'border':'1px solid black'}}>
                    <Boxplot />
                  </div>
                  <div style={{ 'height': '100%', 'width':'calc(100% - 25em)', 'border':'1px solid black'}}> 
                    <Violinplot />
                  </div>
                    
                  <div style={{ 'height': '100%', 'width':'calc(100% - 25em)', 'border':'1px solid black'}}> </div>
              </div>
              <div style={{'height': '100%','width':'calc(100% - 2em)', 'display':'flex', 'justifyContent':'space-between'}}>
                  <div style={{ 'height': '100%', 'width':'calc(100% - 25em)', 'border':'1px solid black'}}>
                    <RadarChart
                      selectedAttacks = {selectedAttacks}
                    />
                  </div>
                  <div style={{ 'height': '100%', 'width':'calc(100% - 25em)', 'border':'1px solid black'}}> </div>
                  <div style={{ 'height': '100%', 'width':'calc(100% - 25em)', 'border':'1px solid black'}}> </div>
              </div>
            </div>
          </>
        )
      }

  return (
    <div className="App">
      <div className={'body'} style={{'height':'calc(100vh - 2.5em)','width':'100vw'}}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '30%'}}> 
            <Select 
              isMulti
              options={attackOptions}
              onChange={handleAttackChange}
              value={selectedAttacks}
              styles={{ width: '50%'}}
            />
          </div>
        </div>
        <Home
          selectedAttacks={[...selectedAttacks.map(attack => attack.value)]}
        />
      </div>
    </div>
  );
}


export default App;
