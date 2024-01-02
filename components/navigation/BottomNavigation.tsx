import Link from "next/link";
import Image from "next/image";
import styles from "./BottomNavigation.module.css"; // Your CSS module

const BottomNavigation: React.FC = () => {
  return (
    <nav className={styles.bottomNav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/">
            <span className={styles.icon}>🗺️</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/chat">
            <Image src="/icons/chat.svg" alt="chat" width={24} height={24} />
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/leaderboard">
          <Image src="/icons/leaderboard.svg" alt="chat" width={24} height={24} />
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/profile">
          <Image src="/icons/face.svg" alt="chat" width={24} height={24} />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNavigation;
