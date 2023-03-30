// state
let gameState = {};

const board = () => ([
  ['', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', ''],
]);


const PLAYING = 'PLAYING';
const GAME_OVER = 'GAME_OVER';
const NEW = 'NEW';

const LEFT = 'ArrowLeft';

const RIGHT = 'ArrowRight';
const UP = 'ArrowUp';
const DOWN = 'ArrowDown';



function buildInitialState() {

    gameState.snake = {
        body: [ 
         [10, 5],
         [10, 6], 
         [10, 7], 
         [10, 8] ],
    
            nextDirection: [0, -1]
    };



  gameState.apple = [11, 8];
  gameState.board = board();
  gameState.phase = NEW;

  gameState.speed = 150;
  gameState.interval = null;


}

const addSnakeToBoard = () => {
  gameState.snake.body.map(([y, x]) => {
    gameState.board[y][x] = 'snake';
  })

}

const addAppleToBoard = () => {
   const [y, x] = gameState.apple;
      gameState.board[y][x] = 'apple';
}

  const updateBoard = () => {
  gameState.board = board();
  addSnakeToBoard();
  addAppleToBoard();
  
  console.log('updated board')
   
}

const emptyElement = (nodeToEmpty) => {
  while (nodeToEmpty.firstChild) {
    nodeToEmpty.removeChild(nodeToEmpty.firstChild);
  }
}

function renderPrompt() {
  const prompt = document.querySelector('#prompt');
  let html;
  switch (gameState.phase) {

    case PLAYING:
      prompt.classList.remove('game-over');
      html = `Score: ${gameState.snake.body.length}`;
      break;

      case GAME_OVER:
      prompt.classList.add('game-over');
      html = `Game Over! Total Score: ${gameState.snake.body.length} <button class="start-game">Play Again</button>`;
      break;

      case NEW:
      html = `Welcome 2 Lauren's Hungry Snake... __  LET'S PLAY!!! <button class="start-game">START</button>`;
      break;

      default:
      html = `Welcome 2 Lauren's Hungry Snake... __  LET'S PLAY!!! <button class="start-game">START</button>`;

    }

  prompt.innerHTML = html;

}


function renderBoard() {
  const boardElem = document.querySelector('#board');
  emptyElement(boardElem);
  for (let y = 0; y < gameState.board.length; ++y){
      const row = gameState.board[y];
      for (let x = 0; x < row.length; ++x){
          const cellElem = document.createElement('div');
          cellElem.classList.add('cell');
          const itemInCell = gameState.board[y][x];
          if(itemInCell) cellElem.classList.add(itemInCell);
          cellElem.dataset.coordinates = `${y},${x}`;
          boardElem.appendChild(cellElem);
      }
  }
}


const getRandomBoardIndex = (boardSize = 12) => {
  return Math.floor(Math.random() * boardSize);
}


const moveApple = () => {
  const y = getRandomBoardIndex();
  const x = getRandomBoardIndex();
  gameState.apple = [y, x];
}

const turnSnake = (direction) => {
  if (direction === LEFT) gameState.snake.nextDirection = [0, -1];
  else if (direction === RIGHT) gameState.snake.nextDirection = [0, 1];
  else if (direction === UP) gameState.snake.nextDirection = [-1, 0];
  else if (direction === DOWN) gameState.snake.nextDirection = [1, 0];
}

const eatApple = () => {
  if (!gameState.snake.body.length % 5) gameState.speed *= 0.70;
  moveApple();
  addAndRenderAll();

}

const changePhaseTo = (phase) => {
  gameState.phase = phase;

  switch (phase) {

    case PLAYING:
    gameState.interval = setInterval(tick, gameState.speed);
      break;

      case GAME_OVER:
      clearInterval(gameState.interval);
      break;

      default:
      clearInterval(gameState.interval);
  }
}

const moveSnake = () => {
  const [y, x] = gameState.snake.body[0];
  const segmentToAdd = [y + gameState.snake.nextDirection[0], x + gameState.snake.nextDirection[1]];
  if ([undefined, 'snake'].includes(gameState.board[segmentToAdd[0]][segmentToAdd[1]])) {
    changePhaseTo(GAME_OVER);
  } else {

    if(gameState.board[segmentToAdd[0]][segmentToAdd[1]] === 'apple') {
      eatApple();
    } else {

      gameState.snake.body.pop();
    }

    gameState.snake.body.unshift(segmentToAdd);

}
console.log('snake moved')
}

const addAndRenderAll = () => {
  updateBoard();

  renderPrompt();
  renderBoard();

}




function tick(){
  moveSnake();
  addAndRenderAll();
  console.log("tick", tick)
}


const prompt = document.querySelector('#prompt');
prompt.addEventListener('click', function({target}){
  if(target.className !== 'start-game') return;
  buildInitialState();
  changePhaseTo(PLAYING);
 
  addAndRenderAll();
})


document.onkeydown = function(event) {
  event.preventDefault();
  // prevent unnecessary/unwanted functionality on other keys
  if (![LEFT, RIGHT, UP, DOWN].includes(event.key)) return;
  turnSnake(event.key);
};

buildInitialState();
addAndRenderAll();