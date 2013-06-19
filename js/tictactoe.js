var turn = 1;
var game_finished = false;
var game_state = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

function win_game(player_name) {
  alert(player_name + ' wins!');
  game_finished = true;
  $('#reset').show();
}

function draw_game() {
  alert('The Game is a Draw');
  game_finished = true;
  $('#reset').show();
}

function reset_game(){
  game_finished = false;
  turn = 1;
  game_state = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  $('td').removeClass('xed').removeClass('oed').addClass('blank').text('');
  $(this).hide();
}

function check_row(row) {
  if (!game_finished) {
    var row_sum = game_state[row][0] + game_state[row][1] + game_state[row][2];
    switch (row_sum) {
      case 3:
        win_game('Player 1');
        break;
      case -3:
        win_game('Player 2');
        break;
    }
  }
}

function check_col(col) {
  if (!game_finished) {
    var col_sum = game_state[0][col] + game_state[1][col] + game_state[2][col];
    switch (col_sum) {
      case 3:
        win_game('Player 1');
        break;
      case -3:
        win_game('Player 2');
        break;
    }
  }
}

function check_rows() {
  for (var i = 0; i < game_state[0].length; i++) {
    check_row(i);
  }
}

function check_cols() {
  for (var i = 0; i < game_state[0].length; i++) {
    check_col(i);
  }
}

function check_diagonals() {
  var ltr = game_state[0][0] + game_state[1][1] + game_state[2][2];
  var rtl = game_state[0][2] + game_state[1][1] + game_state[2][0];
  switch (ltr) {
    case 3:
      win_game('Player 1');
      break;
    case -3:
      win_game('Player 2');
      break;
  }
  switch (rtl) {
    case 3:
      win_game('Player 1');
      break;
    case -3:
      win_game('Player 2');
      break;
  }
}

function check_draw() {
  if (turn > 9) {
    draw_game();
  }
}

function check_everything() {
  check_rows();
  check_cols();
  check_diagonals();
  check_draw();
}

function mark_cell() {
  if (!game_finished) {
    var row = $(this).parent().data('row');
    var col = $(this).data('col');

    switch (turn % 2 === 1) {
      case true:
        game_state[row][col] = 1;
        $(this).text('X');
        $(this).addClass('xed').removeClass('blank');
        break;
      case false:
        game_state[row][col] = -1;
        $(this).text('O');
        $(this).addClass('oed').removeClass('blank');
        break;
    }
    turn += 1;
    check_everything();
  }
}

$(document).ready(function() {
  $('table').on('click', 'td.blank', mark_cell);
  $('#reset').on('click', reset_game);
});