import React from 'react';
import King from './King';
import Queen from './Queen';
import Bishop from './Bishop';
import Knight from './Knight';
import Rook from './Rook';
import Pawn from './Pawn';

const chessPieces = {
  King, Queen, Bishop, Knight, Rook, Pawn
};

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
    e.preventDefault();
    e.stopPropagation();
    this.setState({showDelete: false});
  }
  render() {
    let {piece, index, chessId, handleMove} = this.props;

    piece = (piece) ? React.createElement(chessPieces[piece.type], {ref: 'piece', type: piece.type, owner: piece.owner}) : '';

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

Square.propTypes = {
  chessId: React.PropTypes.string.isRequired,
  piece: React.PropTypes.object,
  handleMove: React.PropTypes.func.isRequired,
  deletePiece: React.PropTypes.func.isRequired
};

export default Square;
