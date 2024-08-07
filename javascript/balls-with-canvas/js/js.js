const canvas= document.querySelector('canvas');
const ctx= canvas.getContext('2d');

canvas.width= 500;
canvas.height= 500;

const COLORS= ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'];
const DIRECTIONS= ['right', 'left', 'hight', 'width'];


const getBall= ()=>({
    y: Math.random()*canvas.height-20,
    x: Math.random()*canvas.width-20,
    w: 20,
    h: 20,
    direction: DIRECTIONS[Math.floor(Math.random()*DIRECTIONS.length)],
    color: COLORS[Math.floor(Math.random()*COLORS.length)],
    draw(){
        ctx.fillStyle= this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        
        
        //collisions with balls
        

        //
        if(this.direction==='right'){
            this.x+=3;
            this.y= Math.sin(this.x/10)+this.y;
        }else if(this.direction==='left'){
            this.x-=3;
            this.y= Math.sin(this.x/10)+this.y;
        }
        if(this.direction==='hight'){
            this.y--;
            this.x= Math.cos(this.y/10)+this.x;
        }else if(this.direction==='width'){
            this.y++;
            this.x= Math.cos(this.y/10)+this.x;
        }
        if(this.y>=canvas.height-this.h){
            this.direction= 'hight';
            this.color= COLORS[Math.floor(Math.random()*COLORS.length)];
        }else if(this.y<=0){
            this.direction= 'width';
            this.color= COLORS[Math.floor(Math.random()*COLORS.length)];
        }
        if(this.x>=canvas.width-this.w){
            this.direction= 'left';
            this.color= COLORS[Math.floor(Math.random()*COLORS.length)];
        }else if(this.x<=0){
            this.direction= 'right';
            this.color= COLORS[Math.floor(Math.random()*COLORS.length)];
        }
    }
    
})
const getBalls= ()=>{
    const balls= [];
    for(let i=0; i<5; i++){
        balls.push(getBall());
    }
    return balls;
}

const ball= getBall();
ball.draw();

const balls= getBalls();
balls.forEach(ball=>ball.draw());

//collisions with balls
balls.forEach((ball, i)=>{
    balls.forEach((b, j)=>{
        if(i!==j){
            if(ball.x < b.x+b.w && ball.x+ball.w > b.x && ball.y < b.y+b.h && ball.y+ball.h > b.y){
                ball.direction= DIRECTIONS[Math.floor(Math.random()*DIRECTIONS.length)];
            }
        }
    })
})

const update= ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle= 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball=>ball.draw());
    requestAnimationFrame(update);
}

requestAnimationFrame(update);