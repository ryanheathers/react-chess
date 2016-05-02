import React from 'react';
import ChessPiece from './ChessPiece';

class Bishop extends ChessPiece {
  determineValidMoves(start, squares, rows, cols, currentPlayer) {
    // recursively check diagonals
    let topLeft = this.moveDiagonal(start, start.topLeft, 'topLeft', currentPlayer);
    let topRight = this.moveDiagonal(start, start.topRight, 'topRight', currentPlayer);
    let bottomLeft = this.moveDiagonal(start, start.bottomLeft, 'bottomLeft', currentPlayer);
    let bottomRight = this.moveDiagonal(start, start.bottomRight, 'bottomRight', currentPlayer);

    let validMoves = Array.prototype.concat(topLeft, topRight, bottomLeft, bottomRight);
    return validMoves;
  }
  render() {
    return (
      <div className="piece">
        {(this.props.owner === 'white') ? String.fromCharCode(9815) : String.fromCharCode(9821) }
      </div>
    );
  }
}

export default Bishop;
