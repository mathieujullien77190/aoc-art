/** @format */
import { useState, useEffect } from "react";

import { hackLines } from "./constants";
import { LoadingProps } from "./types";
import * as S from "./UI";

const hackAnim = (counter: number) => {


  return counter < hackLines.length
    ? hackLines
      .slice(0, counter % hackLines.length)
      .reverse()
      .join("\n")
    : "System initialization : ready";
};

export const Loading = ({
  speed,
  onFinish = () => { },
}: LoadingProps) => {
  const [startLoading, setStartLoading] = useState<boolean>(true);
  const [screenHeight, setScreenHeight] = useState<number>()
  const [counterHack, setCounterHack] = useState<number>(0);

  useEffect(() => {
    const timerStartLoading = setTimeout(() => {
      setStartLoading(false);
    }, speed * 20);

    return () => {
      clearInterval(timerStartLoading);
    };
  }, []);

  useEffect(() => {
    let timerHack: any;
    if (!startLoading) {
      timerHack = setInterval(() => {
        setCounterHack((prev) => prev + 1);
      }, speed);
    }

    return () => {
      clearInterval(timerHack);
    };
  }, [startLoading]);

  useEffect(() => {
    if (counterHack > hackLines.length) {
      onFinish();
    }
  }, [counterHack]);

  useEffect(() => {
    setScreenHeight(document.body.getBoundingClientRect().height)
  }, [])


  return (
    <S.Container>
      <>

        <S.HackText height={screenHeight}>{!startLoading ? hackAnim(counterHack) : "loading..."}</S.HackText>

        <S.LoadingScreen>
          {!startLoading && (
            <S.CommandText>Press DEL to run BIOS</S.CommandText>
          )}
        </S.LoadingScreen>
      </>
    </S.Container>
  );
};
