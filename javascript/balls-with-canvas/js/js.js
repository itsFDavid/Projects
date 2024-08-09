const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const numBalls= document.getElementById('numBalls');

var balls=[];
var animationId;
numBalls.addEventListener('change', () => {
    balls = getBalls(numBalls.value);
    cancelAnimationFrame(animationId);
    update()
});

canvas.width = 500;
canvas.height = 500;
canvas.style.border = '10px solid yellow';
canvas.style.borderRadius = '10px';

const COLORS = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'];
const DIRECTIONS = ['right', 'left', 'up', 'down'];

const getBall = () => ({
    y: Math.random() * canvas.height,
    x: Math.random() * canvas.width,
    radius: Math.random() * 10,
    direction: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        if (this.direction === 'right') {
            this.x += 3;
        } else if (this.direction === 'left') {
            this.x -= 3;
        }
        if (this.direction === 'up') {
            this.y -= 3;
        } else if (this.direction === 'down') {
            this.y += 3;
        }

        // Rebotes contra los bordes del canvas
        if (this.y >= canvas.height - this.radius) {
            this.direction = 'up';
        } else if (this.y <= this.radius) {
            this.direction = 'down';
        }
        if (this.x >= canvas.width - this.radius) {
            this.direction = 'left';
        } else if (this.x <= this.radius) {
            this.direction = 'right';
        }
    }
});

const getBalls = (numBalls) => {
    const balls = [];
    for (let i = 0; i < numBalls; i++) {
        balls.push(getBall());
    }
    console.log(balls);
    return balls;
};


const handleCollisions = (ball1, ball2) => {
    const dx = ball1.x - ball2.x;
    const dy = ball1.y - ball2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ball1.radius + ball2.radius) {
        // Invertir direcciones si colisionan
        [ball1.direction, ball2.direction] = [ball2.direction, ball1.direction];
    }
};

const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#c7c1c1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    balls.forEach((ball, index) => {
        ball.draw();
        for (let i = index + 1; i < balls.length; i++) {
            handleCollisions(ball, balls[i]);
        }
    });
    animationId= requestAnimationFrame(update);
};

balls = getBalls(numBalls.value || 0);
update();
