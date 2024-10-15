"use client";

import { useState } from "react";
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

// Define the type for our student data
type Student = {
  id: string;
  name: string;
  courseId: string;
  goalGrade: string;
  objectives: string[];
  gender: "Male" | "Female" | "Other";
};

// Mock data for demonstration
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    courseId: "CS101",
    goalGrade: "A",
    objectives: ["Master programming basics", "Build a portfolio project"],
    gender: "Female",
  },
  {
    id: "2",
    name: "Bob Smith",
    courseId: "MATH201",
    goalGrade: "B+",
    objectives: ["Improve problem-solving skills", "Ace the final exam"],
    gender: "Male",
  },
  {
    id: "3",
    name: "Charlie Brown",
    courseId: "ENG102",
    goalGrade: "A-",
    objectives: ["Enhance writing skills", "Participate in class discussions"],
    gender: "Other",
  },
  // Add more mock students as needed
];

const StudentSwipePageComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const params = useParams();
  const matchingId = params.matchingId as string;

  const currentStudent = mockStudents[currentIndex];

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mockStudents.length);
      setSwipeDirection(null);
    }, 300);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <Link href="/dashboard" className="fixed top-8 left-8">
      Back
    </Link>
      <h1 className="text-3xl font-bold mb-6">Student Matcher</h1>
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
            <span>{currentStudent.name}</span>
            <Badge variant="secondary">{currentStudent.gender}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Course ID:</span>
            <span>{currentStudent.courseId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Goal Grade:</span>
            <Badge variant="outline">{currentStudent.goalGrade}</Badge>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Objectives:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {currentStudent.objectives.map((objective, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {objective}
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
    </div>
  );
};

export default StudentSwipePageComponent;
