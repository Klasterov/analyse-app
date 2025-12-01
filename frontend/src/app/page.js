import Image from "next/image";
import styles from "./page.module.css";
import Grids from "../components/Grids";
export default function Home() {
  return (
    <main className={styles.main}>
      <Grids />
      </main>
  );
}
