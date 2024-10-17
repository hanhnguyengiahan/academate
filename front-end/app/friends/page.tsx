import { UserGroupsByCourse } from "@/components/user-groups-by-course";
import { UserData } from "@/types";

export const mockData: UserData[] = [
  {
    User: { name: "Alice", gender: "Female" },
    MatchingCard: {
      course_code: "1511",
      grade: "HD",
      objective: ["Improve math", "Get higher grades"],
    },
  },
  {
    User: { name: "Bob", gender: "Male" },
    MatchingCard: {
      course_code: "1511",
      grade: "D",
      objective: ["Learn faster algorithms"],
    },
  },
  {
    User: { name: "Charlie", gender: "Non-binary" },
    MatchingCard: {
      course_code: "1512",
      grade: "D",
      objective: ["Explore advanced topics", "Publish research"],
    },
  },
];

const FriendsPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Friends</h1>
      <UserGroupsByCourse data={mockData} />
    </div>
  );
};

export default FriendsPage;
