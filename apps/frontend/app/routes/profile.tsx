// --- app/routes/profile.tsx ---
// Profile page component.
import React from "react";

const Profile: React.FC = () => {
  return (
    <section>
      <h3 className="text-3xl font-semibold text-light-text-main dark:text-dark-text-main">
        Profile
      </h3>
      <p className="mt-4 text-light-text-secondary dark:text-dark-text-secondary">
        หน้าสำหรับดูและแก้ไขข้อมูลส่วนตัว.
      </p>
    </section>
  );
};

export default Profile;
