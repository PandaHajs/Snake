"use client";
import Divider from "./ui/divider";
import styles from "./page.module.scss";
import Dock from "./ui/dock";
import Snake from "./ui/snake";
import Start from "./ui/start";
import Restart from "./ui/restart";
import { useState } from "react";

export default function Home() {
  const [over, setOver] = useState<boolean>(false);
  return (
    <main>
      <Divider>
        <section className={styles.sec}>
          <Dock />
          <Start />
          <Snake />
        </section>
      </Divider>
    </main>
  );
}
