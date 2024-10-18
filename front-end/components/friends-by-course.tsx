import { Friend } from "@/types";
import { Button } from "./ui/button";

interface FriendsByGroupProps {
  data: Friend[];
}

export const FriendsByGroup: React.FC<FriendsByGroupProps> = ({ data }) => {
  const token = localStorage.getItem("academateToken");

  const acceptFriendRequest = async (friendId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, friend_request_id: friendId }),
        }
      );

      if (response.ok) {
        alert("Friend request accepted!");
      } else {
        const errorData = await response.json();
        alert(`Failed to accept request: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  // Group the data by course code
  const groupedData = data.reduce((acc, friend) => {
    const { course_code } = friend;
    if (!acc[course_code.course_code]) acc[course_code.course_code] = [];
    acc[course_code.course_code].push(friend);
    return acc;
  }, {} as Record<string, Friend[]>);

  return (
    <div className="space-y-10">
      {Object.entries(groupedData).map(([course_code, friends]) => (
        <div key={course_code}>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Course Code: {course_code}
          </h2>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {friends.map(({ _id, name, email, gender }) => (
              <div
                key={_id}
                className="min-w-[80vw] p-4 bg-white shadow-md rounded-lg border flex-shrink-0"
              >
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900">{name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{gender}</p>
                    <p className="text-sm text-gray-500">{email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
