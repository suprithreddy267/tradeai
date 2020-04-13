import React from 'react';
import Tradeaisearch from './search'; 
import {BrowserRouter as Router,Route,Switch} from "react-router-dom";
import Header from './header';
import Hs from './Hs'
import Tables from './tt'
import Hscountry from './Hscountry';
import Country from './Country'
import Hscodename from './Hscodename'
function App(){
  return(
    <Router>
      <div>
        <Header/>
        <div style={{padding:75}}>
          <Tradeaisearch/>
        </div>
        <Switch>
        <Route exact path="/" component={Tables} />
        <Route exact path="/trade/:country/:hscode" component={Hscountry} />
        <Route exact path="/country/:country" component={Country}></Route>
        <Route exact path="/hscode/:hscode" component={Hscodename}></Route>
        
        </Switch>
      </div>
      
    </Router>

  )
}

export default App
