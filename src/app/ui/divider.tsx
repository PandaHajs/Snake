import styles from "@/app/ui/styles/divider.module.scss";

export default function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.view}>
      <div className={styles.parttop}>{children}</div>
      <div className={styles.partbot} />
    </div>
  );
}
