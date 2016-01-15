$(document).ready(function() {
  $(window).on('resize', positionLines);
  positionLines();
  for (var y = 0; y < 3; y++) {
    for (var x = 0; x < 3; x++) {
      $('.lines').append('<div class=cell id=i' + x + y + '>');
    }
  }
});

function positionLines() {
  var size;
  var maxWidth = window.innerWidth;
  var maxHeight = window.innerHeight - window.innerHeight / 10;
  if (maxWidth > maxHeight) {
    size = maxHeight;
  } else {
    size = maxWidth;
  }
  size -= 20;
  $('.lines').width(size).height(size);
  $('.lines').css('left', maxWidth / 2 - size / 2);
  $('.lines').css('top', maxHeight / 2 - size / 2);
}
