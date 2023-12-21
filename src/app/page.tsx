import Divider from "./ui/divider";
import styles from "./page.module.scss";
import Dock from "./ui/dock";
import Snake from "./ui/snake";

export default function Home() {
  return (
    <main>
      <Divider>
        <section className={styles.sec}>
          <Dock />
          <Snake />
        </section>
      </Divider>
    </main>
  );
}
