import React from "react";

const projects = [
  {
    id: 1,
    name: "Project Alpha",
    description: "A cutting-edge project focused on AI development.",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Project Beta",
    description: "An innovative project exploring blockchain technology.",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Project Gamma",
    description: "A creative project in the field of virtual reality.",
    imageUrl: "https://via.placeholder.com/150",
  },
];

const Products = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow"
        >
          <img
            src={project.imageUrl}
            alt={project.name}
            className="w-full h-40 object-cover rounded-t-lg"
          />
          <div className="mt-4">
            <h2 className="text-lg font-bold">{project.name}</h2>
            <p className="text-gray-600">{project.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
