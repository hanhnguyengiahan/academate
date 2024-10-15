"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("academateToken");

    if (!token) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  }, []);
  return <div></div>;
};

export default Home;
