"use client";

import React, { useState } from "react";
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

const courseCodes = [
  "COMP1531",
  "COMP2511",
  "COMP2521",
  "COMP3121",
  "COMP3141",
  "COMP1511",
];
const grades = ["HD", "D", "CR", "PS"];

export const AddMatchingCardComponent = ({ setShow }: { setShow: any }) => {
  const [courseCode, setCourseCode] = useState("");
  const [aimingGrade, setAimingGrade] = useState("");
  const [objectives, setObjectives] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState("");

  const token = localStorage.getItem("academateToken");

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective("");
    }
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    console.log({ courseCode, aimingGrade, objectives });
    try {
      fetch("http://localhost:52533/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          course_code: courseCode,
          grade: aimingGrade,
          objective: objectives[0],
        }),
      }).then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setShow(false);
        } else {
          const data = await response.json();
          console.error(data.message);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 absolute h-screen w-screen">
      <div
        className="absolute inset-0 bg-gray-900 opacity-50"
        onClick={() => setShow(false)}
      />
      <Card className="w-full max-w-md mx-auto z-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Add New Matching Card
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
            <div className="space-y-2">
              <Label htmlFor="objectives">Objectives</Label>
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input value={objective} readOnly />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveObjective(index)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove objective</span>
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
                <Button type="button" onClick={handleAddObjective} size="icon">
                  <PlusCircle className="h-4 w-4" />
                  <span className="sr-only">Add objective</span>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => setShow(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Card</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
