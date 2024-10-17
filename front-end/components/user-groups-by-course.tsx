import { UserData } from "../types";

interface UserGroupsByCourseProps {
  data: UserData[];
}

export const UserGroupsByCourse: React.FC<UserGroupsByCourseProps> = ({
  data,
}) => {
  const groupedData = data.reduce((acc, { User, MatchingCard }) => {
    const { course_code } = MatchingCard;
    if (!acc[course_code]) acc[course_code] = [];
    acc[course_code].push({ User, MatchingCard });
    return acc;
  }, {} as Record<string, UserData[]>);

  return (
    <div className="space-y-10">
      {Object.entries(groupedData).map(([course_code, users]) => (
        <div key={course_code}>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Course Code: {course_code}
          </h2>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {users.map(({ User, MatchingCard }, index) => (
              <div
                key={index}
                className="min-w-[80vw] p-4 bg-white shadow-md rounded-lg border flex-shrink-0"
              >
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900">
                      {User.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{User.gender}</p>
                  </div>
                  <div className="flex justify-center items-center font-bold w-8 h-8 border-gray-700 text-gray-700 border-solid border-2 rounded-lg">
                    {MatchingCard.grade}
                  </div>
                </div>
                <p className="mt-4 font-semibold text-gray-800">Objectives:</p>
                <ul className="list-disc pl-5 text-gray-700">
                  {MatchingCard.objective.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
