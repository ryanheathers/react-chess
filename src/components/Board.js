import React from 'react';
import update from 'react-addons-update';
import NoticeType from '../config/constants';
import Square from './Square';
import Notice from './Notice';
import Command from './Command';
import PieceList from './PieceList';

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

    this.props.initialSetup.forEach((item) => {
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
        <header className="main-header">
          <h1>
            {`Current Player: ${this.state.currentPlayer.charAt(0).toUpperCase()}${this.state.currentPlayer.substr(1)}`}
          </h1>
        </header>
        <main>
          <div className="board">
            {rows.map((row, index) => {
              return <div className="row" key={index}>{row}</div>
            })}
            <Notice notices={this.state.notices}/>
          </div>
          <div className="sidebar">
            <Command handleCommand={this.handleCommand}/>
            <PieceList pieces={this.state.pieces}/>
          </div>
        </main>
      </div>
    );
  }
}

Board.propTypes = {
  initialSetup: React.PropTypes.array.isRequired
};

export default Board;
