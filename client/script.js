$(document).ready(function() {
  $(window).on('resize', positionLines);
  positionLines();
  for (var i = 0; i < 9; i++) {
    $('.lines').append('<div class=cell>');
  }
});

function positionLines() {
  var size;
  if (window.innerWidth > window.innerHeight) {
    size = window.innerHeight;
  } else {
    size = window.innerWidth;
  }
  $('.lines').width(size).height(size);
  $('.lines').css('left', window.innerWidth / 2 - size / 2);
  $('.lines').css('top', window.innerHeight / 2 - size / 2);
}
