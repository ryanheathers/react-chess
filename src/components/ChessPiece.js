import React from 'react';

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
}

ChessPiece.propTypes = {
  type: React.PropTypes.string,
  owner: React.PropTypes.string
}

export default ChessPiece;
