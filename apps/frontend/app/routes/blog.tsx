import React, { useState } from "react";

type BlogCardProps = {
  title: string;
  description: string;
  author: string;
  date: string;
};

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  description,
  author,
  date,
}) => {
  return (
    <div
      className="blog-card"
      style={{
        border: "1px solid #ddd",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "16px",
      }}
    >
      <h2 style={{ margin: "0 0 8px" }}>{title}</h2>
      <p style={{ margin: "0 0 8px", color: "#555" }}>{description}</p>
      <p style={{ margin: "0 0 8px", fontStyle: "italic", color: "#777" }}>
        By {author}
      </p>
      <p style={{ margin: "0", color: "#999" }}>{date}</p>
    </div>
  );
};

const BlogPage: React.FC = () => {
  const sampleData = [
    {
      title: "Understanding React",
      description: "A deep dive into the world of React and its ecosystem.",
      author: "Jane Doe",
      date: "October 1, 2023",
    },
    {
      title: "TypeScript Tips",
      description: "Learn some useful tips for working with TypeScript.",
      author: "John Smith",
      date: "October 5, 2023",
    },
    {
      title: "JavaScript Essentials",
      description: "Everything you need to know about JavaScript.",
      author: "Alice Johnson",
      date: "October 10, 2023",
    },
    {
      title: "CSS Tricks",
      description: "Advanced techniques for styling your web pages.",
      author: "Bob Brown",
      date: "October 15, 2023",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const totalPages = Math.ceil(sampleData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sampleData.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <h1>Blog</h1>
      {paginatedData.map((blog, index) => (
        <BlogCard
          key={index}
          title={blog.title}
          description={blog.description}
          author={blog.author}
          date={blog.date}
        />
      ))}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "16px",
        }}
      >
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          style={{ marginRight: "8px", padding: "8px 16px", cursor: "pointer" }}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogPage;
