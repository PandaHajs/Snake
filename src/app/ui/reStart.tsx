import styles from "./styles/canvas.module.scss";

export default function ReStart(props: {
	setStart: React.Dispatch<React.SetStateAction<boolean>>;
	restart: boolean;
	start: boolean;
}) {
	return (
		<>
			{props.start ? null : (
				<div className={styles.reStart}>
					<h2>{props.restart ? "You lost :(" : "Welcome :)"}</h2>
					<p>
						{props.restart
							? "Press the restart button to try again"
							: "Press the start button to begin"}
					</p>
					<button
						type="button"
						onClick={() => {
							props.setStart((prev) => !prev);
						}}
					>
						{props.restart ? "Restart" : "Start"}
					</button>
				</div>
			)}
		</>
	);
}
