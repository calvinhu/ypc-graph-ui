require('styles/main.scss');

import util from '../helpers/util';
import Api from '../helpers/api';
import React from 'react';
import ReactDOM from 'react-dom';
import ActionCreator from '../actions/ActionCreator';
import Button from 'react-bootstrap/lib/Button';
import Header from './Header';
import Panel from './Panel';
import {API_ROOT} from '../constants/Endpoints';


class HistogramComponent extends React.Component {
  constructor(props) {
    super(props);
    util._bind(this, 'addPanel', 'resetDetails', 'setLoadingStatus');
    this.state = {
      panelCount: 1,
      loading: false
    }
  }

  componentDidMount() {
    if (this.props.params.id) {
      var playerObject = {
        "type": this.props.params.type,
        "playerID": this.props.params.id,
        "playerTeam": this.props.params.team,
        "year": this.props.params.year
      }
      this.setLoadingStatus(true);
      var url = API_ROOT+'api/v0/player_name/' + this.props.params.id;
      Api
        .get(url)
        .then(response => {
          playerObject["playerName"] = response.result;
          ActionCreator.getDetails(playerObject,0);
        });
    } else {
      this.resetDetails()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.route.path == "/") {
      this.resetDetails()
    }
  }

  resetDetails() {
    ActionCreator.resetAll();
    this.setState({
      panelCount: 1
    })
  }

  setLoadingStatus(status) {
    this.setState({
      loading: status
    })
  }

  addPanel() {
    this.setState({
      panelCount: this.state.panelCount + 1
    })
  }

  render() {
    return (
      <div className="container">
        {this.state.loading ? <div className='overlay'><div className='spinner'></div></div> : null }
        {[...Array(this.state.panelCount).keys()].map((x, i) =>
          <Panel key={i} id={i} setLoadingStatus={this.setLoadingStatus} />
        )}
        <Button bsSize="xsmall" bsStyle="primary" onClick={this.addPanel}>Add another graph</Button>
        {
          this.state.panelCount >= 1 &&
          <Button bsSize="xsmall" className="pull-right" bsStyle="danger" onClick={this.resetDetails}>Reset All</Button>
        }
        <div className="intro">
          <h2>Yards per Carry Histogram</h2>
          <h3>View a histogram of an NFL player's yards per attempt over the course of a season. To use, simply select a player from the dropdown list in the top right.</h3>

          <p>A histogram shows the frequency of the outcome of an event. In this case, the events are everytime a running back touches the ball, and the outcomes are how many yards he gains or loses. This will hopefully provide more insight to the Yards per Carry statistic, which I feel is too vague, as it's an average over an entire season.</p>

          <h3>Features:</h3>
          <ul>
            <li>Select from the top 100 players for each season and get a breakdown of their running and receiving plays.</li>
            <li>Add additional graphs to compare multiple players. Very useful in comparing two running backs on the same team.</li>
            <li>In addition to running backs, there are receiving statistics as well. Just select "Receive" from the dropdown above.</li>
            <li>Automatically updates throughout the season.</li>
          </ul>

        </div>
      </div>
    );
  }
}

HistogramComponent.defaultProps = {
};

export default HistogramComponent;
