# React Chess
This is a lightweight chess game built with React.js. Currently you can only play against yourself (useful I know!) but in the near future I will look at adding Websocket support so two humans could play remotely. No intention of integrating an AI, probably ever.

The project originated as a code challenge so the chess engine is my own creation built entirely from scratch. That means all logic mistakes are entirely my doing. :) There is an [open-source chess engine](https://github.com/jhlywa/chess.js) that seems well-regarded if you're looking for a drop-in engine.

*Currently the game has one key limitation - no support for check/checkmate/stalemate.* Obvious that kinda...defeats...the gameplay. Looking to add that feature shortly!

## To run the game
`Git clone` the repo to your computer. Run `npm install` to get all the dependencies and then type `npm start` to fire up the webpack-dev-server. Navigate to `localhost:4000` to see the game.

You can see a somewhat-outdated version of the game at this Codepen: http://codepen.io/ryanheathers/full/jqxPJW/

Once I have Websocket support built-in, I'll host the game somewhere on the interwebs.

## Browser support
Built with Flexbox and currently not using a polyfill so only so-called modern browsers can run this.
