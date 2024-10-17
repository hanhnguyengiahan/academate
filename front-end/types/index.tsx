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
  User: User;
  MatchingCard: MatchingCard;
};
