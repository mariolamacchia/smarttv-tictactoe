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
  if (game.isOpen) {
    if (game.players[0] === game.getCurrentPlayer()) {
      game.win(game.players[1]);
    } else {
      game.win(game.players[0]);
    }
  } else {
    if (game.players[1] && game.players[1].id === client) {
      game.players.splice(1, 1);
      $('.player-o span').text('');
    }
    if (game.players[0] && game.players[0].id === client) {
      game.players.splice(0, 1);
      $('.player-x span').text('');
    }
  }
});

game.on('fill', function(obj) {
  $('#i' + obj.x + obj.y).addClass(obj.sign);
  send(obj);
});

game.on('changeTurn', function(obj) {
  $('.player-x span').css('text-decoration', 'none');
  $('.player-o span').css('text-decoration', 'none');
  var p;
  if (obj.player === game.players[0]) {
    p = $('.player-x span');
  } else {
    p = $('.player-o span');
  }
  p.css('text-decoration', 'underline');
});

game.on('end', function(result) {
  setTimeout(function () {
    $('.lines').hide();
    $('.cell').css('background-image', 'initial');
    if (result.player) {
      $('h2').show();
      $('h2').text('The winner is ' + result.player.name);
      if (game.players[0] !== result.player) {
        smarttv.send(game.players[0].id, 'lose');
        smarttv.send(game.players[1].id, 'win');
      } else {
        smarttv.send(game.players[1].id, 'lose');
        smarttv.send(game.players[0].id, 'win');
      }
    } else {
      $('h2').text('Draw!');
      send('draw');
    }
    setTimeout(function () {
      waitForPlayers();
      game.players.splice(0, 2);
      send('reset');
    }, 3000);
  }, 2000);
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
      send('ready');
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
  send('draw');
}

function send(msg) {
  smarttv.send(game.players[0].id, msg);
  smarttv.send(game.players[1].id, msg);
}

function waitForPlayers() {
  $('h2').text('Waiting for players...');
  $('.player-x').removeClass('top');
  $('.player-x span').text('').css('text-decoration', 'none');
  $('.player-o').removeClass('top');
  $('.player-o span').text('').css('text-decoration', 'none');
  $('.lines').hide();
  $('.cell').removeClass('X').removeClass('O');
  smarttv.send('free');
}
