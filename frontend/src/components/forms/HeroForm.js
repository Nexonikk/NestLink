"use client";

import { addUser, selectUser } from "@/store/slices/userSlice";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function HeroForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPassOpen, setIsPassOpen] = useState(false);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting form...");
      const res = await axios.post(
        `${BACKEND_URL}/auth/register`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Response data:", res.data);
      const { data } = res.data;
      localStorage.setItem("user", JSON.stringify(data?.username));
      router.push("/account");
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="inline-flex items-center shadow-lg bg-white  shadow-gray-500/20 "
      >
        <span className="bg-white py-4 pl-4">NestLinks.to/</span>
        <input
          onChange={(ev) => {
            setUsername(ev.target.value);
          }}
          value={username}
          type="text"
          className="border-none outline-none"
          style={{ backgroundColor: "white", marginBottom: 0, paddingLeft: 0 }}
          placeholder="username"
          required
        />
        <button
          className="bg-blue-500 text-white py-4 px-6 whitespace-nowrap"
          onClick={() => {
            setIsPassOpen(true);
          }}
        >
          Join for Free
        </button>
      </form>
      {isPassOpen && (
        <div className="flex fixed items-center justify-center mt-1">
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-center"
          >
            <input
              type="password"
              value={password}
              onChange={(ev) => {
                setPassword(ev.target.value);
              }}
              className="border-none outline-none rounded-md p-2 w-full"
              placeholder="Password"
            />
            <button className="bg-blue-500 text-white py-2 px-4 mt-2">
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  );
}
