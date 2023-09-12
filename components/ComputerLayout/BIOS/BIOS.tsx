/** @format */
import { useState, useEffect } from "react";

import { getStorage, setStorage } from "../helpers/localStorage";

import { BIOSProps, ItemProps } from "./types";
import * as S from "./UI";
import { ITEMS, NB_ITEMS } from "./constants";
import { getItem } from "./helpers";

const Item = ({ label, num, current, children }: ItemProps) => {
  return (
    <S.Item num={num} current={current}>
      <label>{label}</label>
      <span>{children}</span>
    </S.Item>
  );
};

const EmptyItem = () => {
  return <S.EmptyItem />;
};

let move = (e: KeyboardEvent) => { };

export const BIOS = ({ onExit = () => { } }: BIOSProps) => {
  const [current, setCurrent] = useState<number>(0);
  const [settings, setSettings] = useState<Record<string, string>>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    setSettings(getStorage("settings"));
  }, []);

  useEffect(() => {
    document.body.removeEventListener("keyup", move);

    move = (e: KeyboardEvent) => {
      const currentItem = getItem(current);

      if (e.code === "ArrowDown") {
        setCurrent((prev) => (prev + 1 > NB_ITEMS ? 0 : prev + 1));
      }
      if (e.code === "ArrowUp") {
        setCurrent((prev) => (prev - 1 < 0 ? NB_ITEMS : prev - 1));
      }
      if (e.code === "Enter") {
        if (message) {
          setMessage(undefined);
          if (current === 5) onExit();
          if (current === 6) {
            if (settings) setStorage("settings", settings);
            onExit();
          }
        } else if (!currentItem?.choices) setMessage(currentItem?.message);
      }
    };

    document.body.addEventListener("keyup", move);
    () => {
      document.body.removeEventListener("keyup", move);
    };
  }, [current, message]);

  return (
    <S.Container >
      <S.Wrapper>
        <S.Title >BIOcolix Setup Utility</S.Title>
        <S.Content >
          <S.Left >
            <h3>Settings</h3>
            <ul>
              {ITEMS.map((item, i) => {
                return item !== "-" ? (
                  <Item
                    key={item.id}
                    num={item.id}
                    current={current}
                    label={item.label}
                  >
                    {item.content(
                      item,
                      current,
                      settings ? settings[`settings${item.id}`] : undefined,
                      (value) => {
                        setSettings((prev) => ({
                          ...prev,
                          [`settings${item.id}`]: value,
                        }));
                      }
                    )}
                  </Item>
                ) : (
                  <EmptyItem key={`empty${i}`} />
                );
              })}
            </ul>
          </S.Left>
          <S.Right >
            <h3>Help</h3>
            <p>use the arrow keys [Up] and [Down] to select an item</p>
            <p>use [Enter] to change value</p>
          </S.Right>
        </S.Content>
        {message && (
          <S.Message >
            <p>
              {message}
              <strong>[Enter]</strong>
            </p>
          </S.Message>
        )}
      </S.Wrapper>
    </S.Container>
  );
};
