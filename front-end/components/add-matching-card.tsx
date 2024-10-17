"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, X } from "lucide-react";
import { MatchingCard } from "@/app/dashboard/page";

const courseCodes = ["COMP1531", "COMP2511", "COMP2521", "COMP3121", "COMP3141", "COMP1511"];
const grades = ["HD", "D", "CR", "PS"];

interface AddMatchingCardProps {
  setShow: (value: boolean) => void;
  card?: MatchingCard | null;
}

export const AddMatchingCardComponent: React.FC<AddMatchingCardProps> = ({ setShow, card }) => {
  const [courseCode, setCourseCode] = useState(card?.course_code || "");
  const [aimingGrade, setAimingGrade] = useState(card?.grade || "");
  const [objectives, setObjectives] = useState<string[]>(card?.objective || []);
  const [newObjective, setNewObjective] = useState("");

  const token = localStorage.getItem("academateToken");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/match`;

    const method = card ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, course_code: courseCode, grade: aimingGrade, objective: objectives, _id: card?._id }),
      });

      if (response.ok) {
        setShow(false);
      } else {
        console.error("Failed to save the card");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 absolute h-screen w-screen">
      <div className="absolute inset-0 bg-gray-900 opacity-50" onClick={() => setShow(false)} />
      <Card className="w-full max-w-md mx-auto z-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {card ? "Edit Matching Card" : "Add New Matching Card"}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Course Code Input */}
            <div className="space-y-2">
              <Label htmlFor="courseCode">Course Code</Label>
              <Select value={courseCode} onValueChange={setCourseCode}>
                <SelectTrigger id="courseCode">
                  <SelectValue placeholder="Select a course code" />
                </SelectTrigger>
                <SelectContent>
                  {courseCodes.map((code) => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Grade Input */}
            <div className="space-y-2">
              <Label htmlFor="aimingGrade">Aiming Grade</Label>
              <Select value={aimingGrade} onValueChange={setAimingGrade}>
                <SelectTrigger id="aimingGrade">
                  <SelectValue placeholder="Select a grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Objectives Input */}
            <div className="space-y-2">
              <Label htmlFor="objectives">Objectives</Label>
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input value={objective} readOnly />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setObjectives(objectives.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  id="newObjective"
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Enter a new objective"
                />
                <Button type="button" onClick={() => setObjectives([...objectives, newObjective])}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => setShow(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Card</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
