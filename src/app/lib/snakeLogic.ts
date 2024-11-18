export type snake = {
	radius: number;
	color: string;
	tail: Array<{ x: number; y: number }>;
};

export type snakeHead = {
	mx: number;
	my: number;
	vx: number;
	vy: number;
	radius: number;
	color: string;
};

export function roundNearest50(num: number) {
	return Math.round(num / 50) * 50;
}

export function draw(
	tail: snake,
	animation: NodeJS.Timeout | null,
	move: string,
	context: CanvasRenderingContext2D,
	head: snakeHead,
	setBegin: React.Dispatch<React.SetStateAction<boolean>>,
	setStart: React.Dispatch<React.SetStateAction<boolean>>,
) {
	let [vx, vy] = handleKey(move) || [0, 0];
	if (vx === 0 && vy === 0) {
		vx = head.vx;
		vy = head.vy;
	}
	head.vx = vx;
	head.vy = vy;

	if (handleCollision(head.mx, head.my) && animation) {
		[head.mx, head.my, head.vx, head.vy, move] = handleFailure(
			setBegin,
			setStart,
			animation,
		);
		return;
	}
	context.clearRect(0, 0, 600, 600);
	context.fillStyle = head.color;
	context.fillRect(head.mx, head.my, head.radius, head.radius);
	for (const t of tail.tail) {
		context.fillStyle = tail.color;
		context.fillRect(t.x, t.y, tail.radius, tail.radius);
	}
	if (move !== "") {
		tail.tail.unshift({ x: head.mx, y: head.my });
		tail.tail.pop();
	}
	head.mx += head.vx;
	head.my += head.vy;
}

export function handleCollision(x: number, y: number) {
	if (x < 0 || x > 550 || y < 0 || y > 550) {
		return true;
	}
	return false;
}

export function handleFailure(
	setBegin: React.Dispatch<React.SetStateAction<boolean>>,
	setStart: React.Dispatch<React.SetStateAction<boolean>>,
	animation: NodeJS.Timeout,
): [number, number, number, number, string] {
	alert("You Lost");
	setBegin(false);
	setStart(false);
	clearInterval(animation);
	return [
		roundNearest50(Math.random() * 500),
		roundNearest50(Math.random() * 550),
		0,
		0,
		"",
	];
}

export function handleKey(direction: string | null) {
	switch (direction) {
		case "ArrowUp":
		case "w":
			return [0, -50];
		case "ArrowDown":
		case "s":
			return [0, 50];
		case "ArrowLeft":
		case "a":
			return [-50, 0];
		case "ArrowRight":
		case "d":
			return [50, 0];
		default:
			return;
	}
}
