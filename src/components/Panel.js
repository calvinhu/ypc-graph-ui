import util from '../helpers/util';
import React from 'react';
import {browserHistory} from 'react-router';

import ActionCreator from '../actions/ActionCreator';
import DetailStore from '../stores/DetailStore';

import PlayerForm from './PlayerForm'
import Graph from './Graph'
import PlaysTable from './PlaysTable'
import StatTable from './StatTable'

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';

class PanelComponent extends React.Component {

  constructor(props) {
    super(props);
    util._bind(this, '_onFormChange', '_onChange', '_reset', '_toggleStats');
    this.state = {
      visibleStats: false,
      playerObject: null,
      playerDetails: null
    }
  }

  _reset() {
    ActionCreator.clearDetails(this.props.id);
    this.setState({
      playerObject: null,
      playerDetails: null
    });
  }

  _onFormChange(input) {
    this.setState({
      playerObject: input
    },
      () => {
        this.props.setLoadingStatus(true);
        ActionCreator.getDetails(this.state.playerObject,this.props.id);
      });
  }

  _toggleStats(event) {
    event.currentTarget.blur();
    this.setState({
      visibleStats: !this.state.visibleStats
    });
  }

  componentWillMount() {
    DetailStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    DetailStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    var newDetails = DetailStore.getDetails(this.props.id)

    var response = newDetails["details"];
    var playerObject = newDetails["playerObject"];

    this.props.setLoadingStatus(false);

    if (response === null) {
      this.setState({
        playerDetails: response,
        playerObject: null
      });
    } else {
      this.setState({
        playerDetails: response,
        playerObject: playerObject
      }, () => {
        var url = `/player/${playerObject.type}/${playerObject.playerTeam}/${playerObject.playerID}/${playerObject.year}`
        browserHistory.push(url)
      });
    }
  }

  render() {
    var graphWithData = this.state.playerDetails ? <Graph response={this.state.playerDetails} /> : null
    var statsWithData = this.state.playerDetails ? <StatTable response={this.state.playerDetails} type={this.state.playerObject.type}/> : null
    var playsWithData = this.state.playerDetails ? <PlaysTable response={this.state.playerDetails} /> : null
    return (
      <div className="panel-container">
        <Row>
          <Col sm={12}>
            <h3 className="player-name pull-left">{this.state.playerObject ? this.state.playerObject.playerName + ' (' + this.state.playerObject.playerTeam + ')' : ''}</h3>
            <PlayerForm ref="playerForm" updatePanel={this._onFormChange} panelID={this.props.id} players={this.state.players} playerObject={this.state.playerObject} />
          </Col>
        </Row>
        <Row >
          <Col sm={10} xs={12} xsOffset={0} smOffset={0} className="scrollable-container">
            {graphWithData}
          </Col>
          <Col sm={2} xs={8} xsOffset={2} smOffset={0} >
            {statsWithData}
          </Col>
        </Row>
        <Row>
          <Col sm={12} className="centered">
            {
              this.state.playerObject &&
              <Button bsSize="xsmall" className="centered" bsStyle="default" onClick={this._toggleStats}>
                {
                  this.state.visibleStats ? 'Hide Plays' : 'Show Plays'
                }
              </Button>
            }
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            {
              this.state.visibleStats && playsWithData
            }
          </Col>
        </Row>
      </div>
    );
  }
}

PanelComponent.propTypes = {
};
PanelComponent.defaultProps = {
};



export default PanelComponent;
