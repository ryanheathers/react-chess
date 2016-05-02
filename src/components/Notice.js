import React from 'react';

const Notice = ({notices}) => {
  var notice = '';
  if (notices.invalidMove && notices.invalidMove === true) {
    notice = <div className="notice">Invalid Move<br/><span>Try a different destination</span></div>;
  }
  else if (notices.noMovesAvailable && notices.noMovesAvailable === true) {
    notice = <div className="notice">No Moves Available<br/><span>Use a different piece</span></div>;
  }
  else if (notices.invalidCommand && notices.invalidCommand === true) {
    notice = <div className="notice">Command Not Valid<br/><span>Something is off with your command</span></div>;
  }
  else if (notices.wrongPlayer && notices.wrongPlayer === true) {
    notice = <div className="notice">Not Your Piece<br/><span>Try moving your own piece instead :)</span></div>;
  }

  return (
    <div className={`notices ${(!notice) ? 'isHidden' : ''}`}>{notice}</div>
  );
}

Notice.propTypes = {
  notices: React.PropTypes.object.isRequired
};

export default Notice;
