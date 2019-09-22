import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-68627421-1');

import App from './Main';
import Histogram from './Histogram';
import Top100 from './Top100';

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

// Render the main component into the dom

ReactDOM.render((
  <Router history={browserHistory} onUpdate={logPageView}>
    <Route component={App}>
      <Route path="/" component={Histogram}/>
      <Route path="player/:type/:team/:id/:year" component={Histogram}/>
      <Route path="top" component={Top100}/>
      <Route path="*" component={Histogram}/>
    </Route>
  </Router>
), document.getElementById('app'));
