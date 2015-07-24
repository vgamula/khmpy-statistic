/* global React, io, Chart */

var Row = React.createClass({
    render() {
        var obj = this.props.obj;
        var buttonText = 'Up vote';
        if (obj.vote === 'plus') {
            buttonText = 'Down vote'
        }
        return (
            <li>
                <h4>{obj.title}</h4>
                <p>+: {obj.plus}</p>
                <p>-: {obj.minus}</p>
                <p>all: {obj.amount}</p>
                <button onClick={this.vote}>{buttonText}</button>
                {obj.vote && (
                    <button onClick={this.deleteVote}>Delete vote</button>
                )}
                <canvas ref="canvas" width="100" height="100"></canvas>
                <hr />
            </li>
        );
    },
    renderDiagram() {
        var obj = this.props.obj;
        if (obj.amount === 0) {
            return;
        }
        // debugger;
        var ctx = this.refs.canvas.getDOMNode().getContext("2d");
        var data = [
            {
                value: obj.plus,
                color: '#d1192b',
                label: 'Plus'
            },
            {
                value: obj.minus,
                color: '#4d53fa',
                label: 'Minus'
            }
        ];
        var myPieChart = new Chart(ctx).Pie(data, {});
    },
    componentDidMount() {
        this.renderDiagram();
    },
    componentDidUpdate() {
        this.renderDiagram();
    },
    vote: function() {
        this.props.socket.emit('vote', this.props.obj.id);
    },
    deleteVote: function() {
        this.props.socket.emit('deleteVote', this.props.obj.id);
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
            self.setState({
                data: data
            });
        });
    }
});

React.render(<App />, document.getElementById('app'));