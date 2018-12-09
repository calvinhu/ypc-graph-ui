import Api from '../helpers/api';
import Dispatcher from '../dispatcher/AppDispatcher';
import {RECEIVE_PLAYER_LIST,RECEIVE_PLAYER_DETAILS,RESET_PLAYER_DETAILS,CLEAR_PLAYER_DETAILS,RECEIVE_TOP_PLAYERS, RESET_PLAYER,RECEIVE_WEEKS} from '../constants/ActionTypes';
import {CURRENT_YEAR} from '../constants/CurrentYear';
import {API_ROOT, FIREBASE_ROOT} from '../constants/Endpoints';

var ActionCreator = {
  getPlayerList: function (panelID,year,type) {
    var URL;
    if (year == CURRENT_YEAR) {
      URL = FIREBASE_ROOT + type + '.json';
    } else {
      URL = API_ROOT + 'api/v0/data/' + year + '/' + type + '.json'
    }

    Api
      .get(URL)
      .then(function (response) {
        // Dispatch an action containing the categories.
        Dispatcher.dispatch({
          actionType: RECEIVE_PLAYER_LIST,
          panelID: panelID,
          players: response.result
        });
      })
  },

  getWeeks: function (panelID,year) {
    if (year !== CURRENT_YEAR.toString()) {
      Dispatcher.dispatch({
          actionType: RECEIVE_WEEKS,
          panelID: panelID,
          weeks: [...Array(17)].map((_,i) => i+1)
        });
    } else {
      Api
      .get(API_ROOT + 'api/v0/weeks/' + year)
      .then(function (response) {
        // Dispatch an action containing the categories.
        Dispatcher.dispatch({
          actionType: RECEIVE_WEEKS,
          panelID: panelID,
          weeks: response.result
        });
      })
    }
  },

  getDetails: function (playerObject,panelID) {
    let url;
    if (playerObject.week) {
      url = API_ROOT + 'api/v0/' + playerObject.type + 'yards/' + playerObject.playerID + '/' + playerObject.playerTeam + '/' + playerObject.year + '/' + playerObject.week;
    } else {
      url = API_ROOT + 'api/v0/' + playerObject.type + 'yards/' + playerObject.playerID + '/' + playerObject.playerTeam + '/' + playerObject.year;
    }
    Api
      .get(url)
      .then(function (response) {
        // Dispatch an action containing the categories.
        Dispatcher.dispatch({
          actionType: RECEIVE_PLAYER_DETAILS,
          panelID: panelID,
          response: response,
          playerObject: playerObject
        });
      })
  },

  clearDetails: function (panelID) {
    Dispatcher.dispatch({
      actionType: CLEAR_PLAYER_DETAILS,
      panelID: panelID
    });
  },

  resetAll: function () {
    Dispatcher.dispatch({
      actionType: RESET_PLAYER_DETAILS,
    });
  },

  getTopPlayers: function (year) {
    var RUSHING_URL, RECEIVING_URL;
    if (year === CURRENT_YEAR.toString()) {
      RUSHING_URL = FIREBASE_ROOT + 'rushing' + '.json';
      RECEIVING_URL = FIREBASE_ROOT + 'receiving' + '.json';
    } else {
      RUSHING_URL = API_ROOT + 'api/v0/data/' + year + '/' + 'rushing' + '.json'
      RECEIVING_URL = API_ROOT + 'api/v0/data/' + year + '/' + 'receiving' + '.json'
    }

    Api
      .get(RUSHING_URL)
      .then(function (response) {
        Dispatcher.dispatch({
          actionType: RECEIVE_TOP_PLAYERS,
          list: response.result,
          type: 'rushing'
        });
      });
    Api
      .get(RECEIVING_URL)
      .then(function (response) {
        Dispatcher.dispatch({
          actionType: RECEIVE_TOP_PLAYERS,
          list: response.result,
          type: 'receiving'
        });
      })
  }
};

export default ActionCreator