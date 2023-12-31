import { Prisma } from "@prisma/client";
import { sendDataResponse, sendMessageResponse } from "../utils/responses.js";
import { JWT_SECRET } from "../utils/config.js";
import jwt from "jsonwebtoken";
// import Book from "../domain/book.js";
import User from "../domain/user.js";

export async function validateId(req, res, next) {
  if (!req.user) {
    return sendMessageResponse(res, 401, "Unable to verify user");
  }

  if (req.user.id === Number(req.params.id)) {
    next();
  } else {
    return sendDataResponse(res, 403, {
      authorization: "You are not authorized to perform this action",
    });
  }
}

export async function validateAuthentication(req, res, next) {
  const header = req.header("authorization");

  if (!header) {
    return sendDataResponse(res, 401, {
      authorization: "Missing Authorization header",
    });
  }

  const [type, token] = header.split(" ");

  const isTypeValid = validateTokenType(type);
  if (!isTypeValid) {
    return sendDataResponse(res, 401, {
      authentication: `Invalid token type, expected Bearer but got ${type}`,
    });
  }

  const isTokenValid = validateToken(token);
  if (!isTokenValid) {
    return sendDataResponse(res, 401, {
      authentication: "Invalid or missing access token",
    });
  }

  const decodedToken = jwt.decode(token);
  const foundUser = await User.findById(decodedToken.userId);
  delete foundUser.passwordHash;

  req.user = foundUser;

  next();
}

function validateToken(token) {
  if (!token) {
    return false;
  }

  return jwt.verify(token, JWT_SECRET, (error) => {
    return !error;
  });
}

function validateTokenType(type) {
  if (!type) {
    return false;
  }

  if (type.toUpperCase() !== "BEARER") {
    return false;
  }

  return true;
}

// export async function validateEditBookAuth(req, res, next) {
//   if (!req.user) {
//     return sendMessageResponse(res, 401, "Unable to verify user");
//   }

//   try {
//     const post = await findById(Number(req.params.id));
//     if (req.user.id === book.user.id ) {
//       req.post = post;
//     } else {
//       return sendDataResponse(res, 403, {
//         authorization: "You are not authorized to perform this action",
//       });
//     }
//   } catch (e) {
//     if (e instanceof Prisma.PrismaClientKnownRequestError) {
//       if (e.code === "P2025") {
//         console.error(e);
//         return sendDataResponse(res, 404, { error: "Book not found" });
//       }
//     }
//   }

//   next();
// }
