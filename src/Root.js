import React from 'react';
import ReactDOM from 'react-dom';
import config from './config/config';
import App from './components/App';
require('./assets/styles/main.scss');

ReactDOM.render(<App initialSetup={config.initialSetup} />, document.getElementById('root'));
