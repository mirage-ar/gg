"use client";

import React, { useEffect } from "react";
import Profile from "@/components/profile/Profile";
import PageHeader from "@/components/navigation/PageHeader";

import styles from "./page.module.css";

const ProfilePage: React.FC = () => {
  return (
    <main className={styles.container}>
      <PageHeader />
      <Profile />
    </main>
  );
};

export default ProfilePage;
