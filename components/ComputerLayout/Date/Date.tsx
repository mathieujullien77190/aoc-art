/** @format */
import { useState, useEffect } from "react";

import { DateProps } from "./types";
import * as S from "./UI";
import { rand as random } from "../helpers/math";

const addBug = (time: string): string => {
  const rand = random(0, 10)
  const splitTime = time.split("")

  if (rand === 1) {
    return splitTime.map(item => item !== ":" && random(0, 5) === 1 ? "#" : item).join("")
  }
  return time
}

const animDate = (withTime: boolean, withDate: boolean): string => {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toTimeString().split(" ")[0];


  const time2 = addBug(time)

  if (withTime && withDate) return `${time2} | ${date}`;
  if (withTime) return time2;
  if (withDate) return date;
  return "";
};

export const DateComponent = ({
  withTime = false,
  withDate = false,
}: DateProps) => {
  const [currentDate, setCurrentDate] = useState<string>();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(animDate(withTime, withDate));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <S.Container>{currentDate}</S.Container>;
};
