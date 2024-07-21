import { differenceInYears, formatDistance } from "date-fns";

export const calculateAge = (dob: Date) => {
  return differenceInYears(new Date(), dob);
};

export const createChatID = (a: string, b: string) => {
  return a > b ? `${b}-${a}` : `${a}-${b}`;
};

export const timeAgo = (date: Date) => {
  return formatDistance(date, new Date()) + " ago";
};
