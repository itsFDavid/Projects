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

const getBall = () => ({
    y: Math.random() * canvas.height,
    x: Math.random() * canvas.width,
    radius: Math.random() * 10 + 5,
    dx: (Math.random() - 0.5) * 6,
    dy: (Math.random() - 0.5) * 6, 
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        this.x += this.dx;
        this.y += this.dy;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx *= -1;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy *= -1;
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
        // Invertir los vectores de movimiento (dx y dy) al colisionar
        ball1.dx *= -1;
        ball1.dy *= -1;
        ball2.dx *= -1;
        ball2.dy *= -1;

        // Ajustar las posiciones para evitar sobreposición
        const overlap = ball1.radius + ball2.radius - distance;
        const adjustmentFactor = overlap / distance;
        ball1.x += dx * adjustmentFactor / 2;
        ball1.y += dy * adjustmentFactor / 2;
        ball2.x -= dx * adjustmentFactor / 2;
        ball2.y -= dy * adjustmentFactor / 2;
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
