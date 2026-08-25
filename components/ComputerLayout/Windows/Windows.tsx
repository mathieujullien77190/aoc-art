/** @format */
import { useState, useRef, Ref, forwardRef } from "react";

import { WindowsProps } from "./types";
import * as S from "./UI";


import Window from "../Window";
import Icon from "../Icon";
import Date from "../Date";
import Prism from "_projects/prism";


const BaseWindows = ({
  children,
  onBlueScreen = () => { },
  onCloseWindow = () => { }
}: WindowsProps, ref: Ref<HTMLDivElement>) => {

  // une seule fenetre ouverte a la fois : elles s'affichent au meme endroit
  const [openWindow, setOpenWindow] = useState<"shell" | "prism" | null>("shell");

  const toggle = (name: "shell" | "prism") =>
    setOpenWindow(prev => (prev === name ? null : name));

  const globalRef = useRef<HTMLDivElement>(null);

  return (
    <S.Container ref={globalRef} >
      <Icon
        open={openWindow === "shell"}
        name="Flower Shell"
        image="🌼"
        onClick={() => {
          toggle("shell");
          onCloseWindow()
        }}
      />

      <Icon
        open={openWindow === "prism"}
        name="1/PRISM"
        image="📡"
        onClick={() => {
          toggle("prism");
        }}
      />

      <Window
        show={openWindow === "shell"}
        container={globalRef}
        title="Flower Shell"
        onClose={() => {
          setOpenWindow(null);
          onCloseWindow()
        }}
        ref={ref}
      >
        {children}
      </Window>

      <Window
        show={openWindow === "prism"}
        container={globalRef}
        title="1/PRISM"
        onClose={() => {
          setOpenWindow(null);
        }}
      >
        <Prism />
      </Window>

      <S.Bar>
        <Date withDate withTime onClick={onBlueScreen} />
      </S.Bar>
    </S.Container>
  );
};

export const Windows = forwardRef<HTMLDivElement, WindowsProps>(BaseWindows)