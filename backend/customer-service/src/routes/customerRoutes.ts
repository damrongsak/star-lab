import express from "express";
import CustomerController from "../controllers/customerController";
// Middleware
import { authenticateToken } from "../middlewares/authMiddleware";
const router = express.Router();

// --- Customer Management Routes ---
router.post("/", CustomerController.createCustomer); // POST /customers - Create
router.get("/", authenticateToken, CustomerController.getAllCustomers); // GET /customers - Read All
/**
 * @swagger
 * /customer-profile/{id}:
 * get:
 * summary: Get a customer by ID
 * description: Get a customer by ID
 * parameters:
 *  - in: path
 *  name: id
 *  required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: A customer object
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * id:
 * type: integer
 * description: The customer ID
 * first_name:
 * type: string
 * description: The customer's first name
 * last_name:
 * type: string
 * description: The customer's last name
 * email:
 * type: string
 * description: The customer's email address
 * 404:
 * description: Customer not found
 */
router.get("/:id", CustomerController.getCustomerById); // GET /customers/:id - Read One
router.put("/:id", CustomerController.updateCustomer); // PUT /customers/:id - Update
router.delete("/:id", CustomerController.deleteCustomer); // DELETE /customers/:id - Delete

export default router;
