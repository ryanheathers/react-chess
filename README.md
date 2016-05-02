# React Chess
This is a lightweight chess app built with React.js. Currently you can only play against yourself (useful I know!) but in the near future I will look at adding Websocket support so two humans could play remotely. No intention of integrating an AI, probably ever.

The project originated as a code challenge so the chess engine is my own creation built entirely from scratch. That means all logic mistakes are entirely my doing. :) There is an [open-source chess engine](https://github.com/jhlywa/chess.js) that seems well-regarded if you're looking for a drop-in engine.

*Currently the app has one key limitation - no support for check/checkmate/stalemate.* Obvious that kinda...defeats...the gameplay. Looking to add that feature shortly!

## To run the app
`Git clone` the repo to your computer. Run `npm install` to get all the dependencies and then type `npm start` to fire up the webpack-dev-server. Navigate to `localhost:4000` to see the app.

Once I have Websocket support built-in, I'll host the app somewhere on the interwebs.

## Browser support
Built with Flexbox and no polyfill currently so only so-called modern browsers can run this.
