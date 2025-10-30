const board = document.getElementById("board");

let game = {
  turn: "white",
  selected: null,
  squares: []
};

// Unicode das peças
const pieces = {
  white: ["♖","♘","♗","♕","♔","♗","♘","♖"],
  black: ["♜","♞","♝","♛","♚","♝","♞","♜"]
};

// Cria tabuleiro e coloca peças
function initBoard() {
  board.innerHTML = "";
  game.squares = [];
  for (let r = 0; r < 8; r++) {
    let row = [];
    for (let c = 0; c < 8; c++) {
      const square = document.createElement("div");
      square.className = "square " + ((r + c) % 2 ? "dark" : "light");
      square.dataset.row = r;
      square.dataset.col = c;

      // Peças iniciais
      if (r === 0) square.textContent = pieces.black[c];
      else if (r === 1) square.textContent = "♟";
      else if (r === 6) square.textContent = "♙";
      else if (r === 7) square.textContent = pieces.white[c];
      else square.textContent = "";

      square.addEventListener("click", handleClick);
      board.appendChild(square);
      row.push(square);
    }
    game.squares.push(row);
  }
}

function handleClick(e) {
  const square = e.target;
  const r = +square.dataset.row;
  const c = +square.dataset.col;
  const piece = square.textContent;

  if (game.selected) {
    // tentar mover
    const valid = validMove(game.selected, {r, c});
    clearHighlights();

    if (valid) {
      const from = game.squares[game.selected.r][game.selected.c];
      const to = game.squares[r][c];
      to.textContent = from.textContent;
      from.textContent = "";
      game.turn = game.turn === "white" ? "black" : "white";
    }
    game.selected = null;
  } else {
    // selecionar peça
    if (isTurn(piece)) {
      game.selected = {r, c};
      square.classList.add("highlight");
    }
  }
}

function clearHighlights() {
  document.querySelectorAll(".highlight").forEach(s => s.classList.remove("highlight"));
}

function isTurn(piece) {
  if (!piece) return false;
  const whitePieces = "♔♕♖♗♘♙";
  return game.turn === "white" ? whitePieces.includes(piece) : !whitePieces.includes(piece);
}

// Regras básicas de movimento
function validMove(from, to) {
  const piece = game.squares[from.r][from.c].textContent;
  const dr = to.r - from.r;
  const dc = to.c - from.c;
  const absR = Math.abs(dr);
  const absC = Math.abs(dc);
  const dest = game.squares[to.r][to.c].textContent;

  const isWhite = "♔♕♖♗♘♙".includes(piece);
  const dir = isWhite ? -1 : 1;

  // Peão
  if (piece === "♙" || piece === "♟") {
    if (dc === 0 && !dest) {
      if (dr === dir) return true;
      if ((from.r === 6 && isWhite && dr === -2 && !game.squares[from.r-1][from.c].textContent) ||
          (from.r === 1 && !isWhite && dr === 2 && !game.squares[from.r+1][from.c].textContent)) return true;
    }
    if (absC === 1 && dr === dir && dest && isOpponent(dest, isWhite)) return true;
  }

  // Torre
  if (piece === "♖" || piece === "♜") {
    if (dr === 0 || dc === 0) return clearPath(from, to) && (!dest || isOpponent(dest, isWhite));
  }

  // Bispo
  if (piece === "♗" || piece === "♝") {
    if (absR === absC) return clearPath(from, to) && (!dest || isOpponent(dest, isWhite));
  }

  // Dama
  if (piece === "♕" || piece === "♛") {
    if ((absR === absC || dr === 0 || dc === 0)) return clearPath(from, to) && (!dest || isOpponent(dest, isWhite));
  }

  // Rei
  if (piece === "♔" || piece === "♚") {
    if (absR <= 1 && absC <= 1) return !dest || isOpponent(dest, isWhite);
  }

  // Cavalo
  if (piece === "♘" || piece === "♞") {
    if ((absR === 2 && absC === 1) || (absR === 1 && absC === 2)) return !dest || isOpponent(dest, isWhite);
  }

  return false;
}

function clearPath(from, to) {
  const stepR = Math.sign(to.r - from.r);
  const stepC = Math.sign(to.c - from.c);
  let r = from.r + stepR, c = from.c + stepC;
  while (r !== to.r || c !== to.c) {
    if (game.squares[r][c].textContent) return false;
    r += stepR; c += stepC;
  }
  return true;
}

function isOpponent(piece, isWhite) {
  const whites = "♔♕♖♗♘♙";
  return isWhite ? !whites.includes(piece) : whites.includes(piece);
}

initBoard();
