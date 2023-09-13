/** @format */

import styled from "styled-components";
import { FULL, COLORS } from "./constants";

export const Container = styled.div`
  width: ${`calc(100% - ${FULL.padding} - ${FULL.padding})`};
  height: ${`calc(100% - ${FULL.padding} - ${FULL.padding})`};
  padding: ${FULL.padding};
`;

export const LoadingScreen = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const CommandText = styled.p`
  position: absolute;
  margin: 2px;
  bottom: 0;
  color: ${COLORS.important};
`;

export const HackText = styled.pre<{ height?: number }>`
  color: ${COLORS.text};
  overflow: hidden;
  line-height: 22px;
  height: ${({ height }) => height ? `${(Math.floor(height / 22) - 2) * 22}px` : `calc(100% - 20px)`};
  margin: 0;
`;
