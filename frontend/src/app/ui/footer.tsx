import { currentYear } from "../lib/age";
import styles from "./styles/footer.module.scss";

export default function Footer() {
	const year: number = currentYear();
	return (
		<footer className={styles.footer}>
			<p>copyright © {year} Kacper Skowronski </p>
		</footer>
	);
}
