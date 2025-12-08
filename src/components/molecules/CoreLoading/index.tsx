import styles from "./styles.module.css";

const CoreLoading = () => {
  return (
    <div className="flex flex-col w-full items-center gap-4">
      <div className={styles.loader}>
        <div className={styles.loader__bar}></div>
        <div className={styles.loader__bar}></div>
        <div className={styles.loader__bar}></div>
        <div className={styles.loader__bar}></div>
        <div className={styles.loader__bar}></div>
        <div className={styles.loader__ball}></div>
      </div>
    </div>
  );
};

export default CoreLoading;
