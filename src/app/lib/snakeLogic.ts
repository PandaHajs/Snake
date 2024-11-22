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
	positionHistory: { x: number; y: number }[],
	cumulativeDistances: number[],
	setHighScore: React.Dispatch<React.SetStateAction<number>>,
	highScore: number,
): [snakeHead, snake, food, { x: number; y: number }[], number[]] | undefined {
	const sSpacing = 50;
	const illegalStartingMoves = ["ArrowRight", "d", "D"];
	let [vx, vy] = handleKey(move) || [0, 0];
	const headF: snakeHead = JSON.parse(JSON.stringify(head));
	const tailF: snake = JSON.parse(JSON.stringify(tail));
	const foodF: food = JSON.parse(JSON.stringify(food));
	const positionHistoryF: { x: number; y: number }[] = JSON.parse(
		JSON.stringify(positionHistory),
	);
	const cumulativeDistancesF: number[] = JSON.parse(
		JSON.stringify(cumulativeDistances),
	);

	if (
		(vx === 0 && vy === 0) ||
		(vx === -headF.vx && vy === -headF.vy) ||
		headF.mx % 50 !== 0 ||
		headF.my % 50 !== 0
	) {
		vx = headF.vx;
		vy = headF.vy;
	}
	if (
		illegalStartingMoves.some((p) => p === move) &&
		headF.vx === 0 &&
		headF.vy === 0
	) {
		return;
	}
	headF.vx = vx;
	headF.vy = vy;
	if (handleCollision(headF.mx, headF.my) && animation) {
		//biome-ignore lint/style/noParameterAssign: This is a necessary assignment, also no matter what I do the 'error' doesn't go away
		[headF.mx, headF.my, headF.vx, headF.vy, move] = handleFailure(
			setBegin,
			setStart,
			animation,
		);
		[foodF.x, foodF.y] = respawnFood(headF, tailF);
		return;
	}
	if (handleBodyCollision(headF, tailF) && animation) {
		//biome-ignore lint/style/noParameterAssign: This is a necessary assignment, also no matter what I do the 'error' doesn't go away
		[headF.mx, headF.my, headF.vx, headF.vy, move] = handleFailure(
			setBegin,
			setStart,
			animation,
		);
		[foodF.x, foodF.y] = respawnFood(headF, tailF);
		return;
	}
	if (handleFoodCollision(headF, foodF)) {
		[foodF.x, foodF.y] = respawnFood(headF, tailF);
		setScore((prev) => {
			const newScore = prev + 1;
			if (newScore > highScore) {
				setHighScore(newScore);
				localStorage.setItem("highScore", newScore.toString());
			}
			return newScore;
		});
		tailF.tail.push({
			x: tailF.tail[tail.tail.length - 1].x,
			y: tailF.tail[tail.tail.length - 1].y,
		});
	}
	context.clearRect(0, 0, 600, 600);
	context.fillStyle = foodF.color;
	context.fillRect(foodF.x, foodF.y, foodF.radius, foodF.radius);
	context.fillStyle = headF.color;
	context.fillRect(headF.mx, headF.my, headF.radius, headF.radius);
	headF.mx += headF.vx;
	headF.my += headF.vy;
	positionHistoryF.push({ x: headF.mx, y: headF.my });

	if (positionHistoryF.length > 1) {
		const prevIndex = positionHistoryF.length - 2;
		const dx =
			positionHistoryF[prevIndex + 1].x - positionHistoryF[prevIndex].x;
		const dy =
			positionHistoryF[prevIndex + 1].y - positionHistoryF[prevIndex].y;
		const distance = Math.sqrt(dx ** 2 + dy ** 2);
		cumulativeDistancesF.push(
			(cumulativeDistancesF[prevIndex] || 0) + distance,
		);
	} else {
		cumulativeDistancesF.push(0);
	}
	const maxDistance = (tailF.tail.length + 1) * sSpacing;

	while (
		cumulativeDistancesF.length > 0 &&
		cumulativeDistancesF[cumulativeDistancesF.length - 1] -
			cumulativeDistancesF[0] >
			maxDistance
	) {
		positionHistoryF.shift();
		cumulativeDistancesF.shift();
	}

	for (let i = 0; i < tail.tail.length; i++) {
		const targetDistance = (i + 1) * sSpacing;
		const totalDistance = cumulativeDistancesF[cumulativeDistancesF.length - 1];
		const targetPosition = totalDistance - targetDistance;
		let index = cumulativeDistancesF.findIndex(
			(distance) => distance >= targetPosition,
		);
		if (index === -1) {
			index = 0;
		}
		tailF.tail[i].x = positionHistoryF[index].x;
		tailF.tail[i].y = positionHistoryF[index].y;
		context.fillStyle = tailF.color;
		context.fillRect(
			tailF.tail[i].x,
			tailF.tail[i].y,
			tailF.radius,
			tailF.radius,
		);
	}
	return [headF, tailF, foodF, positionHistoryF, cumulativeDistancesF];
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

function handleKey(direction: string | null): [number, number] | undefined {
	switch (direction) {
		case "ArrowUp":
		case "w":
		case "W":
			return [0, -5];
		case "ArrowDown":
		case "s":
		case "S":
			return [0, 5];
		case "ArrowLeft":
		case "a":
		case "A":
			return [-5, 0];
		case "ArrowRight":
		case "d":
		case "D":
			return [5, 0];
		default:
			return;
	}
}
