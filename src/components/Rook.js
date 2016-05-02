import ChessPiece from './ChessPiece';

class Rook extends ChessPiece {
  determineValidMoves(start, squares, rows, cols, currentPlayer) {
    let validMoves = this.moveHorizontalAndVertical(start, rows, cols, currentPlayer);
    return validMoves;
  }
}

export default Rook;
