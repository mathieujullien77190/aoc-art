import { AlertProps } from "./types";
import * as S from "./UI";

export const Alert = ({
  pos,
  message,
  show,
  onOk = () => { },
  onCancel = () => { },
  onClose = () => { },
}: AlertProps) => {
  return (
    <>
      {show && pos.x > 0 && pos.y > 0 && (
        <S.Container pos={pos} >
          <S.topBar >
            <span onClick={onClose}>🗙</span>
          </S.topBar>
          <S.Message>{message}</S.Message>
          <S.Buttons>
            <S.Button onClick={onOk} >
              Ok
            </S.Button>
            <S.Button onClick={onCancel} >
              Cancel
            </S.Button>
          </S.Buttons>
        </S.Container>
      )}
    </>
  );
};
