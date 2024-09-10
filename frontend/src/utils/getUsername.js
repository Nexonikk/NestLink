"use client";

const getUsername = () => {
  let username = localStorage?.getItem("user");
  if (username?.startsWith('"') && username?.endsWith('"')) {
    username = username?.slice(1, -1);
  }
  return { username };
};

export default getUsername;
