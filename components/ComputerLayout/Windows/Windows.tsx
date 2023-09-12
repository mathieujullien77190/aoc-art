/** @format */
import { useState, useRef, RefObject, useEffect } from "react";

import { WindowsProps, Pos } from "./types";
import * as S from "./UI";


import Window from "../Window";
import Icon from "../Icon";
import Date from "../Date";

const getCenter = (
  globalRef: RefObject<HTMLDivElement>,
  widthWindow: number,
  heightWindow: number
): Pos => {
  if (!globalRef) return { x: 0, y: 0 };

  const globalRect = globalRef.current?.getBoundingClientRect() || {
    width: 0,
    height: 0,
  };

  return {
    x: (globalRect?.width - widthWindow) / 2,
    y: (globalRect?.height - heightWindow) / 2,
  };
};

export const Windows = ({

  children,
  onBlueScreen = () => { },
}: WindowsProps) => {

  const [displayWindow, setDisplayWindow] = useState<boolean>(true);

  const globalRef = useRef<HTMLDivElement>(null);



  return (
    <S.Container ref={globalRef} >
      <Icon
        name="Flower Cmder"
        image="🌼"
        onOpen={() => {
          setDisplayWindow(true);
        }}
      />




      <Window
        show={displayWindow}
        container={globalRef}
        title="Flower Cmder"
        onClose={() => {
          setDisplayWindow(false);
        }}
      >
        {children}
      </Window>

      <S.Bar >
        <Date withDate withTime />
      </S.Bar>
    </S.Container>
  );
};
