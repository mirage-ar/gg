import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import styles from "./PageHeader.module.css";

const PageHeader: React.FC = () => {
  const router = useRouter();

  return (
    <button className={styles.header} onClick={() => router.push("/")}>
      <Image src="/icons/arrow-b.svg" alt="Back Button" width={24} height={24} />
    </button>
  );
};

export default PageHeader;
