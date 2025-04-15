import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  // Female Users
  {
    email: "khaipkka4@gmail.com",
    fullName: "Huu Khai",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "quyenpkka4@gmail.com",
    fullName: "Do Quyen",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    email: "hieupkka4@gmail.com",
    fullName: "Trung Hieu",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    email: "thuypkka4@gmail.com",
    fullName: "Thu Thuy",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/13.jpg",
  },
  {
    email: "maipkka4@gmail.com",
    fullName: "Mai",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/9.jpg",
  },
  {
    email: "tungpkka4@gmail.com",
    fullName: "Do Tung",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/9.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();
