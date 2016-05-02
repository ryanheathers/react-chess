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
}

export default Bishop;
