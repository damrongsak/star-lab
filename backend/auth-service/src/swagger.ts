import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsDoc.Options = {
  // Optional: Type annotation for swaggerOptions
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lab Portal API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.ts"], // IMPORTANT: Update apis path to point to your TypeScript route files
};

export default swaggerJsDoc(swaggerOptions); // Generate swagger spec
