import Hashids from "hashids";
import { PostRow, UsersRow } from "./types/type-collection";

const hashids = new Hashids("", 10);

export function convertDate(dateTimestamp: string) {
  const arr = dateTimestamp.split(" ");
  const date = arr.slice(1, 4).join(" ");
  let isDay;

  const timeArr = arr[4].split(":");
  let hour = +timeArr[0];
  if (+timeArr[0] > 12) {
    hour = +timeArr[0] - 12;
    isDay = false;
  } else {
    isDay = true;
  }

  timeArr[0] = String(hour);

  return `${date} ${hour}:${timeArr[1]} ${isDay ? "AM" : "PM"}`;
}

export function isTypePostRow(x: any): x is PostRow {
  if ("reply_to_id" in x) {
    return true;
  }

  return false;
}

export { hashids };
