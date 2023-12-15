import Link from 'next/link';
import styles from './BottomNavigation.module.css'; // Your CSS module

const BottomNavigation: React.FC = () => {
  return (
    <nav className={styles.bottomNav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/" className={styles.navLink}>
            Map
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/chat" className={styles.navLink}>
            Chat
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/leaderboard" className={styles.navLink}>
            Leaderboard
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/profile" className={styles.navLink}>
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNavigation;
