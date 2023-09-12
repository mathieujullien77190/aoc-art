/** @format */


import { IconProps } from "./types";
import * as S from "./UI";

export const Icon = ({ name, image, onOpen = () => { } }: IconProps) => {
  return (
    <S.Container
      onClick={() => {
        onOpen(name);
      }}
    >
      <S.Image>{image}</S.Image>
      <S.Name>{name}</S.Name>
    </S.Container>
  );
};
