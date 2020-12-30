import React, { useState, useEffect } from "react";
import "./styles.css";
import Dialog from "./dialog";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

let InitialCoordinates = [
  { x: 550, y: 250 },
  { x: 560, y: 250 },
  { x: 570, y: 250 },
  { x: 580, y: 250 },
  { x: 590, y: 250 },
  { x: 600, y: 250 },
  { x: 610, y: 250 }
];

const foodCoordinates = {
  xCord: 400,
  yCord: 100
};
const App = () => {
  const [coordinates, setcoordinates] = useState(InitialCoordinates);
  const [currentDirection, setCurrentDirection] = useState("right");
  const [gameOver, setGameOver] = useState(false);
  const [foodCoordinate, setfoodCoordinate] = useState(foodCoordinates);
  const [increasedLength, setIncresedLength] = useState(false);
  const [score, setscore] = useState(0);
  const [showDialog, setshowDialog] = useState(false);
  const [showRestartButton, setshowRestartButton] = useState(false);

  const speed = 50;

  const handleClickOpen = () => {
    setshowDialog(true);
  };

  const handleClose = () => {
    setshowDialog(false);
  };

  const handleKeyDown = (event) => {
    if (
      (currentDirection === "left" && event.keyCode === 39) ||
      (currentDirection === "right" && event.keyCode === 37) ||
      (currentDirection === "up" && event.keyCode === 40) ||
      (currentDirection === "down" && event.keyCode === 38)
    )
      return;
    if (event.keyCode === 37) {
      setCurrentDirection("left");
    } else if (event.keyCode === 38) {
      setCurrentDirection("up");
    } else if (event.keyCode === 39) {
      setCurrentDirection("right");
    } else if (event.keyCode === 40) {
      setCurrentDirection("down");
    }
  };
  const gameoverFn = () => {
    setGameOver(true);
    setshowDialog(true);
    setshowRestartButton(true);
  };

  const headCollison = () => {
    for (let i = 0; i < coordinates.length - 1; i++) {
      if (
        coordinates[coordinates.length - 1].x === coordinates[i].x &&
        coordinates[coordinates.length - 1].y === coordinates[i].y
      ) {
        gameoverFn();
      }
    }
  };

  const moveSnakeinParticularDirection = () => {
    if (gameOver) return;
    if (currentDirection === "left") moveSnake(-10, 0);
    else if (currentDirection === "right") moveSnake(10, 0);
    else if (currentDirection === "up") moveSnake(0, -10);
    else if (currentDirection === "down") moveSnake(0, 10);
    boundaryCheck();
    isFoodEaten();
    headCollison();
  };

  const moveSnake = (xCoordinateChange, yCoordinateChange) => {
    setTimeout(() => {
      let coordinatesCopy = [...coordinates];
      if (!increasedLength) coordinatesCopy.shift();
      coordinatesCopy.push({
        x: coordinatesCopy[coordinatesCopy.length - 1].x + xCoordinateChange,
        y: coordinatesCopy[coordinatesCopy.length - 1].y + yCoordinateChange
      });
      setcoordinates(coordinatesCopy);
    }, speed);
  };

  const boundaryCheck = () => {
    if (
      coordinates[coordinates.length - 1].y > 480 ||
      coordinates[coordinates.length - 1].y < 50 ||
      coordinates[coordinates.length - 1].x < 250 ||
      coordinates[coordinates.length - 1].x > 1030
    ) {
      gameoverFn();
    }
  };

  const generateFood = () => {
    setIncresedLength(false);
    let xCord = Math.round(foodInRange(1020, 260));
    let yCord = Math.round(foodInRange(470, 60));
    const pointForFood = {
      xCord,
      yCord
    };
    setfoodCoordinate(pointForFood);
    console.log("FOOD GENERATED", xCord, yCord);
    setscore(score + 10);
  };

  const foodInRange = (max, min) => {
    let val = Math.round(Math.random() * (max - min) + min);
    let rem = 10 - (val % 10);
    val += rem;
    return val;
  };

  const handleRestart = () => {
    setscore(0);
    setcoordinates(InitialCoordinates);
    setfoodCoordinate(foodCoordinates);
    setshowRestartButton(false);
    setGameOver(false);
  };

  const isFoodEaten = () => {
    if (
      coordinates[coordinates.length - 1].x === foodCoordinate.xCord &&
      coordinates[coordinates.length - 1].y === foodCoordinate.yCord
    ) {
      setIncresedLength(true);
      setTimeout(() => {
        generateFood();
      }, speed);
    }
  };

  useEffect(() => {
    moveSnakeinParticularDirection();
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [coordinates]);
  return (
    <div>
      <div className="score">Score: {score}</div>
      <div className="gameContainer">
        {coordinates.map((coordinate) => (
          <span
            className="snakeBlock"
            style={{ left: `${coordinate.x}px`, top: `${coordinate.y}px` }}
          ></span>
        ))}
        <span
          className="food"
          style={{
            left: `${foodCoordinate.xCord}px`,
            top: `${foodCoordinate.yCord}px`
          }}
        ></span>
      </div>
      <Dialog
        showDialog={showDialog}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        score={score}
      />
      {showRestartButton ? (
        <div className="score">
          <Button variant="primary" size="lg" active onClick={handleRestart}>
            Restart
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
