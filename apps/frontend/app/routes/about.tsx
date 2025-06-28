// --- app/routes/about.tsx ---
// About page component.
import React from "react";

const About: React.FC = () => {
  return (
    <section>
      <h3 className="text-3xl font-semibold text-light-text-main dark:text-dark-text-main">
        About Us
      </h3>
      <p className="mt-4 text-light-text-secondary dark:text-dark-text-secondary">
        เรียนรู้เกี่ยวกับ Star-Labs และวิสัยทัศน์ของเรา.
      </p>
    </section>
  );
};

export default About;
