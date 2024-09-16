"use client";
import React, { useState } from "react";
import Image from "next/image";
import emailjs from "@emailjs/browser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "@styles/Contact.module.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_KEY || "",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          message: formData.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          toast.success("Message sent successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error("Error:", error.text);
          toast.error("Message failed to send. Please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      );
  };

  return (
    <div className={styles.contactContainer}>
      <ToastContainer />
      <h1 className={styles.mainHeading}>Contact Us</h1>
      <div className={styles.contactInner}>
        {/* Left side content */}
        <div className={styles.leftContent}>
          <h2 className={styles.title}>
            Love to hear from you,
            <br /> Get in touch <span className={styles.wave}>👋</span>
          </h2>
          <p className={styles.description}>
            Have any questions or need support regarding your virtual events?
            Reach out, and our team will assist you with setting up an engaging
            virtual experience on NexiMeet.
          </p>

          <div className={styles.testimonial}>
            <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
            <blockquote className={styles.testimonialText}>
              NexiMeet transformed the way we host virtual events. The live
              streaming and engagement tools are next level!
            </blockquote>
            <div className={styles.authorInfo}>
              <Image
                src="/images/avatar-2.png"
                alt="Devon Lane"
                width={48}
                height={48}
                className={styles.avatar}
              />
              <div>
                <h4 className={styles.authorName}>Devon Lane</h4>
                <p className={styles.authorTitle}>Co-Founder, Design.co</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side contact form */}
        <div className={styles.rightContent}>
          <h3 className={styles.formTitle}>Send us a message</h3>
          <form onSubmit={sendEmail} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Your name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1-222-333-4444"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>
                Write your message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className={styles.textarea}
                required
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className={styles.button}
              >
                {loading ? "Sending..." : "Send message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
