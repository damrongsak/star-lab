import { Router } from "express";
import { CustomerProjectController } from "../controllers/CustomerProjectController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const customerProjectController = new CustomerProjectController();

router.use(authMiddleware);

router.post("/", customerProjectController.createProject);
router.get("/", customerProjectController.getProjects);
router.get("/:id", customerProjectController.getProject);
router.put("/:id", customerProjectController.updateProject);
router.delete("/:id", customerProjectController.deleteProject);

export default router;
