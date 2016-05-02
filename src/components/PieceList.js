import React from 'react';

const PieceList = ({pieces}) => {

  // TODO: Reconsider this for future optimization - could cache values so that pieceLists are not
  // fully re-rendered each time this.props.pieces changes
  let whitePieces = {};
  let blackPieces = {};

  Object.keys(pieces).forEach((key) => {
    let piece = pieces[key];
    if (piece.owner === 'white') {
      if (whitePieces[piece.type]) {
        whitePieces[piece.type]++;
      }
      else {
        whitePieces[piece.type] = 1;
      }
    }
    else {
      if (blackPieces[piece.type]) {
        blackPieces[piece.type]++;
      }
      else {
        blackPieces[piece.type] = 1;
      }
    }
  });

  return (
    <div className="piece-lists">
      <table className="piece-list">
        <thead>
          <tr>
            <th colSpan="2">White Pieces</th>
          </tr>
        </thead>
        <tbody>
        {Object.keys(whitePieces).sort().map((key, index) => {
          return (
            <tr className="item" key={index}>
              <td>{key}</td>
              <td>{whitePieces[key]}</td>
            </tr>
          );
        })}
        </tbody>
      </table>

      <table className="piece-list">
        <thead>
          <tr>
            <th colSpan="2">Black Pieces</th>
          </tr>
        </thead>
        <tbody>
        {Object.keys(blackPieces).sort().map((key, index) => {
          return (
            <tr className="item" key={index}>
              <td>{key}</td>
              <td>{blackPieces[key]}</td>
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
}

PieceList.propTypes = {
  pieces: React.PropTypes.object.isRequired
};

export default PieceList;
