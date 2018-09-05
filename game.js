const gameOfLife = {
  
  width: 12, 
  height: 12, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game
  state: {},
  createAndShowBoard: function () {
    
    // create <table> element
    let goltable = document.createElement("tbody");
    
    // build Table HTML
    let tablehtml = '';
    for (let h = 0; h < this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (let w = 0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;
    
    // add table to the #board element
    let board = document.getElementById('board');
    board.appendChild(goltable);
    
    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {
    /*
      Write forEachCell here. You will have to visit
      each cell on the board, call the "iteratorFunc" function,
      and pass into func, the cell and the cell's x & y
      coordinates. For example: iteratorFunc(cell, x, y)
    */
   for (let h = 0; h < this.height; h++) {
     for (let w = 0; w < this.width; w++) {
       let currCell = document.getElementById(`${w}-${h}`);
       iteratorFunc(currCell, w, h);
     }
   }
  },
  
  setupBoardEvents: function() {
    // each board cell has an CSS id in the format of: "x-y" 
    // where x is the x-coordinate and y the y-coordinate
    // use this fact to loop through all the ids and assign
    // them "click" events that allow a user to click on 
    // cells to setup the initial state of the game
    // before clicking "Step" or "Auto-Play"
    
    // clicking on a cell should toggle the cell between "alive" & "dead"
    // for ex: an "alive" cell be colored "blue", a dead cell could stay white
    
    // EXAMPLE FOR ONE CELL
    // Here is how we would catch a click event on just the 0-0 cell
    // You need to add the click event on EVERY cell on the board
    this.forEachCell((cell) => {
      gameOfLife.state[cell.id] = 0;
    });

    var onCellClick = function (e) {
      
      // QUESTION TO ASK YOURSELF: What is "this" equal to here?
      
      // how to set the style of the cell when it's clicked
      if (this.dataset.status == 'dead') {
        this.className = 'alive';
        this.dataset.status = 'alive';
        gameOfLife.state[this.id] = 1;
      } else {
        this.className = 'dead';
        this.dataset.status = 'dead';
        gameOfLife.state[this.id] = 0;
      }
      
    };
    //Another way to add event listener is to pass this variable into forEachCell
    // let addClickEvent = function(cell) {
    //   cell.addEventListener('click', onCellClick);
    // };
    this.forEachCell(function(cell) {
      cell.addEventListener('click', onCellClick);
    });

    let onClearClick = function (cell) {
      if (cell.dataset.status == 'alive') {
        cell.className = 'dead';
        cell.dataset.status = 'dead';
      }
    };

    //Add event listener to clear button to make all cells dead
    let clearBtn = document.getElementById('clear_btn');
    clearBtn.addEventListener('click', function() {
      gameOfLife.forEachCell(onClearClick);
    });

    let onRandomClick = function (cell) {
      let randomStatus = Math.random() > 0.5 ? 'alive' : 'dead';
      cell.className = randomStatus;
      cell.dataset.status = randomStatus;
    };

    let randomBtn = document.getElementById('reset_btn');
    randomBtn.addEventListener('click', function() {
      gameOfLife.forEachCell(onRandomClick);
    });

    let stepBtn = document.getElementById('step_btn');
    stepBtn.addEventListener('click', this.step);

    let playBtn = document.getElementById('play_btn');
    playBtn.addEventListener('click', this.enableAutoPlay);
  },

  step: function () {
    // Here is where you want to loop through all the cells
    // on the board and determine, based on it's neighbors,
    // whether the cell should be dead or alive in the next
    // evolution of the game. 
    //
    // You need to:
    // 1. Count alive neighbors for all cells
    // 2. Set the next state of all cells based on their alive neighbors
    let nextState = {};
    let checkNeighborStatus = function(cell, w, h) {
      let aliveNeighbors = 0;
      let prevCol = w > 0 ? w - 1 : w;
      let nextCol = w === gameOfLife.width - 1 ? w : w + 1;
      let prevRow = h > 0 ? h - 1 : h;
      let nextRow = h === gameOfLife.height - 1 ? h : h + 1;
      for (let i = prevCol; i <= nextCol; i++) {
        for (let j = prevRow; j <= nextRow; j++) {
          let currCell = document.getElementById(`${i}-${j}`);
          if (currCell.id !== cell.id) {
            if (currCell.dataset.status == 'alive') {
              aliveNeighbors++;
            }
          }
        }
      }
      if (cell.dataset.status == 'alive') {
        if(aliveNeighbors === 2 || aliveNeighbors === 3) {
          nextState[`${w}-${h}`] = 1;
        } else {
          nextState[`${w}-${h}`] = 0;
        }
      } else {
        if (aliveNeighbors === 3) {
          nextState[`${w}-${h}`] = 1;
        } else {
          nextState[`${w}-${h}`] = 0;
        }
      }
    }

    gameOfLife.forEachCell(checkNeighborStatus);
    gameOfLife.state = nextState;
    gameOfLife.forEachCell(function(cell, w, h) {
      if (gameOfLife.state[`${w}-${h}`]) {
        cell.className = 'alive';
        cell.dataset.status = 'alive';
      } else {
        cell.className = 'dead';
        cell.dataset.status = 'dead';
      }
    });

  },

  enableAutoPlay: function () {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
    let playBtn = document.getElementById('play_btn');
    if (this.stepInterval) {
      clearInterval(this.stepInterval);
      this.stepInterval = null;
      playBtn.innerHTML = 'Play';
    } else {
      playBtn.innerHTML = 'Stop';
      this.stepInterval = setInterval(() => gameOfLife.step(), 250);
    }
  }
};

gameOfLife.createAndShowBoard();
