import styles from "./styles/footer.module.scss";
import { currentYear } from "../lib/age";

export default function Footer() {
	const year: number = currentYear();
	return (
		<footer className={styles.footer}>
			<p>copyright © {year} Kacper Skowronski </p>
		</footer>
	);
}
