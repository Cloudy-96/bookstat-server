import { Router } from "express";

import {
  create,
  createProfile,
  getAllUsers,
  getUserByID,
  // updateUserByID
} from "../controllers/user.js";

import {
  validateAuthentication,
  validateId,
} from "../middleware/auth.js";
const router = Router();

// // In index.js, we told express that the /customer route should use this router file
// // The below /register route extends that, so the end result will be a URL
// // that looks like http://localhost:4000/customer/register
router.post("/register", create);

router.get("/", getAllUsers);
router.get("/:id", getUserByID);

router.put("/:id",validateId, validateAuthentication, createProfile);

export default router;

// router.get("/:id", getUserByID);
// router.put("/:id", updateUserByID);
