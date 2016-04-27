import React from 'react';
import update from 'react-addons-update';
require('./style.scss');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      config: [
        // starting square, piece type, owner, id
        [0, 'Rook', 'black', 'br1'],
        [1, 'Knight', 'black', 'bh1'],
        [2, 'Bishop', 'black', 'bb1'],
        [3, 'Queen', 'black', 'bq1'],
        [4, 'King', 'black', 'bh1'],
        [5, 'Bishop', 'black', 'bb2'],
        [6, 'Knight', 'black', 'bk2'],
        [7, 'Rook', 'black', 'br2'],
        [8, 'Pawn', 'black', 'bp1'],
        [9, 'Pawn', 'black', 'bp2'],
        [10, 'Pawn', 'black', 'bp3'],
        [11, 'Pawn', 'black', 'bp4'],
        [12, 'Pawn', 'black', 'bp5'],
        [13, 'Pawn', 'black', 'bp6'],
        [14, 'Pawn', 'black', 'bp7'],
        [15, 'Pawn', 'black', 'bp8'],
        [48, 'Pawn', 'white', 'wp1'],
        [49, 'Pawn', 'white', 'wp2'],
        [50, 'Pawn', 'white', 'wp3'],
        [51, 'Pawn', 'white', 'wp4'],
        [52, 'Pawn', 'white', 'wp5'],
        [53, 'Pawn', 'white', 'wp6'],
        [54, 'Pawn', 'white', 'wp7'],
        [55, 'Pawn', 'white', 'wp8'],
        [56, 'Rook', 'white', 'wr1'],
        [57, 'Knight', 'white', 'wh1'],
        [58, 'Bishop', 'white', 'wb1'],
        [59, 'Queen', 'white', 'wq1'],
        [60, 'King', 'white', 'wk1'],
        [61, 'Bishop', 'white', 'wb2'],
        [62, 'Knight', 'white', 'wh2'],
        [63, 'Rook', 'white', 'wr2'],
      ]
    }
  }
  render() {
    return (
      <div>
        <Board config={this.state.config}/>
      </div>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pieces: {},
      rows: [],
      cols: [],
      squares: [],
      currentPlayer: 'white',
      moveInProgress: false,
      movingPiece: null,
      validMoves: null
    }
    this.handleMove = this.handleMove.bind(this);
    this.handleCommand = this.handleCommand.bind(this);
    this.deletePiece = this.deletePiece.bind(this);
  }
  componentWillMount() {
    this.initBoard();
  }
  componentDidMount() {
    this.initPieces();
  }
  initBoard() {
    const squares = [];
    const rows = [];
    const cols = [];
    const colNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    // pre-populate rows & cols with blank arrays
    for (let i = 0; i < 8; i++) {
      rows[i] = [];
      cols[i] = [];
    }

    // fill board with squares
    for (let counter = 0, i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let square = {
          index: counter,
          chessId: String(colNames[j] + (8 - i)),
          row: i,
          col: j,
          piece: null
        }
        squares[counter] = square;
        rows[i][j] = square;
        cols[i][j] = square;
        counter++;
      }
    }

    this.setState({rows: rows});
    this.setState({cols: cols});
    this.setState({squares: squares}, this.setAdjacents);
  }
  setAdjacents() {
    const {squares, rows, cols} = this.state;

    squares.forEach ((square) => {
      square.topLeft = (rows[square.row - 1] && cols[square.col - 1]) ? rows[square.row - 1][square.col - 1] : null;
      square.topRight = (rows[square.row - 1] && cols[square.col + 1]) ? rows[square.row - 1][square.col + 1] : null;
      square.bottomLeft = (rows[square.row + 1] && cols[square.col - 1]) ? rows[square.row + 1][square.col - 1] : null;
      square.bottomRight = (rows[square.row + 1] && cols[square.col + 1]) ? rows[square.row + 1][square.col + 1] : null;
    });

    this.setState({squares: squares});
  }
  initPieces() {
    const {squares, pieces} = this.state;

    this.props.config.forEach((item) => {
      let piece = {
        location: item[0],
        type: item[1],
        owner: item[2],
        id: item[3]
      }

      squares[item[0]].piece = piece;
      pieces[piece.id] = piece;
    });

    this.setState({pieces: pieces});
    this.setState({squares: squares});
  }
  switchPlayer() {
    let currentPlayer = this.state.currentPlayer;
    currentPlayer = (currentPlayer === 'white') ? 'black' : 'white';
    this.setState({currentPlayer: currentPlayer});
  }
  handleMove(index) {
    const {squares, rows, cols, moveInProgress, movingPiece, validMoves, currentPlayer} = this.state;
    const target = squares[index];

    // if moveInProgress === true, treat click as setting destination for moving piece
    if (moveInProgress) {
      if (!movingPiece || !validMoves.includes(target.index)) {
        return this.cancelMove();
      }
      else {
        return this.completeMove(target.index);
      }
    }
    // if !moveInProgress, treat click as initiating move
    else {
      if (!target.piece || target.piece.owner !== currentPlayer) return this.cancelMove();

      let validMoves = this.refs[target.index].refs.piece.determineValidMoves(target, squares, rows, cols, currentPlayer);

      if (!validMoves.length) {
        return this.cancelMove(); // no valid moves were found...
      }
      else {
        this.setState({moveInProgress: true});
        this.setState({movingPiece: target.piece});
        this.setState({validMoves: validMoves});
      }
    }
  }
  completeMove(index, movingPiece = this.state.movingPiece) {
    const {squares, pieces, currentPlayer} = this.state;

    // remove piece from old location
    let source = squares[movingPiece.location];
    source.piece = null;

    // access new location and remove eliminated enemy piece, if needed
    let destination = squares[index];
    if (destination.piece) {
      delete pieces[destination.piece.id];
      this.setState({pieces: pieces});
    }

    // add moving piece to new location
    destination.piece = movingPiece;
    destination.piece.location = destination.index;

    this.setState({squares: update(squares, {[source.index]: {$set: source}})});
    this.setState({squares: update(squares, {[destination.index]: {$set: destination}})});
    this.setState({moveInProgress: false});
    this.setState({movingPiece: null});
    this.setState({validMoves: null});
    this.switchPlayer();
  }
  cancelMove() {
    console.log('move cancelled!');
    this.setState({moveInProgress: false});
    this.setState({movingPiece: null});
    this.setState({validMoves: null});
  }
  handleCommand(command) {
    const {pieces, squares, rows, cols, currentPlayer} = this.state;
    // example command: WP1A3
    if (command.length !== 5) return this.cancelMove();

    // parse command
    command = command.toLowerCase(); // assuming no invalid chars, spot for future check
    let pieceId = command.substr(0, 3);
    let chessId = command.substr(3);

    // derive and validate needed info
    let piece = pieces[pieceId];
    if (!pieces[pieceId] || piece.owner !== currentPlayer) return this.cancelMove();

    let source = squares[piece.location];
    let destination = squares.find((square) => {
      return square.chessId === chessId;
    });
    if (!destination) return this.cancelMove();

    // get valid moves
    let validMoves = this.refs[source.index].refs.piece.determineValidMoves(source, squares, rows, cols, currentPlayer);

    if (!validMoves.includes(destination.index)) {
      return this.cancelMove();
    }
    else {
      this.completeMove(destination.index, piece);
    }
  }
  deletePiece(pieceId, index) {
    // pieces are referenced in two places so need to delete both
    delete this.state.pieces[pieceId];
    delete this.state.squares[index].piece;
    this.setState({pieces: this.state.pieces});
    this.setState({squares: this.state.squares});
  }
  render() {
    let squares = this.state.squares.map((square, index) => {
      return (
        <Square
          ref={index}
          key={index}
          index={index}
          chessId={square.chessId}
          piece={square.piece}
          handleMove={this.handleMove}
          deletePiece={this.deletePiece}
        />
      );
    });

    // Process squares into rows of length 8
    // Doing it this way rather than rendering state.rows directly allows for squares to be indexed properly
    let rows = [];
    let chunk = 8;
    for (let i = 0; i < squares.length; i += chunk) {
      rows.push(squares.slice(i, i + chunk));
    }

    return (
      <div className="wrapper">
        <Commands handleCommand={this.handleCommand}/>
        <div className="board">
          {rows.map((row, index) => {
            return <div className="row" key={index}>{row}</div>
          })}
        </div>
      </div>
    );
  }
}

class Commands extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({value: e.target.value});
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.handleCommand(this.state.value);
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <button type="submit">Enter Command</button>
      </form>
    );
  }
}

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDelete: false
    }
    this.startDelete = this.startDelete.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
  }
  startDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({showDelete: true});
  }
  handleDelete(e) {
    e.preventDefault();
    this.props.deletePiece(this.props.piece.id, this.props.index);
    this.setState({showDelete: false});
  }
  cancelDelete() {
    this.setState({showDelete: false});
  }
  render() {
    let {piece, index, chessId, handleMove} = this.props;

    piece = (piece) ? React.createElement(ChessPieces[piece.type], {ref: 'piece', type: piece.type}) : '';

    let form = (this.state.showDelete && piece)
      ? <form className="delete-form">
          <label>Delete Piece?</label>
          <button type="button" onClick={this.handleDelete}>Yes</button>
          <button type="button" onClick={this.cancelDelete}>No</button>
        </form>
      : '';

    return (
      <div className="square" onClick={handleMove.bind(this, index)}>
        <span>{chessId}</span>
        <span className="delete-label" onClick={this.startDelete}>X</span>
        {piece}
        {form}
      </div>
    );
  }
}

class ChessPiece extends React.Component {
  moveDiagonal(start, diagonal, direction, currentPlayer) {
    let validMoves = [];
    recurse(diagonal, direction);

    return validMoves;

    function recurse(diagonal, direction) {
      if (diagonal === null || diagonal === start) return; // base case

      if (diagonal.piece) {
        if (diagonal.piece.owner !== currentPlayer) {
          validMoves.push(diagonal.index);
          return;
        }
        else {
          return;
        }
      }
      else {
        validMoves.push(diagonal.index);
        recurse(diagonal[direction], direction);
      }
    }
  }
  moveHorizontalAndVertical(start, rows, cols, currentPlayer) {
    let validMoves = [];

    // make horizontal slices and reverse first so arrays "radiate" out from start position
    let slice1 = rows[start.row].slice(0, start.col).reverse();
    let slice2 = rows[start.row].slice(start.col + 1);

    // make vertical slices and reverse first so arrays "radiate" out from start position
    let slice3 = cols[start.col].slice(0, start.row).reverse();
    let slice4 = cols[start.col].slice(start.row + 1);

    processSlice(slice1);
    processSlice(slice2);
    processSlice(slice3);
    processSlice(slice4);

    return validMoves;

    function processSlice(slice) {
      for (let i = 0; i < slice.length; i++) {
        if (slice[i].piece) {
          if (slice[i].piece.owner !== currentPlayer) {
            validMoves.push(slice[i].index);
            break;
          }
          else {
            break;
          }
        }
        else {
          validMoves.push(slice[i].index);
        }
      }
    }
  }
  render() {
    return <div>{this.props.type}</div>
  }
}

const King = class King extends ChessPiece {
  determineValidMoves(start, squares, rows, cols, currentPlayer) {
    // TODO: implement logic for check/checkmate

    let validMoves = [];

    if (start.topLeft) addMove(start.topLeft);
    if (start.topRight) addMove(start.topRight);
    if (start.bottomLeft) addMove(start.bottomLeft);
    if (start.topRight) addMove(start.topRight);
    if (squares[start - 1]) addMove(squares[start - 1]);
    if (squares[start + 1]) addMove(squares[start + 1]);
    if (squares[start - 8]) addMove(squares[start - 8]);
    if (squares[start + 8]) addMove(squares[start + 8]);

    return validMoves;

    function addMove(target) {
      if (target.piece) {
        if (target.piece.owner !== currentPlayer) {
          validMoves.push(target.index);
          return;
        }
        else {
          return;
        }
      }
      else {
        validMoves.push(target.index);
      }
    }
  }
}

const Queen = class Queen extends ChessPiece {
  determineValidMoves(start, squares, rows, cols, currentPlayer) {
    // recursively check diagonals
    let topLeft = this.moveDiagonal(start, start.topLeft, 'topLeft', currentPlayer);
    let topRight = this.moveDiagonal(start, start.topRight, 'topRight', currentPlayer);
    let bottomLeft = this.moveDiagonal(start, start.bottomLeft, 'bottomLeft', currentPlayer);
    let bottomRight = this.moveDiagonal(start, start.bottomRight, 'bottomRight', currentPlayer);

    let validMoves = this.moveHorizontalAndVertical(start, rows, cols, currentPlayer);

    validMoves = validMoves.concat(topLeft, topRight, bottomLeft, bottomRight);
    return validMoves;
  }
}

const Bishop = class Bishop extends ChessPiece {
  determineValidMoves(start, squares, rows, cols, currentPlayer) {
    // recursively check diagonals
    let topLeft = this.moveDiagonal(start, start.topLeft, 'topLeft', currentPlayer);
    let topRight = this.moveDiagonal(start, start.topRight, 'topRight', currentPlayer);
    let bottomLeft = this.moveDiagonal(start, start.bottomLeft, 'bottomLeft', currentPlayer);
    let bottomRight = this.moveDiagonal(start, start.bottomRight, 'bottomRight', currentPlayer);

    let validMoves = Array.prototype.concat(topLeft, topRight, bottomLeft, bottomRight);
    return validMoves;
  }
}

const Knight = class Knight extends ChessPiece {
  determineValidMoves(start, squares, rows, cols, currentPlayer) {
    let validMoves = [];
    let possibleMoves = [];

    if (rows[start.row + 1]) {
      possibleMoves.push(rows[start.row + 1][start.col + 2]);
      possibleMoves.push(rows[start.row + 1][start.col - 2]);
    }
    if (rows[start.row - 1]) {
      possibleMoves.push(rows[start.row - 1][start.col + 2]);
      possibleMoves.push(rows[start.row - 1][start.col - 2]);
    }
    if (rows[start.row + 2]) {
      possibleMoves.push(rows[start.row + 2][start.col + 1]);
      possibleMoves.push(rows[start.row + 2][start.col - 1]);
    }
    if (rows[start.row - 2]) {
      possibleMoves.push(rows[start.row - 2][start.col + 1]);
      possibleMoves.push(rows[start.row - 2][start.col - 1]);
    }

    for (let move of possibleMoves) {
      if (move) addMove(move);
    }

    function addMove(target) {
      if (target.piece) {
        if (target.piece.owner !== currentPlayer) {
          validMoves.push(target.index);
          return;
        }
        else {
          return;
        }
      }
      else {
        validMoves.push(target.index);
      }
    }

    return validMoves;
  }
}

const Rook = class Rook extends ChessPiece {
  determineValidMoves(start, squares, rows, cols, currentPlayer) {
    let validMoves = this.moveHorizontalAndVertical(start, rows, cols, currentPlayer);
    return validMoves;
  }
}

const Pawn = class Pawn extends ChessPiece {
  determineValidMoves(start, squares, rows, cols, currentPlayer) {

    // TODO: implement pawn diagonal attack

    let validMoves = [];
    // checking for currentPlayer accounts for pawns not allowed to move backwards
    if (currentPlayer === 'white') {
      if (squares[start.index - 8] && !squares[start.index - 8].piece) {
        validMoves.push(start.index - 8);
      }
    }
    else {
      if (squares[start.index + 8] && !squares[start.index + 8].piece) {
        validMoves.push(start.index + 8);
      }
    }

    return validMoves;
  }
}

let ChessPieces = {
  King, Queen, Bishop, Knight, Rook, Pawn
};

export default App;
