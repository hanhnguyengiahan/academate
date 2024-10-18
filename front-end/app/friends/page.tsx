'use client'

import { FriendsByGroup } from "@/components/friends-by-course";
import { UserGroupsByCourse } from "@/components/user-groups-by-course";
import { Friend } from "@/types";
import { useEffect, useState } from "react";

const RequestsPage: React.FC = () => {
  const [users, setUsers] = useState<Friend[]>([]);
  const token = localStorage.getItem("academateToken");

  const getFriends = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/friends`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );

    const data = await response.json();
    console.log("tthis is from backend:", data);

    if (response.ok) {
      setUsers(data.friends);
    } else {
      const errorData = await response.json();
      console.error(errorData.message);
    }
  };


  useEffect(() => {
    getFriends();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Friends</h1>
      <FriendsByGroup data={users} />
    </div>
  );
};

export default RequestsPage;
