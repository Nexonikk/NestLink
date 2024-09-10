"use client";

import { useState, useEffect, useRef } from "react";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    const token = document.cookie?.split(";");

    if (!isMounted) {
      if (token) {
        setIsLoggedIn(true);
      }
    }

    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  return { isLoggedIn };
};

export default useAuth;
