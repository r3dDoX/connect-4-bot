const getColumn = require('./gameLogic').getColumn;

var request = require('request');
const HOST = 'http://localhost:8080';
//const HOST = 'https://connect-four-challenge.herokuapp.com';

const playerId = process.argv[2] || '4winz';
const timeout = 50;

function pollJoinGame() {
  return new Promise((resolve, reject) => {
    function requestJoin() {
      request.post(
        `${HOST}/api/v1/players/join`,
        { json: { playerId } },
        (error, response, body) => {
          if (error) {
            reject(error);
          } else if (body.gameId) {
            resolve(body);
          } else {
            setTimeout(requestJoin, timeout);
          }
        }
      );
    }

    requestJoin();
  })
}

function pollShouldPlay(gameId) {
  return new Promise((resolve) => {
    function requestGameState() {
      request.get(`${HOST}/api/v1/players/games/${gameId}`,
        (error, response, body) => {
          const parsedBody = JSON.parse(body);

          if (parsedBody.currentPlayerId === playerId || parsedBody.finished) {
            resolve(parsedBody);
          } else {
            setTimeout(requestGameState, timeout);
          }
        });
    }

    requestGameState();
  });
}

function dropDisc(gameId, column) {
  return new Promise((resolve) => {
    request
      .post(
        `${HOST}/api/v1/players/games/${gameId}`,
        { json: { playerId, column } },
        (serverResponse) => resolve(JSON.parse(serverResponse))
      );
  })
}

function makeMoveWhenReady(gameId) {
  return pollShouldPlay(gameId)
    .then((serverResponse) => {
      if (serverResponse.finished) return 'finished';
      console.log('making move');

      const { disc } = serverResponse.players.find(player => player.playerId === playerId);
      const { board } = serverResponse;

      return dropDisc(gameId, getColumn(board, disc))
        .then(() => {
          return makeMoveWhenReady(gameId);
        });
    });
}

function playGame() {
  return pollJoinGame()
    .then(({ gameId }) => {
      console.log(`joining game: ${gameId}`);
      return makeMoveWhenReady(gameId);
    });
}

playGame()
  .then(playGame)
  .then(playGame)
  .then(playGame)
  .then(playGame)
  .then(playGame)
  .then(playGame)
  .then(playGame)
  .then(playGame)
  .then(playGame)
  .then(() => {
    console.log('finished');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
