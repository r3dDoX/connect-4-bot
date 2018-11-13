const getColumn = require('./gameLogic').getColumn;

var request = require('request');

const playerId = '4winz';

function poll(gameId) {
  return new Promise((resolve) => {
    function requestGameState() {
      request.get(`http://localhost:8080/api/v1/players/games/${gameId}`,
        (error, response, body) => {
          const parsedBody = JSON.parse(body);

          if (parsedBody.currentPlayerId === playerId) {
            resolve(parsedBody);
          } else {
            setTimeout(requestGameState, 250);
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
        `http://localhost:8080/api/v1/players/games/${gameId}`,
        { json: { playerId, column } },
        (serverResponse) => resolve(JSON.parse(serverResponse))
      );
  })
}

function makeMoveWhenReady(gameId) {
  return poll(gameId)
    .then((serverResponse) => {
      if (serverResponse.finished) resolve('finished');

      const { disc } = serverResponse.players.find(player => player.playerId === playerId);
      const { board } = serverResponse;

      return dropDisc(gameId, getColumn(board, disc))
        .then(() => {
          return makeMoveWhenReady(gameId);
        });
    });
}

request.post(
  'http://localhost:8080/api/v1/players/join',
  { json: { playerId } },
  function (error, response, body) {
    if (error) console.error('SHIT');

    const { gameId } = body;
    makeMoveWhenReady(gameId)
      .then(() => process.exit())
      .catch(console.error);
  }
);