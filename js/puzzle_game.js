(function () {

  const PUZZLE_CLEAN_BOARD = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, null]
  ];
  const TILE_SIZE = 100;

  const deepCopy = (board) => JSON.parse(JSON.stringify(board));
  const compare = (board, board2) => JSON.stringify(board) == JSON.stringify(board2);

  let puzzleBoard = deepCopy(PUZZLE_CLEAN_BOARD);
  let emptyTile = { row: 0, column: 0 };


  const prev_onload_handler = window.onload;
  window.onload = init;
  if (prev_onload_handler) prev_onload_handler();

  function init() {
    //localStorage["winCount"] = 0;
    createBoard();
    showWins();
    document.getElementById("shuffle").onclick = shuffle;
  }


  function createBoard() {
    let board = document.getElementById("board");

    puzzleBoard.forEach((row, rowIndex) => {
      row.forEach((tileValue, columnIndex) => {

        if (tileValue) {
          var tile = document.createElement("div");
          tile.className = "tile";
          tile.innerHTML = tileValue;
          tile.style.left = columnIndex * TILE_SIZE + "px";
          tile.style.top = rowIndex * TILE_SIZE + "px";

          tile.row = rowIndex;
          tile.column = columnIndex;

          board.appendChild(tile);

          tile.onmouseover = movable;
          tile.ontouchstart = movable;
          tile.onmouseup = onMove;
          tile.onmouseout = resetTileStyle;
        }
        else {
          emptyTile = { row: rowIndex, column: columnIndex }
        }
      });
    });
  }

  function movable(event) {
    const tile = event.target;

    if ((tile.row === emptyTile.row && Math.abs(tile.column - emptyTile.column) === 1) ||
      (tile.column === emptyTile.column && Math.abs(tile.row - emptyTile.row) === 1)) {
      tile.classList.add("tileMovable");
    }
  }

  function onMove(event) {

    const tile = event.target;

    if (tile.classList.contains("tileMovable")) {

      const tempRow = tile.row;
      const tempColumn = tile.column;

      //model swap
      puzzleBoard[emptyTile.row][emptyTile.column] = puzzleBoard[tempRow][tempColumn]
      puzzleBoard[tempRow][tempColumn] = null;

      //view      
      tile.style.left = emptyTile.column * TILE_SIZE + "px";
      tile.style.top = emptyTile.row * TILE_SIZE + "px";
      tile.row = emptyTile.row;
      tile.column = emptyTile.column;

      resetTileStyle(event);
      isWin();

      emptyTile = { row: tempRow, column: tempColumn }
    }
  }

  function resetTileStyle(event) {
    event.target.classList.remove("tileMovable");
  }

  function isWin() {
    if (compare(puzzleBoard, PUZZLE_CLEAN_BOARD)) {
      winBlink();

      localStorage.winCount = Number(localStorage.winCount) + 1;
      showWins();
    }
  }

  function showWins() {
    var winMsg = document.getElementById("winMsg");
    if (!localStorage.winCount)
      localStorage.winCount = 0;

    winMsg.innerHTML = "Total Wins: " + localStorage.winCount;
  }

  function shuffle() {
    for (let i = 0; i < 100; i++) {
      const neighbours = getTileNeighbours(emptyTile);
      //pick random move
      const randomNeghbourIndex = Math.floor(Math.random() * neighbours.length);
      const pieceToMove = neighbours[randomNeghbourIndex];

      //swap
      puzzleBoard[emptyTile.row][emptyTile.column] = puzzleBoard[pieceToMove.row][pieceToMove.column];
      puzzleBoard[pieceToMove.row][pieceToMove.column] = null;
      emptyTile = { row: pieceToMove.row, column: pieceToMove.column }
    }

    let board = document.getElementById("board");
    board.innerHTML = "";
    createBoard();
  }

  function getTileNeighbours(tile) {

    let neighbours = [];

    const indexInBounds = (row, column) => {
      return 0 <= row && row < PUZZLE_CLEAN_BOARD.length &&
        0 <= column && column < PUZZLE_CLEAN_BOARD[0].length;
    };

    let upper = { row: tile.row - 1, column: tile.column };
    if (indexInBounds(upper.row, upper.column)) neighbours.push(upper);

    let right = { row: tile.row, column: tile.column + 1 };
    if (indexInBounds(right.row, right.column)) neighbours.push(right);

    let bottom = { row: tile.row + 1, column: tile.column };
    if (indexInBounds(bottom.row, bottom.column)) neighbours.push(bottom);

    let left = { row: tile.row, column: tile.column - 1 };
    if (indexInBounds(left.row, left.column)) neighbours.push(left);

    return neighbours;
  }

  function winBlink() {
    document.getElementById("board").className = "blinking";
    setTimeout(function () { document.getElementById("board").classList.remove("blinking"); }, 2500);
  }

})();