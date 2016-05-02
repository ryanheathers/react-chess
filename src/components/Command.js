import React from 'react';

class Command extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({value: e.target.value});
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.handleCommand(this.state.value);
    this.setState({value: ''});
  }
  render() {
    return (
      <div className="command-form">
      <h3>To Make a Move:</h3>
      <p>Click on the desired piece and then click on the destination tile.</p>
      <p>Alternatively, you can enter a chess notation command below.</p>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <button type="submit">Enter Command</button>
        </form>
        <p>Example Command: <b>'wh1c3'</b> moves White's Horse #1 (Knight) to tile C3</p>
      </div>
    );
  }
}

Command.propTypes = {
  handleCommand: React.PropTypes.func.isRequired
};

export default Command;
