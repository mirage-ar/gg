"use client";

import React, { useEffect } from "react";

const ProfilePage: React.FC = () => {
  useEffect(() => {
    console.log("profile page");
  });
  return (
    <main>
      <h1>Profile</h1>
    </main>
  );
};

export default ProfilePage;
