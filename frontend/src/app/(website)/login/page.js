"use client";

import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `${BACKEND_URL}/auth/login`,
      {
        username,
        password,
      },
      {
        withCredentials: true,
      }
    );
    const { data } = response.data;
    localStorage.setItem("user", JSON.stringify(data?.username));
    router.push("/account");
    console.log(data);
  };

  return (
    <>
      {isLoggedIn ? (
        <div>
          <div className="p-4 max-w-xs mx-auto items-center justify-center flex flex-col my-10">
            <h1 className="text-4xl font-bold text-center mb-2">
              You are already logged in
            </h1>
            <p className="text-center mb-6 text-gray-500">
              You are already logged in. If you want to log out, click the
              button below.
            </p>
            <button className="bg-red-500 hover:bg-red-600 text-white  font-bold py-2 px-4 rounded">
              Log out
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col items-center justify-center p-4 max-w-xs mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2 flex">
              Sign In
            </h1>
            <form onSubmit={handleSubmit} className=" flex-col w-full gap-2 ">
              <input
                onChange={(ev) => {
                  setUsername(ev.target.value);
                }}
                value={username}
                type="text"
                className="border-none outline-none"
                placeholder="Username"
                required
              />
              <input
                onChange={(ev) => {
                  setPassword(ev.target.value);
                }}
                value={password}
                type="password"
                className="border-none outline-none p-2 w-full"
                placeholder="Password"
                required
              />
              <button className="bg-blue-500 justify-center items-center rounded-lg text-white p-2 m-4 whitespace-nowrap ">
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
