import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const player1 = 'X';
const player2 = 'O';

function Square(props) {
    console.log(props);
      return (
        <button className="square"
        onClick={() => props.onClick()}
        style={
          props.highlight ? {backgroundColor:'red'} : {backgroundColor:'white'}
        }
        >
          {props.value}
        </button>
      );
  }
  
  class Board extends React.Component {
    renderSquare(i, highlightPosition) {
      return <Square value={this.props.squares[i]}
        onClick={()=>this.props.onClick(i)}
        highlight={highlightPosition} />;
    }

    createBoard = () =>  {
      console.log(this.props.highlight);
      let boardRows = [];
      for(let i = 0; i < 3; i ++) {
        boardRows.push(
            <div key={i} className="board-row">
              {this.renderSquare(i * 3 + 0, (i * 3 + 0) === this.props.highlight)}
              {this.renderSquare(i * 3 + 1, (i * 3 + 1) === this.props.highlight)}
              {this.renderSquare(i * 3 + 2, (i * 3 + 2) === this.props.highlight)}
            </div>
          )
      }

      return <div>{boardRows}</div>
    }
  
    render() {
      return (
        this.createBoard()
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{squares: Array(9).fill(null),}],
        xIsNext: true,
        stepNumber: 0,
        moveLocation: null,
      };
    }

    getCoordinateFromLocation(moveLocation) {
      for(let row = 0; row < 3; row++) {
        for(let col = 0; col < 3; col++) {
          if(moveLocation === row * 3 + col) {
            return "("+col+", "+row+")";
          }
        }
      }
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      if (calculateWinner(squares) || squares[i]) {
        return;
      }

      squares[i] = this.state.xIsNext ? player1: player2;
      this.setState(
        {
          history: history.concat([{squares: squares, moveLocation: i}]),
          xIsNext: !this.state.xIsNext,
          stepNumber: history.length,
        }
      );
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ? 'Go to move #' + move : 'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      let status;
      let lastMove;
      if(winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? player1 : player2);
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              highlight={current.moveLocation}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (let i = 0; i< lines.length; i++) {
          const [a,b,c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
          }
        }
        return null;
    }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
