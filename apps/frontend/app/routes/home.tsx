// --- app/routes/home.tsx ---
// Home page component.
import React from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button"; // Assuming Button component

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] bg-light-bg-secondary dark:bg-dark-bg-main text-light-text-main dark:text-dark-text-main p-4">
      <h1 className="text-5xl font-bold text-brand-blue mb-4 text-center">
        Welcome to Star-Labs Tracking
      </h1>
      <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mb-8 text-center max-w-2xl">
        ระบบจัดการห้องปฏิบัติการครบวงจร ตั้งแต่การส่งคำขอทดสอบ การติดตามสถานะ
        ไปจนถึงการอนุมัติผล
      </p>
      <Button className="px-6 py-3 rounded-lg bg-brand-blue text-white text-lg hover:bg-brand-blue/90 transition-colors">
        <Link to="/signin">เริ่มต้นใช้งาน</Link>
      </Button>
      <p className="mt-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
        หากคุณเป็นผู้ใช้งานทั่วไป สามารถสำรวจเว็บไซต์ได้ผ่านเมนูด้านบน
      </p>
    </div>
  );
};

export default Home;
