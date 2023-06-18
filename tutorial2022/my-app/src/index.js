// https://ja.reactjs.org/tutorial/tutorial.html

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 正方形
function Square(props) {
  const className = props.isWinner ? 'highlighted-square' : 'square';
  return (
    // ボタンのonClickにprops.onClick()を呼び出す関数を設定
    // props.onClick()の中身はBoard.renderSquare()にて設定
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// 盤面
class Board extends React.Component {
  // 正方形の描画
  renderSquare(i) {
    const isWinner = this.props.winners ? this.props.winners.includes(i) : false;
    // Square.props.onClickにBoard.handleClick(i)を呼び出す関数を設定
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        isWinner={isWinner}
        onClick={ () => this.props.onClick(i) }
      />
    );
  }

  // 描画
  render() {
    // ループでマス目を並べる
    const height = 3;
    const width = 3;
    let boardRow = [];
    for (let y = 0; y < height; y++) {
      let boardCol = [];
      for (let x = 0; x < width; x++) {
        boardCol.push(this.renderSquare(y * width + x));
      }
      boardRow.push(<div key={y} className="board-row">{boardCol}</div>);
    }
    return (
      <div>
        {boardRow}
      </div>
    );
  }
}

// ゲーム本体
class Game extends React.Component {
  // コンストラクタ
  constructor(props) {
    super(props);
    this.state = {
      // 履歴
      history: [{
        // 盤面の状態：９個の配列をnullで初期化
        squares: Array(9).fill(null),
      }],
      // 何手目か
      stepNumber: 0,
      // 先手後手：trueならXが次の番
      xIsNext: true,
      // 履歴の表示順：trueなら昇順
      order: true,
    };
  }
  // クリックした時の動作
  handleClick(i) {
    // 時間を巻き戻した場合、その時点までの履歴を取得（巻き戻してなければ履歴全体を取得）
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // 最新の履歴より現在の盤面を取得
    const current = history[history.length - 1];
    // slice:配列の部分コピー、引数なしで全コピー
    const squares = current.squares.slice();
    // 勝敗が決着しているか、クリックした箇所が既に埋まっている場合は何もしない
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // クリックしたマスに'X'または'O'を設定
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // 状態を更新
    this.setState({
      // 末尾に新しい盤面を追加
      history: history.concat([{
        squares: squares,
        col: i % 3,
        row: Math.floor(i / 3),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  // 履歴にジャンプ
  jumpTo(step) {
    this.setState({
      // historyは指定しなければ更新しない
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  // 履歴の表示順を変更
  changeOrder() {
    this.setState({
      order: !this.state.order,
    });
  }
  // 描画
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // 履歴の配列に対してmapを使って関数を適用する。
    // 関数の引数は、１番目が配列の要素、２番目が配列のindex
    let moves = history.map((step, move) => {
      // ボタンに表示する文言
      const desc = move ? 'Go to move #' + move + '(' + step.col + ',' + step.row + ')'
                        : 'Go to game start';
      // 現在洗濯中のボタンの文字を太字にする
      const weight = (step === current) ? 'bold' : 'normal';
      // 配列の要素１つにつき<li><button>を返す
      return (
        // 動的なリストを構築するためkeyを指定（keyはReact独自のプロパティ）
        <li key={move}>
          <button
           style={{fontWeight: weight}}
           onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    // 表示順が逆の時、履歴を逆に表示する
    if (!this.state.order) {
      moves = moves.reverse();
    }

    // 状態の表示
    const status = winner ? 'Winner: ' + current.squares[winner[0]]
      : this.state.stepNumber === 9 ? 'Draw'
      : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    const order = 'Change history in ' + 
      (this.state.order ? 'Reverse order' : 'Forward order');
    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winners={winner}
            onClick={ (i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.changeOrder()}>{order}</button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================
// エントリポイント
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// 勝者を判定
function calculateWinner(squares) {
  // 縦横斜めのライン
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // 同じものが３つ並んでいたら、並んでいるものを返す
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
