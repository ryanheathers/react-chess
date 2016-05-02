import ChessPiece from './ChessPiece';

class King extends ChessPiece {
  determineValidMoves(start, squares, rows, cols, currentPlayer) {
    // TODO: implement logic for check/checkmate

    let validMoves = [];

    if (start.topLeft) addMove(start.topLeft);
    if (start.topRight) addMove(start.topRight);
    if (start.bottomLeft) addMove(start.bottomLeft);
    if (start.topRight) addMove(start.topRight);
    if (squares[start - 1]) addMove(squares[start - 1]);
    if (squares[start + 1]) addMove(squares[start + 1]);
    if (squares[start - 8]) addMove(squares[start - 8]);
    if (squares[start + 8]) addMove(squares[start + 8]);

    return validMoves;

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
  }
}

export default King;
