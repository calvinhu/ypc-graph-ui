import util from '../helpers/util';
import {PASS,RUSH,INCOMPLETE} from '../constants/StatCategories';
import {RUSHING,RECEIVING} from '../constants/StatCategories';
import {CURRENT_YEAR} from '../constants/CurrentYear';
import React from 'react';
import ActionCreator from '../actions/ActionCreator';
import TopStore from '../stores/TopStore';
import DetailStore from '../stores/DetailStore';

import {BootstrapTable, TableHeaderColumn, TableDataSet} from 'react-bootstrap-table';
import {browserHistory} from 'react-router';

function descriptionFormatter(cell,row) {
  var re = /^\(.*?\)/;
  return cell.replace(re,'')
}

class Top100Component extends React.Component {

  constructor(props) {
    super(props);
    util._bind(this, '_onChange', '_onFormChange', '_onRowClick');
    this.state = {
      year: CURRENT_YEAR.toString(),
      loading: true,
      rushingList: [],
      receivingList: []
    }
  }

  componentWillMount() {
    TopStore.addChangeListener(this._onChange);
  }

  componentDidMount() {
    ActionCreator.getTopPlayers(this.state.year);
  }

  componentWillUnmount() {
    TopStore.removeChangeListener(this._onChange);
  }

  _onFormChange(event) {
    this.setState({
      year: event.target.value,
      loading: true
    },
      () => {
        ActionCreator.getTopPlayers(this.state.year);
      });
  }

  _onChange() {
    var newDetails = TopStore.getPlayerLists()
    this.setState({
      rushingList: newDetails.rushing,
      receivingList: newDetails.receiving,
      loading: false
    },
      () => {
      });
  }

  _onRowClick(row, event) {
    var year = this.state.year
    var type = 'rushing_yds' in row ? RUSHING : RECEIVING
    var playerID = row.id
    var playerName = row.name
    var playerTeam = row.team
    // /player/:type/:team/:id/:year
    var url = `/player/${type}/${playerTeam}/${playerID}/${year}`
    browserHistory.push(url)
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="pull-right">
            <select className="form-control"
              style={{minWidth: '100px'}}
              defaultValue={this.state.year}
              onChange={this._onFormChange}>
              <option value="2018">2018</option>
              <option value="2017">2017</option>
              <option value="2016">2016</option>
              <option value="2015">2015</option>
              <option value="2014">2014</option>
              <option value="2013">2013</option>
              <option value="2012">2012</option>
            </select>
          </div>
        </div>
        <div className="two-table-container">
          <div className="table-container">
            <h3>Top Rushers</h3>
            <BootstrapTable
              data={this.state.rushingList}
              columnFilter={false}
              options={{
                onRowClick: this._onRowClick,
                sortIndicator: false,
                defaultSortName: "rushing_yds"
              }}
              bordered={false}
              condensed={true}
              striped={true}
              trClassName="playerRow"
            >
              <TableHeaderColumn
                dataField="id"
                isKey={true}
                hidden={true}
                columnClassName=""
                className=""
              >id</TableHeaderColumn>
              <TableHeaderColumn
                dataField="name"
                columnClassName="name"
                className="name"
              >Name</TableHeaderColumn>
              <TableHeaderColumn
                dataField="team"
                columnClassName=""
                className=""
              >Team</TableHeaderColumn>
              <TableHeaderColumn
                dataField="rushing_yds"
                dataSort={true}
                columnClassName="number"
                className="number"
              >Yds</TableHeaderColumn>
              <TableHeaderColumn
                dataField="rushing_att"
                dataSort={true}
                columnClassName="number"
                className="number"
              >Carries</TableHeaderColumn>
              <TableHeaderColumn
                dataField="ypc"
                dataSort={true}
                columnClassName="number"
                className="number"
              >YPC</TableHeaderColumn>
              <TableHeaderColumn
                dataField="rushing_tds"
                dataSort={true}
                columnClassName="number"
                className="number"
              >TDs</TableHeaderColumn>

            </BootstrapTable>
          </div>
          <div className="table-container">
            <h3>Top Receivers</h3>
            <BootstrapTable
              data={this.state.receivingList}
              columnFilter={false}
              options={{
                onRowClick: this._onRowClick,
                sortIndicator: false,
                defaultSortName: "receiving_yds"
              }}
              bordered={false}
              condensed={true}
              striped={true}
              trClassName="playerRow"
            >
              <TableHeaderColumn
                dataField="id"
                isKey={true}
                hidden={true}
                columnClassName=""
                className=""
              >id</TableHeaderColumn>
              <TableHeaderColumn
                dataField="name"
                columnClassName="name"
                className="name"
              >Name</TableHeaderColumn>
              <TableHeaderColumn
                dataField="team"
                columnClassName=""
                className=""
              >Team</TableHeaderColumn>
              <TableHeaderColumn
                dataField="receiving_yds"
                dataSort={true}
                columnClassName="number"
                className="number"
              >Yds</TableHeaderColumn>
              <TableHeaderColumn
                dataField="receiving_rec"
                dataSort={true}
                columnClassName="number"
                className="number"
              >Recs</TableHeaderColumn>
              <TableHeaderColumn
                dataField="ypr"
                dataSort={true}
                columnClassName="number"
                className="number"
              >YPR</TableHeaderColumn>
              <TableHeaderColumn
                dataField="receiving_tds"
                dataSort={true}
                columnClassName="number"
                className="number"
              >TDs</TableHeaderColumn>

            </BootstrapTable>
          </div>
        </div>
      </div>
    );
  }
}


Top100Component.propTypes = {
};
Top100Component.defaultProps = {
  response: null
};



export default Top100Component;
