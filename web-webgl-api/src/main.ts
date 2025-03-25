window.addEventListener("load", (evt) => main(evt), false);

function getRenderingContext() {
	const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	const gl = canvas.getContext("webgl2")!;
	if (!gl) throw new Error("WebGL not supported");

	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	return gl;
}

const main = (evt: Event) => {
	window.removeEventListener(evt.type, main, false);
	const gl = getRenderingContext();
	new Stage(gl);
};

class Block {
	gl: WebGL2RenderingContext;
	size: number[] = [200, 100];
	color = [Math.random(), Math.random(), Math.random(), 1.0];
	xCenter: number;
	x: number;
	y: number;
	xRange = 300;
	falling = false;

	constructor(gl: WebGL2RenderingContext, x: number = NaN, y: number = NaN) {
		this.gl = gl;
		this.xCenter = this.gl.drawingBufferWidth / 2;

		this.x = isNaN(x) ? this.xCenter - this.size[0] / 2 : x;
		this.y = isNaN(y) ? this.gl.drawingBufferHeight - this.size[1] : y;
	}

	draw = () => {
		this.gl.enable(this.gl.SCISSOR_TEST);
		this.gl.scissor(this.x, this.y, this.size[0], this.size[1]);
		this.gl.clearColor(this.color[0], this.color[1], this.color[2], this.color[3]);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.gl.disable(this.gl.SCISSOR_TEST);
	};

	fall = (blocks: Block[]): boolean => {
		if (blocks.some((block) => block !== this && block.detectCollision(this))) {
			this.falling = false;
			return true;
		}
		if (this.y <= 0) {
			this.falling = false;
			return true;
		}
		this.y -= 5;
		return false;
	};

	hanging = () => {
		const time = performance.now();
		const offset = this.xRange * Math.sin(time * 0.005);
		this.x = this.xCenter - this.size[0] / 2 + offset;
	};

	detectCollision = (other: Block): boolean => {
		return (
			this.x < other.x + other.size[0] &&
			this.x + this.size[0] > other.x &&
			this.y < other.y + other.size[1] &&
			this.y + this.size[1] > other.y
		);
	};
}

class Stage {
	gl: WebGL2RenderingContext;
	blocks: Block[] = [];

	constructor(gl: WebGL2RenderingContext) {
		this.gl = gl;
		this.blocks.push(new Block(this.gl, this.gl.drawingBufferWidth / 2 - 100, 0));
		this.blocks.push(new Block(this.gl));
		window.addEventListener("keydown", this.dropBlock, false);
		this.update();
	}

	dropBlock = () => {
		const current = this.blocks[this.blocks.length - 1];
		if (!current.falling) {
			current.falling = true;
		}
	};

	update = () => {
		let landed = false;
		for (const block of this.blocks) {
			if (block.falling) {
				const hasLanded = block.fall(this.blocks);
				if (hasLanded) landed = true;
			} else {
				if (block === this.blocks[this.blocks.length - 1]) {
					block.hanging();
				}
			}
			block.draw();
		}
		if (landed) {
			this.blocks.push(new Block(this.gl));
			this.higherBlock();
		}

		if (this.blocks[this.blocks.length - 1].y <= 0) this.endGame();

		requestAnimationFrame(this.update);
	};

	higherBlock = () => {
		this.blocks.forEach((block) => {
			if (block === this.blocks[this.blocks.length - 1]) return;
			block.y -= 0.1;
		});

		requestAnimationFrame(this.higherBlock);
	};

	endGame(): void {
		alert("Game over, looser!!!");
		this.blocks = [];
		this.blocks.push(new Block(this.gl, this.gl.drawingBufferWidth / 2 - 100, 0));
		this.blocks.push(new Block(this.gl));
	}
}
