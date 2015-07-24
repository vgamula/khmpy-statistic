/* global React, io */

var Row = React.createClass({
    render() {
        var obj = this.props.obj;
        return (
            <li>
                <h4>{obj.title}</h4>
                <p>+: {obj.plus}</p>
                <p>-: {obj.minus}</p>
                <p>all: {obj.amount}</p>
                <button onClick={this.vote}>Vote</button>
                <hr />
            </li>
        );
    },
    vote: function() {
        this.props.socket.emit('vote', this.props.obj.id);
    }
});

var App = React.createClass({
    getInitialState: function() {
        return {};
    },
    render: function() {
        var self = this;
        return (
            <div>
                <p>Topics list!</p>
                <ul>
                    {this.state.data && this.state.data.map(function(obj) {
                        return <Row obj={obj} socket={self.socket} />;
                    })}
                </ul>
            </div>
        );
    },
    componentDidMount: function() {
        var self = this;
        this.socket = io();
        this.socket.on('data', function(data) {
            console.log(data);
            self.setState({
                data: data
            });
        });
    }
});

React.render(<App />, document.getElementById('app'));