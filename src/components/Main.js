require('styles/main.scss');

import util from '../helpers/util';
import React from 'react';

import Header from './Header';
import Histogram from './Histogram';


class AppComponent extends React.Component {

  render() {
    return (
      <div id="container" className="container">
        <Header />
        {this.props.children}
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
