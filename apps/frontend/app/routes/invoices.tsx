// --- app/routes/invoices.tsx ---
// Invoices page component.
import React from "react";

const Invoices: React.FC = () => {
  return (
    <section>
      <h3 className="text-3xl font-semibold text-light-text-main">Invoices</h3>
      <p className="mt-4 text-light-text-secondary">
        หน้าสำหรับจัดการใบแจ้งหนี้.
      </p>
    </section>
  );
};

export default Invoices;
