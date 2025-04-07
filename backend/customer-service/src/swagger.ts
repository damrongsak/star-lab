import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Customer Service API",
      version: "1.0.0",
      description: "API documentation for the Customer Service",
    },
    servers: [
      {
        url: "http://localhost:5002/customer-profile",
      },
    ],
  },
  apis: ["./routes/*.ts", "./app.ts"], // Path to the API docs
};

export default swaggerJsDoc(options);
