"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AddMatchingCardComponent } from "@/components/add-matching-card";

// Define the type for matching card data
export type MatchingCard = {
  _id: string;
  course_code: string;
  grade: string;
  objective: string[];
};

const DashboardPageComponent = () => {
  const navigation = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [matchingCards, setMatchingCards] = useState<MatchingCard[]>([]);
  const [editingCard, setEditingCard] = useState<MatchingCard | null>(null);

  const token = localStorage.getItem("academateToken");

  if (!token) {
    navigation.push("/login");
  }

  useEffect(() => {
    fetchCards();
  }, [token, showModal]);

  const fetchCards = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/match/read_all`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMatchingCards(data);
      } else {
        localStorage.removeItem("academateToken");
        navigation.push("/login");
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem("academateToken");
      navigation.push("/login");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/match/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, _id: id }),
        }
      );

      if (response.ok) {
        setMatchingCards((prev) => prev.filter((card) => card._id !== id));
      } else {
        console.error("Failed to delete the card");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (card: MatchingCard) => {
    setEditingCard(card);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {showModal && (
        <AddMatchingCardComponent setShow={setShowModal} card={editingCard} />
      )}
      <header className="bg-white shadow pb-4">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <Button
          variant="outline"
          className="ml-4"
          onClick={() => {
            setEditingCard(null);
            setShowModal(true);
          }}
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
              {matchingCards.map((card) => (
                <Card
                  key={card._id}
                  className="hover:shadow-lg transition-shadow duration-300"
                  onClick={() => navigation.push(`/matching/${card._id}`)}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{card.course_code}</span>
                      <Badge variant="secondary">{card.grade}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-2">Objective:</h4>
                    <ul className="list-disc pl-4">
                      {card.objective.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                    <div className="mt-4 flex space-x-2 z-20">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(card)}
                      >
                        Edit
                      </Button>
                      <Button size="sm" onClick={() => handleDelete(card._id)}>
                        Delete
                      </Button>
                    </div>
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
