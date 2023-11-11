import React from "react";
import Image from "next/image";
import classes from "./About.module.scss";

const About = () => {
  return (
    <div className={classes["privacy-policy"]}>
      <header className={classes["privacy-policy__header"]}>
        <Image src="/logo.png" width={60} height={60} alt="Company Logo" />
        <h1 className={classes["privacy-policy__heading"]}>Privacy Policy</h1>
      </header>
      <main className={classes["privacy-policy__main"]}>
        <section className={classes["privacy-policy__section"]}>
          <h2>Introduction</h2>
          <p>
            [ClassZone] (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;) is committed to protecting your privacy. This
            privacy policy explains how we collect, use, and disclose your
            personal information when you use our e-learning management system
            (&quot;Platform&quot;).
          </p>
        </section>

        <section className={classes["privacy-policy__section"]}>
          <h2>Information We Collect</h2>
          <p>We collect the following types of information from you:</p>

          <ul>
            <li>
              Information you provide directly to us. This includes information
              you provide when you create an account. This may include your
              name, email address, profile picture.
            </li>
            <li>
              Automatically collected information. This includes information
              that is automatically collected when you use the Platform.
            </li>
          </ul>
        </section>

        <section className={classes["privacy-policy__section"]}>
          <h2>How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>

          <ul>
            <li>To provide you with the Platform and our services.</li>
            <li>
              To communicate with you about the Platform and our services.
            </li>
            <li>To personalize your experience on the Platform.</li>
            <li>To enforce our terms of service.</li>
            <li>To prevent fraud and abuse.</li>
          </ul>
        </section>

        <section className={classes["privacy-policy__section"]}>
          <h2>Information Sharing and Disclosure</h2>
          <p>
            We do not share your information with any of the third party
            providers.
          </p>
        </section>

        <section className={classes["privacy-policy__section"]}>
          <h2>Data Retention</h2>
          <p>
            We will retain your information for as long as it is necessary to
            provide you with the Platform and our services, to improve the
            Platform and our services.
          </p>
        </section>

        <section className={classes["privacy-policy__section"]}>
          <h2>Your Choices</h2>
          <p>You have the following choices regarding your information:</p>

          <ul>
            <li>
              You can access, review, and update your information by logging
              into your account.
            </li>
          </ul>
        </section>

        <section className={classes["privacy-policy__section"]}>
          <h2>Security</h2>
          <p>
            We use a variety of security measures to protect your information,
            including encryption, access controls, and firewalls.
          </p>
        </section>

        <section className={classes["privacy-policy__section"]}>
          <h2>Changes to Our Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make any
            material changes, we will notify you by email or by posting a notice
            on the Platform.
          </p>
        </section>
      </main>
    </div>
  );
};

export default About;
