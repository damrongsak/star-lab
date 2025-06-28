// --- app/routes/blog.tsx ---
// Blog page component.
import React from "react";

const Blog: React.FC = () => {
  return (
    <section>
      <h3 className="text-3xl font-semibold text-light-text-main dark:text-dark-text-main">
        Blog
      </h3>
      <p className="mt-4 text-light-text-secondary dark:text-dark-text-secondary">
        อ่านบทความและข่าวสารล่าสุดจากเรา.
      </p>
    </section>
  );
};

export default Blog;
