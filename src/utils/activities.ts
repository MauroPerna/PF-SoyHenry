import axios from "axios";
import { QueryFunctionContext } from "react-query";
import { getCityById } from "./cities";
import { Activity, CityInDB, Comment, Rating } from "./interface";
export const getActivities = async (
  wCity?: string,
  wName?: string,
  maxPrice?: number,
  sort?: string,
  sortBy?: string
) => {
  let urlGet = `/api/activities?`;
  sort ? (urlGet += `&sort=${sort}`) : "";
  wCity ? (urlGet += `&wCity=${wCity}`) : "";
  wName ? (urlGet += `&wName=${wName}`) : "";
  maxPrice ? (urlGet += `&maxPrice=${maxPrice}`) : "";
  sortBy ? (urlGet += `&sortBy=${sortBy}`) : "";
  const activities = await axios.get(urlGet);
  return activities.data;
};

export const getActivitiesId = async (
  id: QueryFunctionContext<string[], any>
) => {
  const activity = await axios.get(`/api/activities/${id}`);
  return activity.data;
};

export const createActivity = async ({
  name,
  image,
  cityName,
  availability,
  description,
  price,
}: Activity) => {
  try {
    const activity = await axios.post("/api/activities", {
      name,
      image,
      cityName,
      availability,
      description,
      price,
    });
    console.log(activity);
    console.log(activity.data);
    return activity.data;
  } catch (err) {
    console.error(err);
  }
};

export interface Props {
  comment: string;
  mail: string;
  rating: number;
  id: string;
}

export const patchActivity = async ({ comment, mail, rating, id }: Props) => {
  try {
    const commentRating = await axios.patch(`/api/activities/${id}`, {
      comment,
      mail,
      rating,
    });

    return commentRating.data;
  } catch (err) {
    console.error(err);
  }
};
