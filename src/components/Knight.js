import React from 'react';
import ChessPiece from './ChessPiece';

class Knight extends ChessPiece {
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
  render() {
    return (
      <div className="piece">
        {(this.props.owner === 'white') ? String.fromCharCode(9816) : String.fromCharCode(9822) }
      </div>
    );
  }
}

export default Knight;
