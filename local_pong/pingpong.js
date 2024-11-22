const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
console.log(ctx);

const landingPage = document.getElementById('landingPage');
const startGameButton = document.getElementById('startGameButton');
const Restart = document.getElementById("Restart");
const Quit = document.getElementById("Quit");
const Menu = document.getElementById("Menu");
const QuitMenu = document.getElementById("QuitMenu");

let gameStarted = false

// const line = document.getElementById("line");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let startX = canvas.width/2;
// Get the initial canvas size (assuming canvas is already created in HTML)
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Define scaling factor based on the canvas width and height (adjust these values)
const playerWidth = canvasWidth * 0.020;  // 2.5% of the canvas width
const playerHeight = canvasHeight * 0.15; // 15% of the canvas height
const ballRadius = canvasWidth * 0.01; // 2% of the canvas width
// Starting Y position for players
const startY = canvasHeight / 2 - playerHeight / 2; // Centered vertically
const BstartY = canvas.height / 2;

const keysPressed = [];
const key_Up = 38;
const key_Down = 40;

const baseSpeedX = canvas.width * 0.01;
const baseSpeedY = canvas.height * 0.01;

window.addEventListener('keydown', function(e) {
	keysPressed[e.keyCode] = true;
});

window.addEventListener('keyup', function(e) {
	keysPressed[e.keyCode] = false;
});

function vector(x, y) 
{
	return { x: x, y: y };
}


document.querySelectorAll("button").forEach(button => {
	QuitMenu.addEventListener('click', () => {
		window.close();
	});
	startGameButton.addEventListener('click', () => {
		landingPage.style.display = 'none'; // Hide landing page
		gameContainer.style.display = 'flex'; // Show game container
		gameStarted = true;
	});
	Restart.addEventListener("click", () => {
		resetBall(ball);
		player1.score = 0;
		player2.score = 0;
		document.getElementById("Player_1").innerHTML = player1.score;
		document.getElementById("Player_2").innerHTML = player2.score;
    });
	Quit.addEventListener("click", () => {
		window.close();
	});
	Menu.addEventListener("click", () => {
		Restart.click();
		landingPage.style.display = 'flex'; // Show landing page
		gameContainer.style.display = 'none'; // Hide game container
		gameStarted = false;
	});
});

function Ball(pos, radius, speed) {
    this.pos = pos;
    this.radius = radius;
    this.speed = speed;

    const borderSegmentHeight = canvas.height / 7;
    const borderWidth = 20;

    // Normalize speed based on canvas size
    const BASE_SPEED_RATIO = 0.01; // Speed is 10% of the canvas width/height
    this.normalizeSpeed = function () {
        const baseSpeed = canvas.width * BASE_SPEED_RATIO;
        this.speed.x = (this.speed.x < 0 ? -1 : 1) * baseSpeed;
        this.speed.y = (this.speed.y < 0 ? -1 : 1) * baseSpeed;
    };

    this.update = function () {
        // Bounce on top and bottom
        if (this.pos.y + this.radius > canvas.height || this.pos.y - this.radius < 0) {
            this.speed.y = -this.speed.y;
        }

        // Bounce on the left border segments
        if (
            this.pos.x - this.radius < borderWidth &&
            (this.pos.y < borderSegmentHeight || this.pos.y > canvas.height - borderSegmentHeight)
        ) {
            this.speed.x = -this.speed.x;
        }

        // Bounce on the right border segments
        if (
            this.pos.x + this.radius > canvas.width - borderWidth &&
            (this.pos.y < borderSegmentHeight || this.pos.y > canvas.height - borderSegmentHeight)
        ) {
            this.speed.x = -this.speed.x;
        }

        this.pos.x += this.speed.x;
        this.pos.y += this.speed.y;
    };

    this.draw = function () {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    };

    // Initialize normalized speed
    this.normalizeSpeed();
}

// Handle resizing to adjust ball speed
window.addEventListener("resize", () => {
    ball.normalizeSpeed();
});

function resetBall(ball) {
    const StartSpeed = 5;  // Reduce this to slow down the ball on start
    const randomDirection = Math.random() < 0.5 ? -1 : 1;

    // Reset the ball position to center
    ball.pos.x = canvas.width / 2;
    ball.pos.y = (Math.random() * (canvas.height - 200)) + 100;

    // Set initial speed for both axes
    ball.speed.x = StartSpeed * randomDirection;
    ball.speed.y = StartSpeed * (Math.random() < 0.5 ? -1 : 1);

    console.log("Ball reset with speed:", ball.speed.x, ball.speed.y);
}


function Score(ball, player1, player2) {

    if (player1.score === 10) {
        alert("Player 1 wins!");
        player1.score = 0;
        player2.score = 0;
        document.getElementById("Player_1").innerHTML = player1.score;
        document.getElementById("Player_2").innerHTML = player2.score;
        return; 
    }

    if (player2.score === 10) {
        alert("Player 2 wins!");
        player1.score = 0;
        player2.score = 0;
        document.getElementById("Player_1").innerHTML = player1.score;
        document.getElementById("Player_2").innerHTML = player2.score;
        return;
    }

    if (ball.pos.x <= -ball.radius) {
        player2.score += 1;
        document.getElementById("Player_2").innerHTML = player2.score;
        resetBall(ball);
    }

    if (ball.pos.x >= canvas.width + ball.radius) {
        player1.score += 1;
        document.getElementById("Player_1").innerHTML = player1.score;
        resetBall(ball);
    }
}

function Player(pos, width, height, speed)
{
	this.pos = pos;
	this.width = width;
	this.height = height;
	this.speed = speed;
	this.score = 0;

	this.update = function() {
		if (keysPressed[key_Up] && this.pos.y > canvas.height / 7) {
			this.pos.y -= this.speed;
		}
		if (keysPressed[key_Down] && this.pos.y < (canvas.height - canvas.height / 7) - this.height) {
			this.pos.y += this.speed;
		}
	}

	this.draw = function() {
		ctx.fillStyle = 'green';
		ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height, this.speed);
		
	};
	this.draw2 = function() {
		ctx.fillStyle = 'blue';
		ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height, this.speed);
	}

	this.getHalfWidth = function() {
		return this.width / 2;
	};

	this.getHalfHeight = function() {
		return this.height / 2;
	}
	this.getcenter = function() {
		return vector(this.pos.x + this.getHalfWidth(), this.pos.y + this.getHalfHeight());
	};
}

function playerCollision(ball, player1)
{
    let dx = Math.abs(ball.pos.x - player1.getcenter().x);
    let dy = Math.abs(ball.pos.y - player1.getcenter().y);

    if (dx < (ball.radius + player1.getHalfWidth()) && dy < (ball.radius + player1.getHalfHeight())) {
        ball.speed.x *= -1;

        // Increase speed gradually, preserving the direction
        if (Math.abs(ball.speed.x) < 20) {
            ball.speed.x += (ball.speed.x > 0 ? 0.5 : -0.5);
        }
        if (Math.abs(ball.speed.y) < 20) {
            ball.speed.y += (ball.speed.y > 0 ? 0.5 : -0.5);
        }

        // Optional: Add a slight vertical deflection based on where the ball hits the paddle
        const hitPosition = (ball.pos.y - player1.getcenter().y) / player1.getHalfHeight();
        ball.speed.y += hitPosition * 2; // Adjust 2 as needed for effect
    }
}

function Player2IA(ball, player)
{
	if (ball.speed.x > 0) {
		if (ball.pos.y > player.pos.y)
		{
			player.pos.y += player.speed;
			if (ball.pos.y + player.height >= canvas.height - canvas.height / 7)
				player.pos.y = (canvas.height - (canvas.height / 7)) - player.height;
		}
		if (ball.pos.y < player.pos.y)
		{
			player.pos.y -= player.speed;
			if (player.pos.y <= canvas.height / 7)
				player.pos.y = canvas.height / 7;
		}
	}
}

function drawfield()
{
	ctx.strokeStyle = 'white';

	ctx.beginPath();
	ctx.lineWidth = 20;
	ctx.moveTo(0, 0);
	ctx.lineTo(0 , canvas.height / 6);
	ctx.stroke();
	ctx.beginPath();
	ctx.lineWidth = 20;
	ctx.moveTo(0, canvas.height);
	ctx.lineTo(0, canvas.height - canvas.height / 6);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 20;
	ctx.moveTo(canvas.width, 0);
	ctx.lineTo(canvas.width , canvas.height / 6);
	ctx.stroke();
	ctx.beginPath();
	ctx.lineWidth = 20;
	ctx.moveTo(canvas.width, canvas.height);
	ctx.lineTo(canvas.width, canvas.height - canvas.height / 6);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 5;
	ctx.setLineDash([60, 40]);
	ctx.moveTo(canvas.width / 2, 15);
	ctx.lineTo(canvas.width / 2, canvas.height - 15);
	ctx.strokeStyle = 'red';
	ctx.stroke();
	ctx.setLineDash([]);
}


let ball = new Ball(vector(startX, BstartY), ballRadius, vector(5, 5));
let player1 = new Player(vector((canvas.width / 14 ), startY), playerWidth, playerHeight, 15);
let player2 = new Player(vector(canvas.width - (canvas.width / 14 ), startY), playerWidth, playerHeight, 15);

window.addEventListener('resize', function() {
	// Update canvas size dynamically
	canvas.width = window.innerWidth * 0.8;  // Adjust width as needed
	canvas.height = window.innerHeight * 0.8; // Adjust height as needed

	// Recalculate the ball's radius and position
	const ballRadius = canvas.width * 0.02; // Recalculate radius as 2% of new canvas width
	const startX = canvas.width / 2;         // Center the ball horizontally
	const BstartY = canvas.height / 2;        // Center the ball vertically

	// Recalculate player size and position
	const playerWidth = canvas.width * 0.025;
	const playerHeight = canvas.height * 0.1;
	const startY = canvas.height / 2 - playerHeight / 2;

	// Update ball and players
	ball = new Ball(vector(startX, BstartY), ballRadius, vector(5, 5));
	player1 = new Player(vector(0, startY), playerWidth, playerHeight, 15);
	player2 = new Player(vector(canvas.width - playerWidth, startY), playerWidth, playerHeight, 15);
});


function update() 
{
	ball.update();
	player1.update();
	playerCollision(ball, player1);
	Player2IA(ball, player2);
	playerCollision(ball, player2);
	Score(ball, player1, player2);
}

function drawgame()
{
	drawfield();
	ball.draw();
	player1.draw();
	player2.draw2();
}

function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	window.requestAnimationFrame(loop);
	if (!gameStarted) return
	
	update();
	drawgame();
}

loop();
