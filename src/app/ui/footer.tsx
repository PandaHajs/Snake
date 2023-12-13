import styles from "@/app/ui/styles/footer.module.scss";
import { currentYear } from "../lib/age";

export default function Footer() {
  let year: number = currentYear();
  return (
    <footer className={styles.footer}>
      <p>copyright © {year} Kacper Skowronski </p>
    </footer>
  );
}
