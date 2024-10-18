"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Define the updated Student type
type Student = {
  _id: string;
  course_code: string;
  grade: string;
  objective: string[];
  userGender: string;
  userName: string;
};

const StudentSwipePageComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<Student[]>([]);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );

  const params = useParams();
  const matchingId = params.matchingId as string;
  const token = localStorage.getItem("academateToken");

  const currentStudent = matches[currentIndex];

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction);
    setTimeout(() => {
      if (currentIndex < matches.length - 1) {
        // Move to the next match if available
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        // No more matches left
        setCurrentIndex(-1); // -1 indicates no matches left
      }
      setSwipeDirection(null);
    }, 300);
  };

  const getStudents = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/match/matching`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, _id: matchingId }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const filteredMatches = data.matchingResult.filter(
        (match: Student) => match._id !== matchingId
      );
      setMatches(filteredMatches); // Update state with fetched students
    } else {
      const errorData = await response.json();
      console.error(errorData.message);
    }
  };

  useEffect(() => {
    getStudents();
  }, [matchingId]);

  console.log(matches);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Link href="/dashboard" className="fixed top-8 left-8">
        Back
      </Link>
      <h1 className="text-3xl font-bold mb-6">Student Matcher</h1>
      {currentIndex === -1 ? (
        <p className="text-xl text-gray-500">No matches left</p>
      ) : (
        currentStudent && (
          <Card
            className={`w-full max-w-md transition-transform duration-300 ease-in-out ${
              swipeDirection === "left"
                ? "-translate-x-full opacity-0"
                : swipeDirection === "right"
                ? "translate-x-full opacity-0"
                : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{currentStudent.userName}</span>
                <Badge variant="secondary">{currentStudent.userGender}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Course Code:</span>
                <span>{currentStudent.course_code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Grade:</span>
                <Badge variant="outline">{currentStudent.grade}</Badge>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Objectives:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {currentStudent.objective.map((obj, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleSwipe("left")}
                aria-label="Swipe Left"
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleSwipe("right")}
                aria-label="Swipe Right"
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )
      )}
    </div>
  );
};

export default StudentSwipePageComponent;
