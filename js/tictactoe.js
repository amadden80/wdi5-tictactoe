/*
* ===========
* VARIABLE SETUP
* ===========
*/

// Keeps track of how far the game has progressed and simulates which player's turn it is
var turn;
var turn_time;
var turn_timer;

//Static variables for how long each turn should last and which player is human and which is computer
var TIME_PER_TURN = 3;
var HUMAN_PLAYER = 2;
var COMPUTER_PLAYER = 1;

// Keeps track of whether the game has finished. Several functions should be disabled when this is true
var game_finished;

// Sets up a data structure for keeping track of the Tic Tac Toe game
var game_board;

/*
* ===============
* BASIC GAME FUNCTIONS
* ===============
*/

// Resets the game state completely. Called when the document loads and when the reset button is clicked
function reset_game(){
  // Resets the game state variables
  game_finished = false;
  turn = 1;
  game_board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

  // blanks all the cells
  $('td').removeClass('xed').removeClass('oed').addClass('blank').text('');

  //Resets timer and starts it
  turn_time = TIME_PER_TURN;
  update_timer();
  turn_timer = setInterval(remove_second, 1000);

  //Updates visible game stats
  set_active_player();
  $('#game-stats').show();
  $('#reset, #game-over-text').hide();

  //Computer player moves if they are the first player
  computer_plays_first();
}

// Updates the visible active player
function set_active_player(){
  $('#active-player').text(get_active_player());
}

/*
* ====================
* GAME OVER CHECK FUNCTIONS
* ====================
*/

//Takes a parameter of a row number (starting from 0) and checks whether either player has won the game in that row
function check_row(row) {
  if (!game_finished) {
    var row_sum = game_board[row][0] + game_board[row][1] + game_board[row][2];
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
    var col_sum = game_board[0][col] + game_board[1][col] + game_board[2][col];
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
  for (var i = 0; i < game_board[0].length; i++) {
    check_row(i);
  }
}

//Calls the check_col() function on each column in the game, performing a full vertical check for an end game state
function check_cols() {
  for (var i = 0; i < game_board[0].length; i++) {
    check_col(i);
  }
}

// Checks both diagonals for whether a player has won the game
function check_diagonals() {
  var ltr = game_board[0][0] + game_board[1][1] + game_board[2][2];
  var rtl = game_board[0][2] + game_board[1][1] + game_board[2][0];
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

/*
* ===============
* GAME END FUNCTIONS
* ===============
*/

// Called when a draw game state is achieved. Alerts the winner, prevents further game progression and shows the reset button.
function win_game() {
  winner = get_active_player() % 2 + 1;
  game_over();
  alert('Player ' + winner + ' wins!');
}

// Called when a draw game state is achieved. Alerts the draw, prevents further game progression and shows the reset button.
function draw_game() {
  game_over();
  alert('The Game is a Draw');
}

// Called when the game ends, stops the timer and prevents further interaction until the reset button is clicked
function game_over(){
  clearInterval(turn_timer);
  game_finished = true;
  $('#game-stats').hide();
  $('#reset, #game-over-text').show();
}

/*
* =================
* CELL MARKING FUNCTIONS
* =================
*/

//Triggered when a blank cell is clicked. If it's the human player's turn, marks that cell and sets up a delay on the computer's follow-up move
function human_mark(){
  if(get_active_player() === HUMAN_PLAYER){
    mark_cell.call(this);
    setTimeout(computer_mark, (TIME_PER_TURN - 1)*1000);
  }
}

// Called when a blank cell is clicked (human_mark) or when the computer marks a blank cell (computer_mark).
// If the game is in progress, marks the cell with the current player's symbol and color, then checks for a win or a draw
function mark_cell() {
  if (!game_finished) {
    var row = $(this).parent().data('row');
    var col = $(this).data('col');

    switch (turn % 2 === 1) {
      case true:
        game_board[row][col] = 1;
        $(this).text('X');
        $(this).addClass('xed').removeClass('blank');
        break;
      case false:
        game_board[row][col] = -1;
        $(this).text('O');
        $(this).addClass('oed').removeClass('blank');
        break;
    }
    turn += 1;
    check_everything();
    turn_time = TIME_PER_TURN;
    update_timer();
    set_active_player();
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
  game_over();
  alert('Player ' + get_active_player() + ' has lost on time!');
}

// Gives the number of the current player; 1 for an odd turn, 2 for an even turn
function get_active_player(){
  return ((turn +1) % 2) +1;
}

/*
* ==================
* RANDOM COMPUTER PLAYER
* ==================
*/

//Returns a random blank cell (using jQuery DOM selection!)
function get_random_blank(){
  if(!game_finished){
    var blank_cells = $('td.blank');
    var random_blank = $(_.shuffle(blank_cells)[0]);
    return random_blank;
  }
}

//If it is the computer player's turn, picks a blank cell and marks it
function computer_mark(){
  if(get_active_player() === COMPUTER_PLAYER){
    mark_cell.call(get_random_blank());
  }
}

//If it's the first turn of a game and the computer is the first player, makes a move
function computer_plays_first(){
  if(COMPUTER_PLAYER === turn === 1){
    computer_mark();
  }
}

/*
* ==========================
* EVENT HANDLERS AND DOM READY CODE
* ==========================
*/

// Once the document has loaded, set up event handlers for when a user clicks on a cell (td) or the reset button
$(document).ready(function() {
  // Notice that I am using a slightly different version of the standard .click() event. This one uses "delegation", where the table that holds the td elements is delegating the event to its '.blank.cell' children
  //This has the benefit of unbinding the  click event once a cell loses the 'blank' class. If you just used .click(), the event
  // Moving forward, remember that .on('click') is recommended over .click()

  //When a human player clicks in a cell, marks it if it is their turn
  $('#tictactoe_board').on('click', '.blank.cell', human_mark);

  //Resets the game when the Reset button is clicked
  $('#reset').on('click', reset_game);

  //Zeroes the array, timer and turn counter
  reset_game();

});
