import util from '../helpers/util';
import {PASS,RUSH,INCOMPLETE} from '../constants/StatCategories';
import React from 'react';

import {BootstrapTable, TableHeaderColumn, TableDataSet} from 'react-bootstrap-table';

function weekSort(a,b,order) {
  if (order == 'desc') {
    return a['id'] > b['id'] ? -1 : ((a['id'] < b['id']) ? 1 : 0);
  } else {
    return a['id'] < b['id'] ? -1 : ((a['id'] > b['id']) ? 1 : 0);
  }
}

function yardsFormatter(cell,row) {
  if (row.type == INCOMPLETE) {
    return ''
  } else {
    return cell
  }
}

function descriptionFormatter(cell,row) {
  var re = /^\(.*?\)/;
  return cell.replace(re,'')
}

function assignColor(rowData,rowIndex) {
  var color;
  if (parseInt(rowData.yards) < 0) {
    color = 'danger';
  } else if (rowData.type === RUSH) {
    color = 'info';
  } else if (rowData.type === PASS) {
    color = 'success';
  } else if (rowData.type === INCOMPLETE) {
    color = 'active';
  } else {
    color = 'default'
  }
  return color;
}

class PlaysTableComponent extends React.Component {

  constructor(props) {
    super(props);
    util._bind(this, 'makeConfig', 'updateTable');
    this.state = {
    }
  }

  makeConfig(response) {
    var result = response.result;
    result.map((item,index) => {
      item['id'] = index
    });
    return result;
  }

  componentDidMount() {
    setTimeout(()=> {this.refs.table._adjustHeaderWidth()}, 500);
  }

  updateTable(data) {
    this.setState({
    }, () => {
    });
  }



  render() {
    

    return (
      <div className="playsContainer">
        <BootstrapTable
          ref="table"
          data={this.makeConfig(this.props.response)}
          columnFilter={false}
          bordered={false}
          condensed={true}
          height="400px"
          className="playsTable"
          trClassName={assignColor}
        >
          <TableHeaderColumn
            dataField="id"
            isKey={true}
            hidden={true}
            columnClassName=""
            className=""
          >ID</TableHeaderColumn>
          <TableHeaderColumn
            dataField="week"
            dataSort={true}
            sortFunc={weekSort}
            columnClassName="column number weekDescription"
            className="column number weekDescription"
          >Week</TableHeaderColumn>
          <TableHeaderColumn
            dataField="game"
            columnClassName="column gameDescription"
            className="column gameDescription"
          >Game</TableHeaderColumn>
          <TableHeaderColumn
            dataField="time"
            columnClassName="column timeDescription"
            className="column timeDescription"
          >Time</TableHeaderColumn>
          <TableHeaderColumn
            dataField="type"
            columnClassName="column typeDescription"
            className="column typeDescription"
          >Type</TableHeaderColumn>
          <TableHeaderColumn
            dataField="yards"
            dataSort={true}
            dataFormat={yardsFormatter}
            columnClassName="column number typeDescription"
            className="column number typeDescription"
          >Yards</TableHeaderColumn>
          <TableHeaderColumn
            dataField="desc"
            columnClassName="column playDescription"
            className="column playDescription"
            dataFormat={descriptionFormatter}
          >Description</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}


PlaysTableComponent.propTypes = {
};
PlaysTableComponent.defaultProps = {
  response: null
};



export default PlaysTableComponent;
