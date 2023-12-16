import Link from 'next/link';
import styles from './BottomNavigation.module.css'; // Your CSS module

const BottomNavigation: React.FC = () => {
  return (
    <nav className={styles.bottomNav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/hunt" className={styles.navLink}>
            Map
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/hunt/chat" className={styles.navLink}>
            Chat
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/hunt/leaderboard" className={styles.navLink}>
            Leaderboard
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/hunt/profile" className={styles.navLink}>
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNavigation;
