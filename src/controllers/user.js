import { Prisma } from "@prisma/client";
import User from "../domain/user.js";

import { sendDataResponse } from "../utils/responses.js";

export const getAllUsers = async (req, res) => {
  const { name } = req.query;

  const mapOutUsers = (users) => {
    return users.map((item) => {
      return {
        ...item.toJSON().user,
      };
    });
  };

  if (name) {
    const users = await User.findByName(name).then((users) =>
      mapOutUsers(users)
    );

    if (users.length > 0) {
      return sendDataResponse(res, 200, { users });
    } else {
      return sendDataResponse(res, 404, { error: "User not found" });
    }
  } else {
    const users = await User.findAll().then((users) => mapOutUsers(users));

    return sendDataResponse(res, 200, { users });
  }
};

export const getUserByID = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const foundUser = await User.findById(id);

    if (!foundUser) {
      return sendDataResponse(res, 404, { error: "User not found" });
    }

    console.log("foundUser-------------", foundUser);
    return sendDataResponse(res, 200, foundUser);
  } catch (e) {
    return sendDataResponse(res, 500, { error: "Unable to get user" });
  }
};

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

  console.log(
    "userToCreate-------------------------------------------",
    userToCreate
  );
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

    const newUser = await userToCreate.save();
    console.log("createdUser-------", newUser);

    return sendDataResponse(res, 201, newUser);
  } catch (error) {
    console.error(`Error when creating new User Profile \n`, error);
    return sendDataResponse(res, 500, { error: "Unable to create new user" });
  }
};

// TODO: bug fixes
export const createProfile = async (req, res) => {
  const profile = {
    create: {},
  };

  if (req.body.firstName) {
    profile.create.firstName = req.body.firstName;
  } else {
    return sendDataResponse(res, 400, "Please provide a first name");
  }

  if (req.body.lastName) {
    profile.create.lastName = req.body.lastName;
  } else {
    return sendDataResponse(res, 400, "Please provide a last name");
  }

  if (req.body.bio) {
    profile.create.bio = req.body.bio;
  }

  try {
    const updatedUser = await User.createProfile(
      Number(req.params.id),
      profile
    );
    delete updatedUser.password;
    return sendDataResponse(res, 201, updatedUser);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(e.code, e.message);
      return sendDataResponse(res, 400, "error");
    } else {
      console.log(e);
      return sendDataResponse(res, 400, "error");
    }
  }
};
