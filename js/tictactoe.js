/*
* ===========
* VARIABLE SETUP
* ===========
*/

// Keeps track of how far the game has progressed and simulates which player's turn it is
var turn;
var turn_time;
var turn_timer;

var TIME_PER_TURN = 3;
var COMPUTER_TURN_TIME = 2;
var HUMAN_PLAYER = 1;
var COMPUTER_PLAYER = 2;

// Keeps track of whether the game has finished. Several functions should be disabled when this is true
var game_finished;

// Sets up a data structure for keeping track of the Tic Tac Toe game
var game_state;

/*
* ===============
* BASIC GAME FUNCTIONS
* ===============
*/

// Called when a draw game state is achieved. Alerts the winner, prevents further game progression and shows the reset button.
function win_game(player_name) {
  alert(player_name + ' wins!');
  game_finished = true;
  $('#reset').show();
}

// Called when a draw game state is achieved. Alerts the draw, prevents further game progression and shows the reset button.
function draw_game() {
  alert('The Game is a Draw');
  game_finished = true;
  $('#reset').show();
}

// Resets the game state when the reset button is clicked
function reset_game(){
  game_finished = false;
  turn = 1;
  game_state = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  $('td').removeClass('xed').removeClass('oed').addClass('blank').text('');
  turn_time = TIME_PER_TURN;
  update_timer();
  turn_timer = setInterval(remove_second, 1000);
  $(this).hide();
}

//Takes a parameter of a row number (starting from 0) and checks whether either player has won the game in that row
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

//Takes a parameter of a col number (starting from 0) and checks whether either player has won the game in that col
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

//Calls the check_row() function on each row in the game, performing a full horizontal check for an end game state
function check_rows() {
  for (var i = 0; i < game_state[0].length; i++) {
    check_row(i);
  }
}

//Calls the check_col() function on each column in the game, performing a full vertical check for an end game state
function check_cols() {
  for (var i = 0; i < game_state[0].length; i++) {
    check_col(i);
  }
}

// Checks both diagonals for whether a player has won the game
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

//If the game has progressed past the end of the game, triggers a draw
function check_draw() {
  if (turn > 9 && !game_finished) {
    draw_game();
  }
}

//Checks whether the game has been won or drawn
function check_everything() {
  check_rows();
  check_cols();
  check_diagonals();
  check_draw();
}

// Triggered when a blank cell is clicked. If the game is in progress, marks the cell with the current player's symbol and color, then checks for a win or a draw
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
    turn_time = TIME_PER_TURN;
    update_timer();

  }
}

/*
* =========
* TURN TIMING
* =========
*/

//Sets the timer on the page to display the remaining turn time
function update_timer(){
  $('#turn-timer').text(turn_time);
}

//Called every second that the timer interval is active, updates the visible time and checks for a time loss.
function remove_second(){
  if(!game_finished){
    turn_time -= 1;
    update_timer();
    if(turn_time <= 0){
      time_loss();
    }
  }
}

// Called when the last second is removed from the turn timer, stopping the game and showing that the current player has lost on time
function time_loss(){
  game_finished = true;
  clearInterval(turn_timer);
  alert('Player ' + get_active_player() + ' has lost on time!');
  $('#reset').show();
}

// Gives the number of the current player; 1 for an odd turn, 2 for an even turn
function get_active_player(){
  return ((turn +1) % 2) +1
}

/*
* =================
* "ARTIFICIAL INTELLIGENCE"
* =================
*/
function human_mark(){
  if(get_active_player() === HUMAN_PLAYER){
    mark_cell.call(this);
    setTimeout(computer_mark, COMPUTER_TURN_TIME*1000);
  }
}

function get_random_blank(){
  if(!game_finished){
    var blank_cells = $('td.blank');
    var random_blank = $(_.shuffle(blank_cells)[0]);
    return random_blank;
  }
}

function computer_mark(){
  if(get_active_player() === COMPUTER_PLAYER){
    mark_cell.call(get_random_blank());
  }
}

/*
* ============
* EVENT HANDLERS
* ============
*/

// Once the document has loaded, set up event handlers for when a user clicks on a cell (td) or the reset button
$(document).ready(function() {
  // Notice that I am using a slightly different version of the standard .click() event. This one uses "delegation", where the table that holds the td elements is delegating the event to its '.blank.cell' children
  //This has the benefit of unbinding the  click event once a cell loses the 'blank' class. If you just used .click(), the event
  // Moving forward, remember that .on('click') is recommended over .click()
  $('#tictactoe_board').on('click', '.blank.cell', human_mark);
  $('#reset').on('click', reset_game);

  //Zeroes the array, timer and turn counter
  reset_game();
});