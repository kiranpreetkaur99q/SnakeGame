let canvas;
let brush;
let foods = [];
let rectangle;
let move;
let obstacle;
let score = 0;
let hurdles = []; // it is total score
let myKeys = {
    // tracking the arrow keys
    up: false,
    down: false,
    left: false,
    right: false
};
let bodyElem = document.getElementById("body");

bodyElem.addEventListener("keydown", function (event) {


    if (event.key === "ArrowUp") {
        myKeys.up = true;
    }

    if (event.key === "ArrowDown") {
        myKeys.down = true;
    }

    if (event.key === "ArrowLeft") {
        myKeys.left = true;
    }

    if (event.key === "ArrowRight") {
        myKeys.right = true;
    }
}
);

function Setup() {
    canvas = document.getElementById("myCanvas");
    brush = canvas.getContext("2d");
    startGame();

}

window.onload = Setup;





function ClearCanvas() {
    brush.clearRect(0, 0, canvas.width, canvas.height);
}
function DrawRect(x, y, width, height, color) {
    brush.fillStyle = color;
    brush.fillRect(x, y, width, height);
}


function DrawLine(x1, y1, x2, y2, color) {
    // x1,y1 are coordinates of the first point
    // x2,y2 are coordinates of the second point
    // this function draws a straight line between first and second points
    brush.beginPath();
    brush.lineTo(x1, y1);
    brush.lineTo(x2, y2);
    brush.closePath();

    brush.strokeStyle = color;
    brush.stroke();

}

class Obstacle {
    //  creating hurdles on canvas by making class Obstacle

    constructor(xOb, yOb, WidthOb, HeightOb, ColorOb) {
        this.xOb = xOb;
        this.yOb = yOb;
        this.WidthOb = WidthOb;
        this.HeightOb = HeightOb;
        this.ColorOb = ColorOb;

    }

    DrawObstacle() {
        DrawRect(this.xOb, this.yOb, this.WidthOb, this.HeightOb, this.ColorOb);
    }

}
class Food {
    //  generate class for snake'food

    constructor(x, y, Swidth, Sheight, color) {
        this.topLeftX = x;
        this.topLeftY = y;
        this.Swidth = Swidth;
        this.Sheight = Sheight;
        this.color = color;

    }
    draw() {

        DrawLine(this.topLeftX, this.topLeftY, this.topLeftX + this.Swidth, this.topLeftY, this.color); // top bar
        DrawLine(this.topLeftX + this.Swidth, this.topLeftY, this.topLeftX + this.Swidth, this.topLeftY + this.Sheight, this.color); // right bar
        DrawLine(this.topLeftX + this.Swidth, this.topLeftY + this.Sheight, this.topLeftX, this.topLeftY + this.Sheight, this.color); // bottom bar
        DrawLine(this.topLeftX, this.topLeftY + this.Sheight, this.topLeftX, this.topLeftY, this.color); // left bar

    }
   
}


class Snake {
    // make a class of snake that has some properties and methods.
    constructor(x, y, width, height, color, dx, dy) {
        this.topLeftX = x;
        this.topLeftY = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.dx = dx;
        this.dy = dy;
    }

    draw() {

        DrawLine(this.topLeftX, this.topLeftY, this.topLeftX + this.width, this.topLeftY, this.color); // top bar
        DrawLine(this.topLeftX + this.width, this.topLeftY, this.topLeftX + this.width, this.topLeftY + this.height, this.color); // right bar
        DrawLine(this.topLeftX + this.width, this.topLeftY + this.height, this.topLeftX, this.topLeftY + this.height, this.color); // bottom bar
        DrawLine(this.topLeftX, this.topLeftY + this.height, this.topLeftX, this.topLeftY, this.color); // left bar
        DrawLine(this.topLeftX + (this.width / 3), this.topLeftY, this.topLeftX + (this.width / 3), this.topLeftY + this.height, this.color); // left bar
        DrawLine(this.topLeftX + (2 * (this.width / 3)), this.topLeftY, this.topLeftX + (2 * (this.width / 3)), this.topLeftY + this.height, this.color); // left bar

    }
    MoveUp() {
        if ((this.topLeftY - this.dy) >= 0) {

            this.topLeftY -= this.dy;
        }
        
    }

    MoveDown() {
        if (((this.topLeftY + this.height) + this.dy) < canvas.height) {

            this.topLeftY += this.dy;
        }
        

    }

    MoveLeft() {
        if ((this.topLeftX - this.dx) >= 0) {

            this.topLeftX -= this.dx;
        }
        else {
            alert("Game is Over!!!  and your Score is " + score);
            restart();
           
        }

    }

    MoveRight() {
        if (((this.topLeftX + this.width) + this.dx) < canvas.width) {

            this.topLeftX += this.dx;
        }
        else {
            alert("Game is Over !!! and your Score is " + score);
            restart();
           
        }

    }
    IsPointInSnake(food) {
        if (
            this.topLeftX < food.topLeftX + food.Swidth && this.topLeftX + this.width > food.topLeftX &&
            this.topLeftY < food.topLeftY + food.Sheight && this.topLeftY + this.height > food.topLeftY
        ) {
            return true;
        };

    }
    IsSnakeHit(obstacle) {
        if (
            this.topLeftX < obstacle.xOb + obstacle.WidthOb && this.topLeftX + this.width > obstacle.xOb &&
            this.topLeftY < obstacle.yOb + obstacle.HeightOb && this.topLeftY + this.height > obstacle.yOb
        ) {



            return true;

        };

    }


}


function GetRandomInteger(a, b) {
    // returns a random integer between a and b (both inclusive). 
    // Assume that a <= b.
    let range = b - a + 1;
    let number = parseInt(Math.random() * range + a);
    return number;
}


function startGame() {
// rectangle is object of class snake 
    rectangle = new Snake(15, 15, 30, 20, "black", 5, 5);
    obstacleCreate();
    foodCreate();
    allDraw();
}
function obstacleCreate() {
    // Generate two hurdles on canvas some specific position

    if (hurdles.length >= 3) {
        return;
    }
    let hX = 120;
    let hY = 100;
    for (let i = 0; i < 2; i++) {

        obstacle = new Obstacle(hX, hY, 60, 50, "yellow");
        hurdles.push(obstacle);
        hX += 300;
        hY += 100;


    }
}


function foodCreate() {
    // create a object call food of Food class
    // usually use foods array and push three food into it 
    if (foods.length >= 4) {
        return;
    }
    for (let i = 0; i < 3; i++) {
        let sX = GetRandomInteger(0, canvas.width - 15);
        let sY = GetRandomInteger(0, canvas.height - 15);
        let food = new Food(sX, sY, 15, 15, "red");
        while (rectangle.IsPointInSnake(food)) {
            sX = GetRandomInteger(0, canvas.width - 15);
            sY = GetRandomInteger(0, canvas.height - 15);
            food = new Food(sX, sY, 15, 15, "red");
        }

        foods.push(food);


    }
}

function allDraw() {
    // draw a snake and food
    ClearCanvas();
    if (myKeys.up == true) {
        MoveUp();
        myKeys.up = false;
    }

    if (myKeys.down == true) {
        MoveDown();
        myKeys.down = false;
    }
    if (myKeys.left == true) {
        MoveLeft();
        myKeys.left = false;
    }
    if (myKeys.right == true) {
        MoveRight();
        myKeys.right = false;
    }
    rectangle.draw();
    for (let i = 0; i < foods.length; i++) {
        foods[i].draw();
    }
    for (let i = 0; i < hurdles.length; i++) {
        hurdles[i].DrawObstacle();
    }
}
function play() {
    clearInterval(move);
    move = setInterval(allDraw, 100);
}



function restart() {
    ClearCanvas();
    foods = [];
    startGame();
    score=0
    Score("result", score);


}
function Score(id, total) {
    document.getElementById(id).innerHTML = total;
}

function MoveUp() {

    rectangle.MoveUp();
    checkCollision();

}
function MoveDown() {
    rectangle.MoveDown();
    checkCollision();
}

function MoveLeft() {

    rectangle.MoveLeft();
    checkCollision();

}

function MoveRight() {

    rectangle.MoveRight();
    checkCollision();
}


function stopGame() {
    clearInterval(move);
}

function checkCollision() {
    for (let i = 0; i < hurdles.length; i++) {
        if (rectangle.IsSnakeHit(hurdles[i])) {
            alert(" Oh!! Hit Obstacles ! Game is over Score is " + score);
            restart();
        }
    }
   
    for (let i = foods.length - 1; i >= 0; i--) {
        if (rectangle.IsPointInSnake(foods[i])) {
            foods.splice(i, 1);
            rectangle.width += 20;
            Score("result", score += 1);
            console.log(score);
            foodCreate();
            allDraw();
        }

    }


}




