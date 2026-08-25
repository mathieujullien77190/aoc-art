import { useEffect } from "react";

import { ChoicesProps } from "./types";

const nextChoice = (choices: string[], value: string) => {
  const index = choices.findIndex((item) => item === value);
  const nextIndex = index + 1;
  return choices[nextIndex % choices.length];
};

export const Choices = ({
  currentItem,
  current,
  value,
  onChange = () => {},
}: ChoicesProps) => {
  useEffect(() => {
    const move = (e: KeyboardEvent) => {
      if (e.code === "Enter" && currentItem.id === current) {
        const choice = nextChoice(currentItem.choices, value);
        onChange(choice);
      }
    };

    document.body.addEventListener("keyup", move);

    return () => {
      document.body.removeEventListener("keyup", move);
    };
  }, [current, value]);

  return <>{value || currentItem.choices[0]}</>;
};
