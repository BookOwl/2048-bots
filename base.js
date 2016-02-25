(function(){
"use strict"

const a = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager)
const UP=0, RIGHT=1, DOWN=2, LEFT=3
const MOVES = [UP, RIGHT, DOWN, LEFT]

let rand = (min, max) => Math.floor(Math.random() * (max - min) + min)

let getRandMove = () => MOVES[rand(0, MOVES.length)]

let getSimpleGrid = (game) => {
  let cells = [ [], [], [], [] ]
  let cell;
  for (let x = 0; x < 4; x++){
    for (let y = 0; y < 4; y++){
      cell = game.grid.cells[y][x]
      cells[x][y] = cell ? cell.value : 0
    }
  }
  return cells
}

let copyGrid = (grid) => grid.map(row => row.slice(0, row.length))

let withinBounds = (cell) => cell.x > -1 && cell.x < 4 && cell.y > -1 && cell.y < 4

let without0 = (row) => row.filter(c => c != 0)

let count0 = (grid) => grid.map(row => row.filter(c => c == 0).length).reduce((x, y) => x + y)

let max = (nums) => {
  let res = [], max = -1;
  for (let i = 0; i < nums.length; i++){
    if (nums[i] == max){
      res.push(i)
    }
    else if (nums[i] > max){
      res = [i]
      max = nums[i]
    }
  }
  return res
}

let rightpad = (row) => {
  let numneeded = 4 - row.length
  let ext = []
  for (let i = 0; i < numneeded; i++) ext.push(0)
  return row.concat(ext)
}

let zip = (lists) => {
  let res = []
  for (let i = 0; i < lists[0].length; i++){
    let row = []
    for (let j = 0; j < lists.length; j++){
      row.push(lists[j][i])
    }
    res.push(row)
  }
  return res
}

let rotate = (grid) => {
  grid = grid.slice(0, grid.length)
  grid.reverse()
  return zip(grid)
}

let mergeRow = (row) => {
  let res = [];
  row = row.slice(0,4).reverse()
  while (row.length) {
    if (row.length == 1){
      res.push(row.pop())
      break
    }
    let a = row.pop()
    let b = row.pop()
    if (a == b) {
      res.push(a+b)
    }
    else {
      res.push(a)
      row.push(b)
    }
  }
  return res
}

let runall = (funcs, val) => {
  for (let func of funcs) {
    val = func(val)
  }
  return val
}

let move = (grid) => grid.map(row => rightpad(mergeRow(without0(row))))

let moveGrid = (grid, dir) => {
  switch (dir) {
    case UP:
      return runall([rotate, rotate, rotate, (grid => move(grid)), rotate], grid)
    case LEFT:
      return move(grid)
    case DOWN:
      return runall([rotate, (grid => move(grid)), rotate, rotate, rotate], grid)
    case RIGHT:
      return runall([rotate, rotate, (grid => move(grid)), rotate, rotate], grid)
  }
}

let printGrid = (grid) => {
   grid.forEach(row => console.log(row))
   console.log("")
 }

let makeMove = () => {
  let move = getRandMove() //Replace this with move selection logic
  a.move(move)
  setTimeout(makeMove, 50)
}

makeMove()
})()
