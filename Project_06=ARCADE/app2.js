
//initalize the game
let gameState = {}

const board = () => (
    [
        ['','','','','','','','','','','',''],
        ['','','','','','','','','','','',''],
        ['','','','','','','','','','','',''],
        ['','','','','','','','','','','',''],
        ['','','','','','','','','','','',''],
        ['','','','','','','','','','','',''],
        ['','','','','','','','','','','',''],
        ['','','','','','','','','','','',''],
        ['','','','','','','','','','','',''],
        ['','','','','','','','','','','',''],
        ['','','','','','','','','','','',''],
        ['','','','','','','','','','','','']

    ]
);

const PLAYING = 'PLAYING';
const GAME_OVER = 'GAME_OVER';
const NEW = 'NEW';

const LEFT = 'ArrowLeft';
const DOWN = 'ArrowDown';
const RIGHT = 'ArrowRight';
const UP = 'ArrowUp';

let lastRenderTime = 0;
let snakeSpeed = 300;


function buildInitialState() {
    gameState.snake = {
            body:[
                [10,5],
                [10,6], 
                [10,7], 
                [10,8],
            ],
            nextDirection:[0,-1],
    };
    gameState.board = board();
    gameState.apple = [11,8];
    gameState.phase = "NEW";
    gameState.speed = 300;
    gameState.interval = null;
};

const addSnakeToBoard = () => {
    gameState.snake.body.map(([y, x]) => {
        gameState.board[y][x] ='snake';
    })
}; 

const addAppleToBoard = () => {
const [y, x] = gameState.apple ;
gameState.board[y][x] = 'apple';
};

const updateBoard = () => { 
    gameState.board = board(); 
    addSnakeToBoard();
    addAppleToBoard();
};

const emptyElement = (nodeToEmpty) => {
    while(nodeToEmpty.firstchild) {
        nodeToEmpty.removeChild(nodeToEmpty.firstchild)
    }
};

function renderPrompt() {
    const prompt  = document.querySelector('#prompt');
    let html;
    switch (gameState.phase){
        case PLAYING:
            prompt.classList.remove('game-over');
            html = `Score: ${gameState.snake.body.length}`;
            break;
        case GAME_OVER:
            prompt.classList.add('game-over');
            html = `Game Over!!! Total Score: ${gameState.snake.body.length} <button class="start-game">Play Again?</button>`;
            break;
        case NEW: 
            html = `Welcome 2 Laurens Hungry Snake!!! LET'S PLAY!!! <button class="start-game">Start</button>`;
            break;
        default:
            html = `Welcome 2 Laurens Hungry Snake!!! LET'S PLAY!!! <button class="start-game">Start</button>`;
    }

    prompt.innerHTML = html; 
};

 function renderBoard() {
    const boardElem = document.querySelector('#board');
    console.log('board', boardElem);

    
    emptyElement(boardElem);
        for(let y=0; y < gameState.board.length; y++){
            const row = gameState.board[y];
            console.log('row')
            for (let x = 0; x < row.length; x++){
                console.log('column')
                const cellElem = document.createElement('div');
                cellElem.classList.add('cell');
                const itemInCell = gameState.board[y][x];
                if(itemInCell) cellElem.classList.add(itemInCell);
                cellElem.dataset.coordinates = `${y}, ${x}`;

                boardElem.appendChild(cellElem);
          }
      }
  };

  const getRandomBoardIndex = (boardSize = 12) => {
    console.log( 'getRandomBoardIndex', Math.floor(Math.random() * boardSize));
    return Math.floor(Math.random() * boardSize);
  };

  const moveApple = () => {
    const x = getRandomBoardIndex();
    const y=  getRandomBoardIndex();

    gameState.apple = [y, x];
  };

  const turnSnake = (direction) => {
      if(direction === LEFT) gameState.snake.direction = [0, -1];
      else if(direction === RIGHT) gameState.snake.direction = [0, 1];
      else if(direction === UP) gameState.snake.direction = [-1, 0];
      else if(direction === DOWN) gameState.snake.direction = [1, 0];
  };

  const eatApple = () => {
    if(!gameState.snake.body.length % 5) gameState.speed *= 0.50;
    console.log("Snake Speed", gameState.snake.speed);
    moveApple();
    addAndRenderAll();
};

const moveSnake = () => {
    const [y, x] = gameState.snake.body[0];
    const segmentToAdd = [y + gameState.snake.nextDirection[0], x + gameState.snake.nextDirection[1]];
    if([undefined, 'snake'].includes(gameState.board[segmentToAdd[0]][segmentToAdd[1]])) {
        changePhaseTo(GAME_OVER);
    } else {
        if(gameState.board[segmentToAdd[0]][segmentToAdd[1]] === 'apple') {
            eatApple();
        } else {
            gameState.snake.body.pop();
        }
        gameState.snake.body.unshift(segmentToAdd);
    }
    console.log('snake', gameState.snake.body)
}; 

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
};

function tick() {
    moveSnake();
    addAndRenderAll();
};

const addAndRenderAll = () => {
    updateBoard();
    renderPrompt();
    renderBoard();
};

const addListeners = () => {
    const prompt = document.querySelector('#prompt');
    prompt.addEventListener('click', function({target}){
        if(target.className !== 'start-game') return;
        buildInitialState();
        changePhaseTo(PLAYING);
        addAndRenderAll();
    })
    document.onkeydown = function(event) {
        if(![LEFT, RIGHT, UP, DOWN].includes(event.key)) reuturn;
        turnSnake(event.key); 
    }
};

buildInitialState();
addAndRenderAll();
addListeners();






//const moveApple = () => {
  //   snake =[[  10, 8]] ;     

//buildInitialState();
//renderBoard();

/*function main(currentTime){
    window.requestAnimationFrame(main)
    let secondsSinceLastRendered = (currentTime - lastRenderTime)/ 100;
    if (secondsSinceLastRendered < 1 / snakeSpeed) return 
    window.requestAnimationFrame(main)
    
    console.log('Render')
    lastRenderTime = currentTime 
}
*/