import Dispatcher from '../dispatcher/AppDispatcher';
import {RECEIVE_PLAYER_DETAILS,RESET_PLAYER_DETAILS, CLEAR_PLAYER_DETAILS} from '../constants/ActionTypes';
import {EventEmitter} from 'events';
import assign from 'object-assign';

var CHANGE_EVENT = 'change',
    _details = {};

function setDetails(details,playerObject,panelID) {
  _details[panelID] = {
    details: details,
    playerObject: playerObject
  };
}

function clearDetails(panelID) {
  delete _details[panelID]
}

function resetDetails () {
  _details = {};
}

function parseResponse(response) {
  return response;
}

var DetailStore = assign({}, EventEmitter.prototype, {

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getDetails: function (panelID) {
    return _details.hasOwnProperty(panelID) ? _details[panelID] : {details: null, playerObject: null};
  }
});

DetailStore.dispatchToken = Dispatcher.register(function (payload) {
  var action = payload.actionType;
  var response = payload.response;
  var panelID = payload.panelID;
  var playerObject = payload.playerObject;

  switch (action) {
    case RECEIVE_PLAYER_DETAILS:
      setDetails(parseResponse(response),playerObject,panelID);
      break;
    case CLEAR_PLAYER_DETAILS:
      clearDetails(panelID);
      break;
    case RESET_PLAYER_DETAILS:
      resetDetails();
      break;
    default:
      return true;
  }
  
  DetailStore.emitChange();

  return true;
});

export default DetailStore