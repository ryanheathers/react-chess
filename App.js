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
      squares: [],
      rows: [],
      cols: [],
      currentPlayer: 'white',
      moveInProgress: false,
      movingPiece: null,
      validMoves: null,
      notices: {}
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
        cols[j][i] = square;
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
      if (!validMoves.includes(target.index)) {
        return this.cancelMove(NOTICE_TYPE.invalidMove);
      }
      else {
        return this.completeMove(target.index);
      }
    }
    // if !moveInProgress, treat click as initiating move
    else {
      if (!target.piece) return; // if no piece is present, do nothing
      if (target.piece.owner !== currentPlayer) return this.cancelMove(NOTICE_TYPE.wrongPlayer);

      let validMoves = this.refs[target.index].refs.piece.determineValidMoves(target, squares, rows, cols, currentPlayer);

      if (!validMoves.length) {
        return this.cancelMove(NOTICE_TYPE.noMovesAvailable); // no valid moves were found...
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
  cancelMove(notice) {
    this.setState({moveInProgress: false});
    this.setState({movingPiece: null});
    this.setState({validMoves: null});

    let {notices} = this.state;
    notices = update(this.state.notices, {[notice]: {$set: true}});
    this.setState({notices: notices}, () => {
      setTimeout(() => {
        notices = update(this.state.notices, {[notice]: {$set: false}});
        this.setState({notices: notices});
      }, 1000);
    });
  }
  handleCommand(command) {
    const {pieces, squares, rows, cols, currentPlayer} = this.state;
    // example command: WP1A3
    if (command.length !== 5) return this.cancelMove(NOTICE_TYPE.invalidCommand);

    // parse command
    command = command.toLowerCase(); // assuming no invalid chars, spot for future check
    let pieceId = command.substr(0, 3);
    let chessId = command.substr(3);

    // derive and validate needed info
    let piece = pieces[pieceId];
    if (!pieces[pieceId] || piece.owner !== currentPlayer) return this.cancelMove(NOTICE_TYPE.invalidCommand);

    let source = squares[piece.location];
    let destination = squares.find((square) => {
      return square.chessId === chessId;
    });
    if (!destination) return this.cancelMove(NOTICE_TYPE.invalidCommand);

    // get valid moves
    let validMoves = this.refs[source.index].refs.piece.determineValidMoves(source, squares, rows, cols, currentPlayer);

    if (!validMoves.includes(destination.index)) {
      return this.cancelMove(NOTICE_TYPE.invalidMove);
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
        <h1>
          {`Current Player: ${this.state.currentPlayer.charAt(0).toUpperCase()}${this.state.currentPlayer.substr(1)}`}
        </h1>
        <main className="main">
          <div className="board">
            {rows.map((row, index) => {
              return <div className="row" key={index}>{row}</div>
            })}
            <Notice notices={this.state.notices}/>
          </div>
          <div className="sidebar">
            <Commands handleCommand={this.handleCommand}/>
            <PieceList pieces={this.state.pieces}/>
          </div>
        </main>
      </div>
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
  cancelDelete(e) {
    e.stopPropagation();
    this.setState({showDelete: false});
  }
  render() {
    let {piece, index, chessId, handleMove} = this.props;

    piece = (piece) ? React.createElement(ChessPieces[piece.type], {ref: 'piece', type: piece.type, owner: piece.owner}) : '';

    let form = (this.state.showDelete && piece)
      ? <form className="delete-form">
          <p>Delete Piece?</p>
          <div>
            <button type="button" onClick={this.handleDelete}>Yes</button>
            <button type="button" onClick={this.cancelDelete}>No</button>
          </div>
        </form>
      : '';

    return (
      <div className="square" onClick={handleMove.bind(this, index)}>
        <div className="square-meta">
          <span className="chess-id">{chessId}</span>
          {(piece) ? <span className="delete-label" onClick={this.startDelete}></span> : ''}
        </div>
        {piece}
        {form}
      </div>
    );
  }
}

class Notice extends React.Component {
  render() {
    const {notices} = this.props;
    var notice = '';
    if (notices.invalidMove && notices.invalidMove === true) {
      notice = <div className="notice">Invalid Move<br/><span>Try a different destination</span></div>;
    }
    else if (notices.noMovesAvailable && notices.noMovesAvailable === true) {
      notice = <div className="notice">No Moves Available<br/><span>Use a different piece</span></div>;
    }
    else if (notices.invalidCommand && notices.invalidCommand === true) {
      notice = <div className="notice">Command Not Valid<br/><span>Something is off with your command</span></div>;
    }
    else if (notices.wrongPlayer && notices.wrongPlayer === true) {
      notice = <div className="notice">Not Your Piece<br/><span>Try moving your own piece instead :)</span></div>;
    }

    return (
      <div className={`notices ${(!notice) ? 'isHidden' : ''}`}>{notice}</div>
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
    this.setState({value: ''});
  }
  render() {
    return (
      <div className="command-form">
      <h3>To Make a Move:</h3>
      <p>Click on the desired piece and then click on the destination tile.</p>
      <p>Alternatively, you can enter a chess notation command below.</p>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <button type="submit">Enter Command</button>
        </form>
        <p>Example Command: <b>'wh1c3'</b> moves White's Horse #1 (Knight) to tile C3</p>
      </div>
    );
  }
}

class PieceList extends React.Component {
  render() {
    // TODO: Reconsider this for future optimization - could cache values so that pieceLists are not
    // fully re-rendered each time this.props.pieces changes
    let whitePieces = {};
    let blackPieces = {};

    Object.keys(this.props.pieces).forEach((key) => {
      let piece = this.props.pieces[key];
      if (piece.owner === 'white') {
        if (whitePieces[piece.type]) {
          whitePieces[piece.type]++;
        }
        else {
          whitePieces[piece.type] = 1;
        }
      }
      else {
        if (blackPieces[piece.type]) {
          blackPieces[piece.type]++;
        }
        else {
          blackPieces[piece.type] = 1;
        }
      }
    });

    return (
      <div className="piece-lists">
        <table className="piece-list">
          <thead>
            <tr>
              <th colSpan="2">White Pieces</th>
            </tr>
          </thead>
          <tbody>
          {Object.keys(whitePieces).sort().map((key, index) => {
            return (
              <tr className="item" key={index}>
                <td>{key}</td>
                <td>{whitePieces[key]}</td>
              </tr>
            );
          })}
          </tbody>
        </table>

        <table className="piece-list">
          <thead>
            <tr>
              <th colSpan="2">Black Pieces</th>
            </tr>
          </thead>
          <tbody>
          {Object.keys(blackPieces).sort().map((key, index) => {
            return (
              <tr className="item" key={index}>
                <td>{key}</td>
                <td>{blackPieces[key]}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    );
  }
}

class ChessPiece extends React.Component {
  // TODO:
  // implement check/checkmate
  // implement pawn promotion
  // implement en passant
  // implement castling

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
    return (
      <div className="piece">
        <span className="owner">{this.props.owner}</span>
        <span className="type">{this.props.type}</span>
      </div>
    );
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

    let validMoves = [];
    // checking for currentPlayer accounts for pawns not allowed to move backwards
    if (currentPlayer === 'white') {
      // add vertical move
      if (squares[start.index - 8] && !squares[start.index - 8].piece) {
        validMoves.push(start.index - 8);
      }

      // add diagonal attack moves
      if (start.topLeft && start.topLeft.piece && start.topLeft.piece.owner !== currentPlayer) {
        validMoves.push(start.topLeft.index);
      }
      else if (start.topRight && start.topRight.piece && start.topRight.piece.owner !== currentPlayer) {
        validMoves.push(start.topRight.index);
      }
    }
    else {
      if (squares[start.index + 8] && !squares[start.index + 8].piece) {
        validMoves.push(start.index + 8);
      }

      // add diagonal attack moves
      if (start.bottomLeft && start.bottomLeft.piece && start.bottomLeft.piece.owner !== currentPlayer) {
        validMoves.push(start.bottomLeft.index);
      }
      else if (start.bottomRight && start.bottomRight.piece && start.bottomRight.piece.owner !== currentPlayer) {
        validMoves.push(start.bottomRight.index);
      }
    }

    return validMoves;
  }
}

let ChessPieces = {
  King, Queen, Bishop, Knight, Rook, Pawn
};

const NOTICE_TYPE = {
  noMovesAvailable: 'noMovesAvailable',
  invalidMove: 'invalidMove',
  invalidCommand: 'invalidCommand',
  wrongPlayer: 'wrongPlayer'
};

export default App;
