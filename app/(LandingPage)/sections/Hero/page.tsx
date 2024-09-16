"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "@styles/Hero.module.css";
import React, { useState } from "react";
import { useSession } from "next-auth/react"; // Add this import

const images = [
  "/images/illustrations/ill11.svg",
  "/images/illustrations/ill12.svg",
  "/images/illustrations/ill10.svg",
  "/images/illustrations/ill9.svg",
  "/images/illustrations/ill8.svg",
  "/images/illustrations/ill7.svg",
];

const generateImageElements = (images: string[]) => {
  return (
    <>
      {images.map((src, index) => (
        <div key={`${src}-${index}`} className={`${styles["image-wrapper"]} ${styles["fade-edges"]}`}>
          <Image
            className={styles.image}
            src={src}
            alt={`Image ${index + 1}`}
            width={500}
            height={300}
            style={{
              maxWidth: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </div>
      ))}
    </>
  );
};

export default function Hero() {
  const [isFocused, setIsFocused] = useState(false);
  const { data: session } = useSession(); // Add this line to get the session

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <section className={styles["hero-section"]}>
      <div className={styles["hero-container"]}>
        <div className={styles["hero-content"]}>
          <p
            className={`${styles["hero-tagline"]} ${styles["animate-fade-in"]}`}
          >
            Elevate Your Virtual Events with NexiMeet
          </p>
          <h1
            className={`${styles["hero-title"]} ${styles["animate-slide-up"]}`}
          >
            Host, Connect, and Engage Like Never Before
          </h1>
          <p
            className={`${styles["hero-subtitle"]} ${styles["animate-fade-in"]}`}
          >
            Unlock the power of interactive virtual events with NexiMeet&apos;s
            cutting-edge platform.
          </p>
          <Link href={session ? "/virtualMeetHome" : "/sign-up"} passHref>
            <span
              className={`${styles["hero-cta"]} ${styles["animate-pulse"]}`}
            >
              {session ? "Get Started" : "Join for free"}
              <svg
                className={styles["hero-cta-icon"]}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
          </Link>
          {!session && (
            <p
              className={`${styles["hero-login-text"]} ${styles["animate-fade-in"]}`}
            >
              Already a member?{" "}
              <Link href="/sign-in">
                <span className={styles["hero-login-link"]}>Log in</span>
              </Link>
            </p>
          )}
        </div>
        <div
          className={`${styles["hero-image-container"]} ${
            isFocused
              ? ""
              : Math.random() > 0.5
              ? styles["tilt-right"]
              : styles["tilt-left"]
          }`}
          onMouseEnter={handleFocus}
          onMouseLeave={handleBlur}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={0}
        >
          <div className={styles["hero-image-grid"]}>
            <div
              className={`${styles["scroll-container"]} ${styles["animate-loop-vertically"]}`}
            >
              {generateImageElements(images)}
              {generateImageElements(images)}
            </div>
            <div
              className={`${styles["scroll-container"]} ${styles["animate-reverse-loop-vertically"]}`}
            >
              {generateImageElements(images)}
              {generateImageElements(images)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
