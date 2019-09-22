import util from '../helpers/util';
import React from 'react';

import Navbar from 'react-bootstrap/lib/Navbar';

import {Link} from 'react-router';


class HeaderComponent extends React.Component {
  constructor(props) {
    super(props);
    util._bind(this, 'updateView', 'onChange');
    this.state = {
    }
  }

  updateView(value) {
    this.setState({
      currentView: value
    })
  }

  onChange(value,e,tab) {
    this.updateView(value)
  }

  render() {
    return (
      <Navbar fixedTop fluid={true}>
          <Navbar.Header>
            <Navbar.Brand>
              YPC Graph
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Text>
          <Link className="navbar-link" activeClassName="active" to="/">Histogram</Link>
          </Navbar.Text>
          <Navbar.Text>
          <Link className="navbar-link" activeClassName="active" to="/top">Top 100</Link>
          </Navbar.Text>
      </Navbar>
    );
  }
}

HeaderComponent.defaultProps = {
};

export default HeaderComponent;
