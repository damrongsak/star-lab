// --- app/routes/customers.tsx ---
// Customers page component.
import React from "react";

const Customers: React.FC = () => {
  return (
    <section>
      <h3 className="text-3xl font-semibold text-light-text-main dark:text-dark-text-main">
        Customers
      </h3>
      <p className="mt-4 text-light-text-secondary dark:text-dark-text-secondary">
        หน้าสำหรับจัดการข้อมูลลูกค้า.
      </p>
    </section>
  );
};

export default Customers;
