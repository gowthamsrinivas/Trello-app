import React from 'react';
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import App from  './App.js';
const Router = () => (
<BrowserRouter>
<div>
  {/* <Navigation /> */}
  <Switch>
 <Route path="/" component={App}/>
  </Switch>
</div>

</BrowserRouter>

); 

export default Router;