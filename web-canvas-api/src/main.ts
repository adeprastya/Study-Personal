const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d")!;

class Bird {
	context: CanvasRenderingContext2D;
	size: number;
	x: number = window.innerWidth / 2;
	y: number = window.innerHeight / 2;
	velocity: number = 0;
	acceleration: number = 0;
	gravity: number = 0.2;
	lift: number = -10;
	damping: number = 0.99;
	lastTime: number = performance.now();

	constructor(context: CanvasRenderingContext2D, size: number = 20) {
		this.context = context;
		this.size = size;
	}

	show(): void {
		this.context.beginPath();
		this.context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
		this.context.closePath();
		this.context.fill();
	}

	update(currentTime: number): void {
		const dt = (currentTime - this.lastTime) / 16.67;
		this.lastTime = currentTime;

		this.acceleration = this.gravity;
		this.velocity += this.acceleration * dt;
		this.velocity *= this.damping;
		this.y += this.velocity * dt;

		if (this.y + this.size > canvas.height) {
			this.y = canvas.height - this.size;
			this.velocity = 0;
		}
		if (this.y - this.size < 0) {
			this.y = this.size;
			this.velocity = 0;
		}

		this.show();
	}

	flyUp(): void {
		this.velocity = this.lift;
	}
}

class Pipe {
	context: CanvasRenderingContext2D;
	width: number = 100;
	height: number = Math.max(Math.random() * (canvas.height - canvas.height / 3), canvas.height / 3);
	position: "top" | "bottom" = Math.random() > 0.5 ? "top" : "bottom";
	x: number = canvas.width;
	speed: number = 2;
	bird: Bird;

	constructor(context: CanvasRenderingContext2D, bird: Bird) {
		this.context = context;
		this.bird = bird;
	}

	show(): void {
		this.context.beginPath();
		this.context.rect(this.x, this.position === "top" ? 0 : canvas.height - this.height, this.width, this.height);
		this.context.closePath();
		this.context.fill();
	}

	update = (): boolean => {
		this.x -= this.speed;
		this.show();
		return this.checkCollision(this.bird);
	};

	checkCollision(bird: Bird): boolean {
		const rectX = this.x;
		const rectY = this.position === "top" ? 0 : canvas.height - this.height;
		const rectWidth = this.width;
		const rectHeight = this.height;

		const closestX = Math.max(rectX, Math.min(bird.x, rectX + rectWidth));
		const closestY = Math.max(rectY, Math.min(bird.y, rectY + rectHeight));

		const dx = bird.x - closestX;
		const dy = bird.y - closestY;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < bird.size) return true;
		return false;
	}
}

class Stage {
	context: CanvasRenderingContext2D;
	bird: Bird;
	pipes: Pipe[] = [];
	pipeInterval: number = 1500;
	lastPipeTime: number = performance.now();
	gameOver: boolean = false;
	points: number = 0;

	constructor(context: CanvasRenderingContext2D) {
		this.context = context;
		this.bird = new Bird(context);
		this.pipes.push(new Pipe(context, this.bird));
		this.setupControls();
		requestAnimationFrame(this.update);
	}

	showPoints(): void {
		this.context.beginPath();
		this.context.font = "20px Arial";
		this.context.fillStyle = "black";
		this.context.fillText(`Score ${this.points.toFixed(0)}`, 10, 30);
		this.context.closePath();
		this.context.fill();
	}

	setupControls(): void {
		window.addEventListener("keydown", (e) => {
			if (e.key === " ") {
				this.bird.flyUp();
			}
		});
	}

	reset(): void {
		this.bird = new Bird(this.context);
		this.pipes = [];
		this.lastPipeTime = performance.now();
		this.points = 0;
		this.gameOver = false;
		requestAnimationFrame(this.update);
	}

	update = (): void => {
		if (this.gameOver) return;
		this.context.clearRect(0, 0, canvas.width, canvas.height);

		this.points += 0.1;
		this.showPoints();

		this.bird.update(performance.now());

		for (let i = this.pipes.length - 1; i >= 0; i--) {
			if (this.pipes[i].update()) {
				this.endGame();
				return;
			}
			if (this.pipes[i].x + this.pipes[i].width < 0) {
				this.pipes.splice(i, 1);
			}
		}

		if (performance.now() - this.lastPipeTime > this.pipeInterval) {
			this.pipes.push(new Pipe(this.context, this.bird));
			this.lastPipeTime = performance.now();
		}

		requestAnimationFrame(this.update);
	};

	endGame(): void {
		this.gameOver = true;
		alert("Game over, looser!!");
		this.reset();
	}
}

new Stage(ctx);
