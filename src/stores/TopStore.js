import Dispatcher from '../dispatcher/AppDispatcher';
import {RECEIVE_TOP_PLAYERS} from '../constants/ActionTypes';
import {EventEmitter} from 'events';
import assign from 'object-assign';

var CHANGE_EVENT = 'change',
    _rushingList = [],
    _receivingList = [];

function setPlayerList (list,type) {
  if (type === 'rushing') {
    _rushingList = list.map(item => {
      item['ypc'] = parseFloat(parseFloat(item.rushing_yds / item.rushing_att).toFixed(1))
      return item;
    });
  } else {
    _receivingList = list.map(item => {
      item['ypr'] = parseFloat(parseFloat(item.receiving_yds / item.receiving_rec).toFixed(1))
      return item;
    });
  }
}

var TopStore = assign({}, EventEmitter.prototype, {

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getPlayerLists: function () {
    return {
      rushing: _rushingList,
      receiving: _receivingList
    };
  }
});

TopStore.dispatchToken = Dispatcher.register(function (payload) {
  var action = payload.actionType;
  var list = payload.list;
  var type = payload.type;

  switch (action) {
    case RECEIVE_TOP_PLAYERS:
      setPlayerList(list,type);
      break;

    default:
      return true;
  }
  
  TopStore.emitChange();

  return true;
});

export default TopStore