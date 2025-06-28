// --- app/routes/settings.tsx ---
// Settings page component.
import React from "react";

const Settings: React.FC = () => {
  return (
    <section>
      <h3 className="text-3xl font-semibold text-light-text-main dark:text-dark-text-main">
        Settings
      </h3>
      <p className="mt-4 text-light-text-secondary dark:text-dark-text-secondary">
        หน้าสำหรับปรับแต่งการตั้งค่าระบบและผู้ใช้งาน.
      </p>
    </section>
  );
};

export default Settings;
