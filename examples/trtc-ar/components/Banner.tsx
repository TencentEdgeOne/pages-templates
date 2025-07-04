import styles from '@/styles/banner.module.scss';

export default function Banner() {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <h1 className={styles.title}>AR Virtual Try On Online</h1>
      </div>
    </div>
  );
}
