// --- app/components/footer.tsx ---
// Site-wide footer component.
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="text-center p-4 text-md text-gray-400 border-t border-gray-200 dark:border-gray-200 mt-30 fixed bottom-0 w-full">
      © {new Date().getFullYear()} Star-Labs Tracking. All Rights Reserved.
    </footer>
  );
};

export default Footer;
