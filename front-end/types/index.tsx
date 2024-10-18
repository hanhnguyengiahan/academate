export type User = {
  name: string;
  gender: string;
};

export type MatchingCard = {
  course_code: string;
  grade: string;
  objective: string[];
};

export type UserData = {
  sender: User;
  matchingCard: MatchingCard;
  _id: string;
};

export type Friend = {
  course_code: {
    course_code: string;
  };
  _id: string;
  email: string;
  gender: string;
  name: string;
};
