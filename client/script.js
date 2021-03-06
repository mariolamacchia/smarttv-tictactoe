smarttv.on('message', function(msg) {
  if (msg === 'busy') {
    $('h2').text('Sorry, other people are playing :(');
  } else if (msg === 'free') {
    $('h2').text('Insert your name:');
    $('.form-group').show();
  } else if (msg === 'queue') {
    $('h2').text('Waiting for another player');
  } else if (msg === 'ready') {
    $('h2').text('Ready to play!');
  } else if (msg === 'start') {
    $('h2').hide();
    $('.lines').show();
  } else if (msg === 'lose' || msg === 'win' || msg === 'draw') {
    $('h2').show();
    $('.lines').hide();
    $('.cell').removeClass('O').removeClass('X');
    if (msg === 'lose') {
      $('h2').text('You lose :(');
    } else if (msg === 'win') {
      $('h2').text('You win!!!');
    } else {
      $('h2').text('Draw!');
    }
  } else if (msg.hasOwnProperty('x')) {
    $('#i' + msg.x + msg.y).addClass(msg.sign);
  }
});

$(document).ready(function() {
  $('input').on('keyup', function(e) {
    if (e.keyCode === 13) {
      var name = $(this).val().trim();
      if (name) {
        smarttv.send({name: name});
        $('h2').text('Waiting...');
        $('.form-group').hide();
      }
    }
  });

  $('.cell').click(function() {
    smarttv.send({
      x: Number(this.id[1]),
      y: Number(this.id[2])
    });
  });
});
