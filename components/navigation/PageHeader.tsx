import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import styles from "./PageHeader.module.css";

const PageHeader: React.FC = () => {
  const router = useRouter();

  return (
    <button className={styles.header} onClick={() => router.push("/")}>
      {/* <Image src="/icons/icons-24/arrow-b.svg" alt="Back Button" width={24} height={24} /> */}
      <h1 style={{color: "#fff", fontSize: "32px"}}>x</h1>
    </button>
  );
};

export default PageHeader;
