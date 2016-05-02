import React from 'react';
import ChessPiece from './ChessPiece';

class Pawn extends ChessPiece {
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
  render() {
    return (
      <div className="piece">
        {(this.props.owner === 'white') ? String.fromCharCode(9817) : String.fromCharCode(9823) }
      </div>
    );
  }
}

export default Pawn;
