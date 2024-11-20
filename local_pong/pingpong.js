const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
console.log(ctx);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let startX = canvas.width/2;
let startY = canvas.height/2;

const keysPressed = [];
const key_Up = 38;
const key_Down = 40;


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

function Ball(pos, radius, speed)
{
	this.pos = pos;
	this.radius = radius;
	this.speed = speed;

	this.update = function() {
		if (this.pos.y + this.radius > canvas.height || this.pos.y - this.radius < 0) {
			this.speed.y = -this.speed.y;
		}
		this.pos.x += this.speed.x;
		this.pos.y += this.speed.y;
	};
	this.draw = function() {
		ctx.fillStyle = 'blue';
		ctx.strokeStyle = 'blue';
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	};
}

function resetBall(ball)
{
	if (ball.speed.x < 0)
	{
		ball.pos.x = canvas.width/2;
		ball.pos.y = (Math.random() * (canvas.height - 200)) + 100;
	}
	if (ball.speed.x > 0)
	{
		ball.pos.x = canvas.width/2;
		ball.pos.y = (Math.random() * (canvas.height - 200)) + 100;
	}
	ball.speed.x = -ball.speed.x;
	ball.speed.y = -ball.speed.y; 
}

function Score(ball, player1, player2)
{
	if (ball.pos.x <= -ball.radius)
	{
		player1.score += 1;
		document.getElementById("Player_2").innerHTML = player1.score;
		resetBall(ball);
	}

	if (ball.pos.x >= canvas.width + ball.radius)
	{
		player2.score += 1;
		document.getElementById("Player_1").innerHTML = player2.score;
		resetBall(ball);
	}
}

// function hitedPlayer(player, ball) {
// 	if (ball.pos.x < player.pos.x + player.width && 
// 		ball.pos.x > player.pos.x &&
// 		ball.pos.y < player.pos.y + player.height &&
// 		ball.pos.y > player.pos.y) {
// 		return true;
// 	}
// 	return false;
// }

function Player(pos, width, height, speed)
{
	this.pos = pos;
	this.width = width;
	this.height = height;
	this.speed = speed;
	this.score = 0;

	this.update = function() {
		if (keysPressed[key_Up] && this.pos.y > 0) {
			this.pos.y -= this.speed;
		}
		if (keysPressed[key_Down] && this.pos.y < canvas.height - this.height) {
			this.pos.y += this.speed;
		}
	}

	this.draw = function() {
		ctx.fillStyle = 'blue';
		ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height, this.speed);
	};

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

	if (dx <= (ball.radius + player1.getHalfWidth()) && dy <= (ball.radius + player1.getHalfHeight())) {
		ball.speed.x = -ball.speed.x;
	}
}

function Player2IA(ball, player)
{
	if (ball.speed.x > 0) {
		if (ball.pos.y > player.pos.y)
		{
			player.pos.y += player.speed;
			if (ball.pos.y + player.height >= canvas.height)
				player.pos.y = canvas.height - player.height;
		}
		if (ball.pos.y < player.pos.y)
		{
			player.pos.y -= player.speed;
			if (player.pos.y <= 0)
				player.pos.y = 0;
		}
	}
}

function drawfield()
{
	ctx.strokeStyle = 'red';

	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.moveTo(0, 0);
	ctx.lineTo(canvas.width, 0);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.lineTo(canvas.width, canvas.height);
	ctx.lineTo(0 , canvas.height);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.strokeStyle = 'red';
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.moveTo(0, 0);
	ctx.lineTo(0, canvas.height);
	ctx.strokeStyle = 'red';
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.moveTo(canvas.width, 0);
	ctx.lineTo(canvas.width, canvas.height);
	ctx.strokeStyle = 'red';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
	ctx.strokeStyle = 'red';
	ctx.stroke();
}

const player1 = new Player(vector(0, startY), 20, 100, 15);
const player2 = new Player(vector(canvas.width - 20, startY), 20, 100, 15);
const ball = new Ball(vector(startX , startY), 10, vector(5, 5));

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
	player2.draw();
}

function loop() {
	// ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	window.requestAnimationFrame(loop);
	
	update();
	drawgame();
}

loop();
