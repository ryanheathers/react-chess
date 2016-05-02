import React from 'react';
import Board from './Board';

const App = ({initialSetup}) => {
  return (
    <div>
      <Board initialSetup={initialSetup}/>
    </div>
  );
}

App.propTypes = {
  initialSetup: React.PropTypes.array.isRequired
};

export default App;
