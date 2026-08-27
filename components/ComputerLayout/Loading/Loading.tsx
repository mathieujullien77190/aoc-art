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
  // body est en height:100%, sa hauteur ne depend pas de ce composant : on peut
  // la mesurer des l'initialisation, l'ecran de boot n'existant que cote client
  const [screenHeight] = useState<number>(
    () => document.body.getBoundingClientRect().height
  );
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
    let timerHack: ReturnType<typeof setInterval>;
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
