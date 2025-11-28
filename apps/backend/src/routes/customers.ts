import express from "express";
import { CustomerController } from "../controllers/CustomerController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireRole, requireCustomer } from "../middleware/rbacMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();
const customerController = new CustomerController();

// Customer routes (for customers accessing their own data)
router.get(
  "/profile",
  authMiddleware,
  requireCustomer(),
  customerController.getProfile.bind(customerController),
);
router.put(
  "/profile",
  authMiddleware,
  requireCustomer(),
  customerController.updateProfile.bind(customerController),
);
router.get(
  "/statistics",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  customerController.getStatistics.bind(customerController),
);

// Admin routes (for lab admins to manage customers)
router.get(
  "/",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  customerController.getAllCustomers.bind(customerController),
);

router.get(
  "/search",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  customerController.searchCustomers.bind(customerController),
);

router.get(
  "/:id",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  customerController.getCustomerById.bind(customerController),
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole([UserRole.ADMIN]),
  customerController.deleteCustomer.bind(customerController),
);

export default router;
