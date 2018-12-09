import Dispatcher from '../dispatcher/AppDispatcher';
import {RECEIVE_PLAYER_LIST, RESET_PLAYER, RECEIVE_WEEKS} from '../constants/ActionTypes';
import {EventEmitter} from 'events';
import assign from 'object-assign';

var CHANGE_EVENT = 'change',
    playerHash = {},
    weekHash = {};

function setPlayerList (panelID,list) {
  playerHash[panelID] = list;
}

function setWeekList (panelID,weeks) {
  weekHash[panelID] = weeks;
}

function reset() {
  playerHash = {};
  weekHash = {};
}

function parseResponse(players) {
  function groupBy(array, predicate) {
    var grouped = {};
    for(var i = 0; i < array.length; i++) {
      var groupKey = predicate(array[i]);
      if (typeof(grouped[groupKey]) === 'undefined')
        grouped[groupKey] = [];
      grouped[groupKey].push(array[i]);
    }
    return grouped;
  }

  function objToList(inputObject) {
    var result = []
    for(var key in inputObject) {
      if(inputObject.hasOwnProperty(key)) {
        result.push({team:key, players:inputObject[key]})
      }
    }
    return result;
  }

  function compareTeamName(a,b) {
    if (a.team < b.team)
      return -1;
    else if (a.team > b.team)
      return 1;
    else
      return 0;
  }

  var groupedPlayers = objToList(groupBy(players,
    (obj) => {
      return obj.team;
    }
  )).sort(compareTeamName);
  return groupedPlayers;
}

var PlayerStore = assign({}, EventEmitter.prototype, {

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getPlayerList: function (panelID) {
    return {
      players: playerHash.hasOwnProperty(panelID) ? playerHash[panelID] : [],
      weeks: weekHash.hasOwnProperty(panelID) ? weekHash[panelID] : []
    };
  }
});

PlayerStore.dispatchToken = Dispatcher.register(function (payload) {
  var action = payload.actionType;
  switch (action) {
    case RECEIVE_PLAYER_LIST:
      var panelID = payload.panelID;
      var players = payload.players;
      setPlayerList(panelID,parseResponse(players));
      break;
    case RESET_PLAYER:
      reset();
      break;
    case RECEIVE_WEEKS:
      var panelID = payload.panelID;
      var weeks = payload.weeks;
      setWeekList(panelID,weeks);
      break;
    default:
      return true;
  }

  PlayerStore.emitChange();

  return true;
});

export default PlayerStore