/** @format */

import styled from "styled-components";
import { Pos } from "./types";
import { COLORS, FULL } from "./constants";

export const Container = styled.div<{ pos: Pos; }>`
  position: absolute;
  top: ${({ pos }) => `${pos.y}px`};
  left: ${({ pos }) => `${pos.x}px`};
  border-style: solid;
  border-width: ${FULL.borderSize};
  border-color: ${COLORS.borderColor};
  width: ${FULL.width}px;
  height: ${FULL.height}px;
  border-radius: 4px;
  box-shadow: 3px 2px 4px #00000041;
  background-color: ${COLORS.backgroundContent};
  color: ${COLORS.text};
  overflow: hidden;
  font-weight: ${FULL.fontWeight};
  z-index: 10;
`;

export const topBar = styled.div`
  height: 15px;
  background-color: ${COLORS.backgroundTitle};
  border-bottom-style: solid;
  border-bottom-width: ${FULL.borderSize};
  border-bottom-color: ${COLORS.borderColor};
  display: flex;
  justify-content: end;
  align-items: center;
  padding: ${FULL.padding};

  span {
    cursor: pointer;
    font-size: 12px;
    margin-top: -1px;
  }
`;

export const Message = styled.div`
  padding: 10px 2px;
  text-align: center;
`;

export const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const Button = styled.div`
  border-style: solid;
  border-width: ${FULL.borderSize};
  border-color: ${COLORS.borderColor};
  margin: 0 4px;
  padding: 4px 8px;
  text-align: center;
  cursor: pointer;
  background-color: ${COLORS.button};
  border-radius: 4px;

  &:hover {
    background-color: ${COLORS.buttonOver};
  }
`;
