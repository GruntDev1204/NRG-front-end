"use client";
import styles from "../styles/loading.module.css";

const LoadingScreen = () => {
  const text = "Loading...";
  return (
    <div className={styles.loadingScreen}>
      <div className={styles.spinner}></div>
      <div className={styles.wavyText}>
        <span>N</span>
        <span>G</span>
        <span>R</span>
        <span>U</span>
        <span>N</span>
        <span>T</span>
        <span>.</span>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
