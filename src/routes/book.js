import { Router } from 'express';
import {
  create,
  getById,
  getAll,
  updateById,
  // getByStatus,
  // getByTitle,
  deleteBook,
} from "../controllers/book.js";
// import {
//   validateAuthentication,
//   validateIdOrRole,
// } from "../middleware/auth.js";

const router = Router();

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);
router.delete("/:id", deleteBook);
router.patch("/:id", updateById);

// TODO: 
// router.get("/status", getByStatus);
// router.get("/title", getByTitle);


export default router;


// router.get("/:title", getByTitle);
// router.delete("/:id/:status", deleteBook); //delete from reading list (therefore, need id, and to see if it is in the list)
// router.patch("/:id", updateById);