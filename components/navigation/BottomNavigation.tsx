import Link from "next/link";
import Image from "next/image";
import styles from "./BottomNavigation.module.css"; // Your CSS module

const BottomNavigation: React.FC = () => {
  return (
    <nav className={styles.bottomNav}>
      <ul className={styles.navList}>
        <Link href="/chat">
          <li className={styles.navItem}>
            <Image src="/icons/chat.svg" alt="chat" width={24} height={24} />
          </li>
        </Link>
        <Link href="/leaderboard">
          <li className={styles.navItem}>
            <Image src="/icons/leaderboard.svg" alt="chat" width={24} height={24} />
          </li>
        </Link>
        <Link href="/profile">
          <li className={styles.navItem}>
            <Image src="/icons/face.svg" alt="chat" width={24} height={24} />
          </li>
        </Link>
      </ul>
    </nav>
  );
};

export default BottomNavigation;
