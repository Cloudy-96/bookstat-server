import { Prisma } from "@prisma/client";
import User from "../domain/user.js";

import { sendDataResponse } from "../utils/responses.js";

export const create = async (req, res) => {
  const { email, password } = req.body;

  // check email meets requirements to be a proper email adress
  if (!User.emailValidation(email)) {
    return sendDataResponse(res, 400, { error: "Email format invalid" });
  }
  //check provided and proper
  if (!password) {
    return sendDataResponse(res, 400, { error: "Password is required" });
  }
  if (!User.passwordValidation(password)) {
    return sendDataResponse(res, 400, {
      error:
        "Password must contain at least one upper case character, at least one number, at least one special character and not be less than 8 characters in length.",
    });
  }

  // convert
  const userToCreate = await User.fromJson({
    email,
    password,
  });

  try {
    //check if details already exist
    const existingUser = await User.findByEmail(userToCreate.email);

    if (existingUser) {
      return sendDataResponse(res, 400, {
        error: "email already in use",
      });
    }
    // check email provided
    if (!userToCreate.email) {
      return sendDataResponse(res, 400, {
        error: "Email is required",
      });
    } 

    // const newUser = await userToCreate.save();
    // console.log("createdUser-------", newUser);

    // return sendDataResponse(res, 201, newUser);
  } catch (error) {
    console.error(`Error when creating new User Profile \n`, error);
    return sendDataResponse(res, 500, { error: "Unable to create new user" });
  }
};
