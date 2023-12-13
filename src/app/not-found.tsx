import Link from "next/link";
import Divider from "./ui/divider";
import styles from "@/app/ui/styles/not-found.module.scss";

export default function NotFound() {
  return (
    <main>
      <Divider>
        <section className={styles.sec}>
          <h1 className={styles.text}>
            Oops! Seems like this page doesn&apos;t exist.
          </h1>
          <div className={styles.btn}>
            <Link href="/">Go back</Link>
          </div>
        </section>
      </Divider>
    </main>
  );
}
