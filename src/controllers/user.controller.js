import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiReponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  // console.log(fullname, email, username, password);

  if (
    [fullname, email, username, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already existing");
  }

  const avatarLocalPath = req.fields?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  const avatarRes = await uploadOnCloudinary(avatarLocalPath);
  const coverImageRes = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatarRes) {
    throw new ApiError(400, "Avatar image is required");
  }

  const userRes = await User.create({
    fullname,
    avatar: avatarRes.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(userRes._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to register user");
  }

  return res
    .status(201)
    .json(new ApiReponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
