import React, {useState,useEffect, useMemo} from 'react';
import './App.css';
// import Whitehat from './Whitehat';
// import WhiteHatStats from './WhiteHatStats'
// import WhitehatBlank from './WhitehatBlank';
// import Blackhat from './Blackhat';
// import BlackHatStats from './BlackHatStats';
import Boxplot from './boxplot';
import Violinplot from './violin_plot';
import * as d3 from 'd3';
import RadarChart from './RadarPlot';


function App() {

  //state deciding if we are looking at the blackhat or whitehat visualization
  const [viewToggle, setViewToggle] = useState('whitehat');
 
  //called to draw the whitehat visualization
  function makeWhiteHat(){
    
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

  
  // //toggle which visualization we're looking at based on the "viewToggle" state
  const hat = ()=>{
    if(viewToggle === 'whitehat'){
      return makeWhiteHat();
    }
  }

  return (
    <div className="App">
      <div className={'header'}
        style={{'height':'2em','width':'100vw'}}
      >
        <button 
         onClick={() => setViewToggle('whitehat')}
         className={viewToggle === 'whitehat'? 'inactiveButton':'activeButton'}
         >{"White Hat"}
        </button>
        <button 
         onClick={() => setViewToggle('blackhat')}
         className={viewToggle === 'blackhat'? 'inactiveButton':'activeButton'}
         >{"Black Hat"}
        </button>
      </div>
      <div className={'body'} 
        style={{'height':'calc(100vh - 2.5em)','width':'100vw'}}
        >
        {hat()}
      </div>
    </div>
  );
}


export default App;
