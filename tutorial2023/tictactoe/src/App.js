// 最初にReactをインポートする
import React from 'react';
// 状態を保存する機能をインポート
import { useState } from 'react';

// --------
// 正方形を表示
function Square({ value, onSquareClick, isWinner }) {
  // 改善４：勝利を引き起こした正方形を強調表示する
  const className = isWinner ? 'highlighted-square' : 'square';
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

// --------
// 3x3の盤面を表示する
function Board({ xIsNext, squares, onPlay, stepNumber }) {
  const nextPlayer = xIsNext ? "X" : "O";
  const winner = calculateWinner(squares);
  const status = winner ? "Winner: " + squares[winner[0]] 
    : stepNumber === 9 ? "Draw" // 改善４：引き分け
    : "Next player: " + nextPlayer;

  // クリックした時の動き
  function handleClick(i) {
    // 上書きの禁止
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    // 配列のコピー
    const nextSquares = squares.slice();
    // OかXを設定
    nextSquares[i] = nextPlayer;
    // 状態を更新
    onPlay(nextSquares, i);
  }

  // 改善２：ループを使って盤面を描画する
  const board = [];
  for (let y = 0; y < 3; y++) {
    const line = [];
    for (let x = 0; x < 3; x++) {
      const i = y * 3 + x;
      const isWinner = winner ? winner.includes(i) : false;
      line.push(
        <Square key={i} 
          value={squares[i]} 
          onSquareClick={() => handleClick(i)} 
          isWinner={isWinner}/>
      );
    }
    board.push(<div key={y} className="board-row">{line}</div>);
  }

  return (
    <div>
      <div className="status">{status}</div>
      {board}
    </div>
  );
}

// --------
// ゲーム本体
// exportはこの関数をファイルの外部から呼び出せるようにする。
// defaultはこのファイルのメイン機能であることを示す。
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  // 改善３：履歴の表示順を切り替える
  const [order, setOrder] = useState(true);
  // 改善５：移動履歴の場所を表示する
  const [pos, setPos] = useState([]);

  // 一手指したときの動作
  function handlePlay(nextSquares, nextIndex) {
    // ...はすべての項目を列挙するスプレット構文
    // 今までのhistoryをすべて列挙した上でnextSquaresを追加した配列をhistoryに設定する
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    // 改善５：移動履歴の場所を表示する
    const nextPos = [...pos.slice(0, currentMove + 1), nextIndex];
    setPos(nextPos);
  }

  // 履歴ジャンプボタンを表示する
  // mapはhistoryを指定した関数によって変換する操作
  // hisotryのelementをsquares、indexをmoveとして取り出す
  const moves = history.map((squares, move) => {
    // 改善５：移動履歴の場所を表示する
    const dispPos = "(" + pos[move - 1] % 3 + "," + Math.floor(pos[move - 1] / 3) + ")";
    // 改善１：現在の位置を表示
    const description = move === 0 ? 'Go to game start'
      : currentMove === move ? 'You are at move #' + move + dispPos
      : 'Go to move #' + move + dispPos;
    // ジャンプボタンを表示
    return (
      <li key={move}>
        <button onClick={() => setCurrentMove(move)}>{description}</button>
      </li>
    );
  });

  // 並び順変更ボタンの表示
  const displayOrder = 'Change history in ' + (order ? 'Reverse order' : 'Forward order');

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} stepNumber={currentMove} />
      </div>
      <div className="game-info">
        <div>
          <button onClick={() => setOrder(!order)}>{displayOrder}</button>
        </div>
        <ol>{order ? moves : moves.reverse() }</ol>
      </div>
    </div>
  );
}

// --------
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
    [2, 4, 6]
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
