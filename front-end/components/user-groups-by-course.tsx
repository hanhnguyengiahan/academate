import { UserData } from "../types";
import { Button } from "./ui/button";

interface UserGroupsByCourseProps {
  data: UserData[];
}

export const UserGroupsByCourse: React.FC<UserGroupsByCourseProps> = ({
  data,
}) => {
  const token = localStorage.getItem("academateToken");

  const acceptFriendRequest = async (userId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, friend_request_id: userId }),
        }
      );

      if (response.ok) {
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Error accepting friend request:", errorData);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  // Group the data by course code
  const groupedData = data.reduce((acc, { matchingCard, sender, _id }) => {
    const { course_code } = matchingCard;
    if (!acc[course_code]) acc[course_code] = [];
    acc[course_code].push({ matchingCard, sender, _id });
    return acc;
  }, {} as Record<string, { matchingCard: any; sender: any, _id: string }[]>);

  return (
    <div className="space-y-10">
      {Object.entries(groupedData).map(([course_code, users]) => (
        <div key={course_code}>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Course Code: {course_code}
          </h2>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {users.map(({ matchingCard, sender, _id }, index) => (
              <div
                key={index}
                className="min-w-[80vw] p-4 bg-white shadow-md rounded-lg border flex-shrink-0"
              >
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900">
                      {sender.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {sender.gender}
                    </p>
                  </div>
                  <div className="flex justify-center items-center font-bold w-8 h-8 border-gray-700 text-gray-700 border-solid border-2 rounded-lg">
                    {matchingCard.grade}
                  </div>
                </div>
                <p className="mt-4 font-semibold text-gray-800">Objectives:</p>
                <ul className="list-disc pl-5 text-gray-700">
                  {matchingCard.objective.map((obj: string, i: number) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul> 
                <div className="mt-4">
                  <Button
                    className="bg-green-400"
                    onClick={() => acceptFriendRequest(_id)}
                  >
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
