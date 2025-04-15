import { generateToken } from "../lib/utils.js"; // ✅ Sửa đúng tên hàm
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu ít nhất phải 6 ký tự" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const salt = await bcrypt.genSalt(10); // ✅
    const hashedPassword = await bcrypt.hash(password, salt); // ✅

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save(); // ✅ Lưu user trước

    generateToken(newUser._id, res); // ✅ Dùng đúng tên hàm

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message }); // ✅ Trả lỗi chi tiết hơn
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "thông tin không chính xác" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "thông tin không chính xác" });
    }
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    return res.status(400).json({ message: "lỗi server" });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    return res.status(400).json({ message: "lỗi server" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "cần có ảnh hồ sơ" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    console.log("Lỗi hồ sơ");
    return res.status(400).json({ message: "lỗi server" });
  }
};
export const checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa xác thực" });
    }

    res.status(200).json(req.user);
  } catch (error) {
    console.log("Lỗi checkAuth", error.message);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
