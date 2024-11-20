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

export type food = {
	x: number;
	y: number;
	radius: number;
	color: string;
};

export function roundNearest50(num: number) {
	return Math.round(num / 50) * 50;
}

export function draw(
	food: food,
	tail: snake,
	animation: NodeJS.Timeout | null,
	move: string,
	context: CanvasRenderingContext2D,
	head: snakeHead,
	setBegin: React.Dispatch<React.SetStateAction<boolean>>,
	setStart: React.Dispatch<React.SetStateAction<boolean>>,
	setScore: React.Dispatch<React.SetStateAction<number>>,
	score: number,
	setHighScore: React.Dispatch<React.SetStateAction<number>>,
	highScore: number,
) {
	const illegalStartingMoves = ["ArrowRight", "d", "D"];
	const legalMoves = [
		"ArrowLeft",
		"a",
		"A",
		"ArrowRight",
		"d",
		"D",
		"ArrowDown",
		"s",
		"S",
		"ArrowUp",
		"w",
		"W",
		"",
	];
	let [vx, vy] = handleKey(move) || [0, 0];
	if (vx === 0 && vy === 0 && !legalMoves.includes(move)) {
		return;
	}
	if ((vx === 0 && vy === 0) || (vx === -head.vx && vy === -head.vy)) {
		vx = head.vx;
		vy = head.vy;
	}
	if (
		illegalStartingMoves.some((p) => p === move) &&
		head.vx === 0 &&
		head.vy === 0
	) {
		return;
	}
	head.vx = vx;
	head.vy = vy;
	if (handleCollision(head.mx, head.my) && animation) {
		[head.mx, head.my, head.vx, head.vy, move] = handleFailure(
			setBegin,
			setStart,
			animation,
		);
		[food.x, food.y] = respawnFood(head, tail);
		return;
	}
	if (handleBodyCollision(head, tail) && animation) {
		[head.mx, head.my, head.vx, head.vy, move] = handleFailure(
			setBegin,
			setStart,
			animation,
		);
		[food.x, food.y] = respawnFood(head, tail);
		return;
	}
	if (handleFoodCollision(head, food)) {
		[food.x, food.y] = respawnFood(head, tail);
		setScore((prev) => {
			const newScore = prev + 1;
			if (newScore > highScore) {
				setHighScore(newScore);
				window.localStorage.setItem("highScore", newScore.toString());
			}
			return newScore;
		});
		tail.tail.push({
			x: tail.tail[tail.tail.length - 1].x,
			y: tail.tail[tail.tail.length - 1].y,
		});
	}
	context.clearRect(0, 0, 600, 600);
	context.fillStyle = food.color;
	context.fillRect(food.x, food.y, food.radius, food.radius);
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

function respawnFood(head: snakeHead, tail: snake): [number, number] {
	let x: number;
	let y: number;
	do {
		x = roundNearest50(Math.random() * 500);
		y = roundNearest50(Math.random() * 550);
	} while (
		(x === head.mx && y === head.my) ||
		tail.tail.some((t) => t.x === x && t.y === y)
	);
	return [x, y];
}

function handleFoodCollision(head: snakeHead, food: food): boolean {
	if (head.mx === food.x && head.my === food.y) {
		return true;
	}
	return false;
}

function handleBodyCollision(head: snakeHead, tail: snake): boolean {
	for (const t of tail.tail) {
		if (head.mx === t.x && head.my === t.y) {
			return true;
		}
	}
	return false;
}

function handleCollision(x: number, y: number) {
	if (x < 0 || x > 550 || y < 0 || y > 550) {
		return true;
	}
	return false;
}

function handleFailure(
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

function handleKey(direction: string | null) {
	switch (direction) {
		case "ArrowUp":
		case "w":
		case "W":
			return [0, -50];
		case "ArrowDown":
		case "s":
		case "S":
			return [0, 50];
		case "ArrowLeft":
		case "a":
		case "A":
			return [-50, 0];
		case "ArrowRight":
		case "d":
		case "D":
			return [50, 0];
		default:
			return;
	}
}
