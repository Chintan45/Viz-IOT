import React, {useState,useEffect, useMemo} from 'react';
import './App.css';
import Boxplot from './boxplot';
import Violinplot from './violin_plot';
import * as d3 from 'd3';
import RadarChart from './RadarPlot';
import Select from 'react-select'

function App() {
  
  const attackOptions = [
    { value: 'DDoS', label: 'DDoS' },
    { value: 'SQL Injection', label: 'SQL Injection' },
    { value: 'Cross-Site Scripting (XSS)', label: 'Cross-Site Scripting (XSS)' },
  ];

  const [selectedAttacks, setSelectedAttacks] = useState([]);

  const handleAttackChange = (selectedOptions) => {
    setSelectedAttacks(selectedOptions);
  };

  //called to draw home screen
  function Home(){
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
                    <RadarChart />
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
        <Home />
      </div>
    </div>
  );
}


export default App;
