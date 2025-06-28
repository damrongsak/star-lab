// --- app/routes/products.tsx ---
// Products page component. (Mapped from 'projects' in routes.ts)
import React from "react";

const Products: React.FC = () => {
  return (
    <section>
      <h3 className="text-3xl font-semibold text-light-text-main dark:text-dark-text-main">
        Our Projects
      </h3>
      <p className="mt-4 text-light-text-secondary dark:text-dark-text-secondary">
        ดูโครงการที่เราได้ทำสำเร็จ.
      </p>
    </section>
  );
};

export default Products;
