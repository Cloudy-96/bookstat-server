import { Router } from "express";
import {
  create,
  createProfile,
  getAllUsers,
  getUserByID,
  // updateUserByID
} from "../controllers/user.js";
import { validateAuthentication, validateId } from "../middleware/auth.js";

const router = Router();

router.post("/register", create);
router.get("/", getAllUsers);
router.get("/:id", getUserByID);

router.put("/:id", validateAuthentication, validateId, createProfile);

export default router;

// router.put("/:id", updateUserByID);
