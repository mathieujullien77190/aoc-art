/** @format */

import styled from "styled-components";
import { FULL, COLORS } from "./constants";

export const Container = styled.div`
  width: ${`calc(100% - ${FULL.padding} - ${FULL.padding})`};
  height: ${`calc(100% - ${FULL.padding} - ${FULL.padding})`};
  padding: ${FULL.padding};
`;

export const Bar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${FULL.heightBar};
  border-top-style: solid;
  border-top-width: ${FULL.borderSize};
  border-top-color: ${COLORS.border};
  background-color: ${COLORS.bar};
  display: flex;
  color: ${COLORS.text};
  align-items: center;
  justify-content: end;
  padding: 0 ${FULL.padding};
`;

export const Date = styled.div``;
