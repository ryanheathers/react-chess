import React from 'react';
import ChessPiece from './ChessPiece';

class Rook extends ChessPiece {
  determineValidMoves(start, squares, rows, cols, currentPlayer) {
    let validMoves = this.moveHorizontalAndVertical(start, rows, cols, currentPlayer);
    return validMoves;
  }
  render() {
    return (
      <div className="piece">
        {(this.props.owner === 'white') ? String.fromCharCode(9814) : String.fromCharCode(9820) }
      </div>
    );
  }
}

export default Rook;
