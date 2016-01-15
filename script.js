var $ = require('jquery');
var game = new TicTacToe();

smarttv.on('message', function(playerId, obj) {
  if (obj.name) {
    obj.id = playerId;
    joinGame(obj);
  } else if (obj.hasOwnProperty('x')) {
    insert(playerId, obj);
  }
});

smarttv.on('connect', function(client) {
  if (game.players.length < 2) {
    smarttv.send(client, 'free');
  } else {
    smarttv.send(client, 'busy');
  }
});

smarttv.on('disconnect', function(client) {
  if (game.players[1] && game.players[1].id === client) {
    game.players.slice(1, 1);
    $('.player-o span').text('');
  }
  if (game.players[0] && game.players[0].id === client) {
    game.players.slice(0, 1);
    $('.player-x span').text('');
  }
});

game.on('fill', function(obj) {
  $('#i' + obj.x + obj.y).addClass(obj.sign);
});

function joinGame(player) {
  if (game.players.length >= 2) {
    smarttv.send(player.id, 'busy');
  } else {
    game.players.push(player);
    if (game.players.length === 1) {
      $('.player-x span').text(player.name);
      smarttv.send(player.id, 'queue');
    } else {
      $('.player-o span').text(player.name);
      $('h2').text('Ready to play!');
      setTimeout(startGame, 0);
      smarttv.send(game.players[0].id, 'ready');
      smarttv.send(game.players[1].id, 'ready');
    }
  }
}

function insert(playerId, obj) {
  if (game.getCurrentPlayer().id === playerId) {
    game.insert(obj.x, obj.y);
  }
}

function startGame() {
  $('.waiting-players').hide();
  $('.player-x').addClass('top');
  $('.player-o').addClass('top');
  $('h2').hide();
  $('.lines').show();
  game.start();
  smarttv.send(game.players[0].id, 'draw');
  smarttv.send(game.players[1].id, 'draw');
}
