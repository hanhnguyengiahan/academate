'use client'

import { UserGroupsByCourse } from "@/components/user-groups-by-course";
import { UserData } from "@/types";
import { useEffect, useState } from "react";

const RequestsPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const token = localStorage.getItem("academateToken");

  const getRequests = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/received`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setUsers(data.received_requests);
    } else {
      console.error("Failed to get friend requests:", data);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Requests</h1>
      <UserGroupsByCourse data={users} />
    </div>
  );
};

export default RequestsPage;
