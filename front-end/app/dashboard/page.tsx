"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AddMatchingCardComponent } from "@/components/add-matching-card";

// Define the type for our matching card data
type MatchingCard = {
  id: string;
  courseCode: string;
  aimingGrade: string;
  objectives: string[];
};

// Mock data for demonstration
const mockMatchingCards: MatchingCard[] = [
  {
    id: "MC001",
    courseCode: "CS101",
    aimingGrade: "A",
    objectives: [
      "Master basic programming concepts",
      "Complete all assignments on time",
    ],
  },
  {
    id: "MC002",
    courseCode: "MATH201",
    aimingGrade: "B+",
    objectives: ["Improve calculus skills", "Attend all tutorial sessions"],
  },
  {
    id: "MC003",
    courseCode: "ENG102",
    aimingGrade: "A-",
    objectives: [
      "Enhance essay writing skills",
      "Participate actively in class discussions",
    ],
  },
  {
    id: "MC004",
    courseCode: "PHYS101",
    aimingGrade: "B",
    objectives: [
      "Understand fundamental physics concepts",
      "Perform well in lab experiments",
    ],
  },
];

const DashboardPageComponent = () => {
  const navigation = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {showModal && <AddMatchingCardComponent setShow={setShowModal} />}
      <header className="bg-white shadow pb-4">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <Button
          variant="outline"
          className="ml-4"
          onClick={() => setShowModal(true)}
        >
          Add Matching Preference
        </Button>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Your Matching Cards
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockMatchingCards.map((card) => (
                <Card
                  key={card.id}
                  className="hover:shadow-lg transition-shadow duration-300"
                  onClick={() => navigation.push(`/matching/${card.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{card.courseCode}</span>
                      <Badge variant="secondary">{card.aimingGrade}</Badge>
                    </CardTitle>
                    <CardDescription>ID: {card.id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-2">Objectives:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {card.objectives.map((objective, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPageComponent;
