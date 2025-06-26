import express from "express";
import { CustomerController } from "../controllers/CustomerController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();
const customerController = new CustomerController();

// Customer routes (for customers accessing their own data)
router.get(
  "/profile",
  authMiddleware,
  customerController.getProfile.bind(customerController),
);
router.put(
  "/profile",
  authMiddleware,
  customerController.updateProfile.bind(customerController),
);
router.get(
  "/statistics",
  authMiddleware,
  customerController.getStatistics.bind(customerController),
);

// Admin routes (for lab admins to manage customers)
router.get(
  "/",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  customerController.getAllCustomers.bind(customerController),
);

router.get(
  "/search",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  customerController.searchCustomers.bind(customerController),
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  customerController.getCustomerById.bind(customerController),
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  customerController.deleteCustomer.bind(customerController),
);

export default router;
