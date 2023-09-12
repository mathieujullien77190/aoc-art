/** @format */
import { useState, useRef, Ref, forwardRef } from "react";

import { WindowsProps } from "./types";
import * as S from "./UI";


import Window from "../Window";
import Icon from "../Icon";
import Date from "../Date";


const BaseWindows = ({
  children,
  onBlueScreen = () => { },
  onCloseWindow = () => { }
}: WindowsProps, ref: Ref<HTMLDivElement>) => {

  const [displayWindow, setDisplayWindow] = useState<boolean>(true);

  const globalRef = useRef<HTMLDivElement>(null);

  return (
    <S.Container ref={globalRef} >
      <Icon
        open={displayWindow}
        name="Flower Cmder"
        image="🌼"
        onClick={() => {
          setDisplayWindow(prev => !prev);
          onCloseWindow()
        }}
      />

      <Window
        show={displayWindow}
        container={globalRef}
        title="Flower Cmder"
        onClose={() => {
          setDisplayWindow(false);
          onCloseWindow()
        }}
        ref={ref}
      >
        {children}
      </Window>

      <S.Bar>
        <Date withDate withTime onClick={onBlueScreen} />
      </S.Bar>
    </S.Container>
  );
};

export const Windows = forwardRef<HTMLDivElement, WindowsProps>(BaseWindows)