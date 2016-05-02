import React from 'react';
import ChessPiece from './ChessPiece';

class Queen extends ChessPiece {
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
  render() {
    return (
      <div className="piece">
        {(this.props.owner === 'white') ? String.fromCharCode(9813) : String.fromCharCode(9819) }
      </div>
    );
  }
}

export default Queen;
