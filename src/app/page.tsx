import Divider from "./ui/divider";
import styles from "./page.module.scss";
import Dock from "./ui/dock";
import SnakeCanvas from "./ui/snakeCanvas";

export default function Home() {
	return (
		<main>
			<Divider>
				<section className={styles.sec}>
					<Dock />
					<SnakeCanvas />
				</section>
			</Divider>
		</main>
	);
}
