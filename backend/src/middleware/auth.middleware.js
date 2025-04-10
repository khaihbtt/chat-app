import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    const user = await User.findById(decoded.userId).select("-password"); // ✅ Sửa ở đây

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    req.user = user; // ✅ Gán user vào req để middleware sau sử dụng

    next();
  } catch (error) {
    console.log("Lỗi protectRoute middleware:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
};
