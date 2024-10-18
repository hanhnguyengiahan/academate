"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const token = localStorage.getItem("academateToken");

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  }, [token]);
  return <div></div>;
};

export default Home;
