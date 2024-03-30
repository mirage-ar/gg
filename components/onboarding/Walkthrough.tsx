"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./Walkthrough.module.css";

interface WalkthroughProps {
  setHasOnboarded: (value: boolean) => void;
}

const Walkthrough: React.FC<WalkthroughProps> = ({ setHasOnboarded }) => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep(step + 1);
  };

  useEffect(() => {
    if (step === 4) {
      localStorage.setItem("hasOnboarded", JSON.stringify(true));
      setHasOnboarded(true);
    }
  }, [step]);

  return (
    <div className={styles.main}>
      <div className={styles.image}>
        <Image
          src={`/graphics/walkthrough-${step}.png`}
          alt="Walkthrough graphic"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>

      <div className={styles.title}>
        {step === 1 && (
          <h1>
            Collect G Boxes
            <br />
            on your map
          </h1>
        )}
        {step === 2 && (
          <h1>
            Run to a G Box
            <br />to open it
          </h1>
        )}
        {step === 3 && (
          <h1>
            Claim and climb
            <br />the leaderboard
          </h1>
        )}
      </div>

      <div className={styles.subline}>
        {step === 1 && (<p>RACE against the world</p>)}
        {step === 2 && (<p>Stack G and climb the leaderboard</p>)}
        {step === 3 && (<p>Hurry you only have 1 hour</p>)}
      </div>

      <button className={styles.button} onClick={handleNext}>
        Next
      </button>
      <div className={styles.progress}>
        {Array.from({ length: 3 }, (_, index) => (
          <span key={index} className={index + 1 == step ? styles.active : ""}>
            •
          </span>
        ))}
      </div>
    </div>
  );
};

export default Walkthrough;
