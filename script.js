const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let isJumping = false;
    let jumpHeight = 0;
    let elapsedTime = 0;

    const player = {
      x: 100,
      y: canvas.height - 50,
      size: 40,
      draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y - this.size - jumpHeight, this.size, this.size);
      },
      jump() {
        if (!isJumping) {
          isJumping = true;
          jumpHeight = 0;
        }
      }
    };

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        player.jump();
      }
    });

    class Obstacle {
      constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
      }

      draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - this.height, this.width, this.height);
      }

      update() {
        this.x -= 5;

        if (this.x + this.width < 0) {
          this.x = canvas.width + Math.random() * 800;
        }
      }
    }

    const obstacles = [
      new Obstacle(canvas.width, canvas.height - 50, 40, 60),
      new Obstacle(canvas.width + 400, canvas.height - 50, 40, 60),
    ];

    function checkCollision(player, obstacle) {
      const playerTop = player.y - player.size - jumpHeight;
      const playerBottom = player.y - jumpHeight;
      const playerLeft = player.x;
      const playerRight = player.x + player.size;

      const obstacleTop = obstacle.y - obstacle.height;
      const obstacleBottom = obstacle.y;
      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + obstacle.width;

      return (
        playerBottom > obstacleTop &&
        playerTop < obstacleBottom &&
        playerRight > obstacleLeft &&
        playerLeft < obstacleRight
      );
    }

    function gameLoop(timestamp) {
      elapsedTime = Math.floor(timestamp / 1000);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isJumping) {
        jumpHeight += 5;
        if (jumpHeight > 100) {
          isJumping = false;
        }
      } else {
        if (jumpHeight > 0) {
          jumpHeight -= 5;
        }
      }

      player.draw();
      obstacles.forEach(obstacle => {
        obstacle.draw();
        obstacle.update();
      });

      ctx.fillStyle = 'black';
      ctx.font = '20px Arial';
      ctx.fillText(`Time: ${elapsedTime}s`, 10, 30);

      if (obstacles.some(obstacle => checkCollision(player, obstacle))) {
        console.log('Game Over');
      } else {
        requestAnimationFrame(gameLoop);
      }
    }

    requestAnimationFrame(gameLoop);