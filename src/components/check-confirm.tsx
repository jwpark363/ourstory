import { ShieldCheck } from "lucide-react";
import { useState, useCallback } from "react";
import styled from "styled-components";

export type ConfirmOptions = {
  message: string;
};

export type ConfirmState = {
  message: string;
  modal?: boolean;
  resolve: (value: boolean) => void;
} | null;

const Wrapper = styled.div`
  &.modal{
    position: fixed;
    top: 0px;
    left: 0px;
    height: 100vh;
    width: 100vw;
  }
`
const Dialog = styled.div`
  /* width: 240px; */
  margin: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  border: 1px solid darkgray;
  padding: 12px 8px;
  p{
    color: ivory;
    font-size: 16px;
  }
`
const Button = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 4px;
  button{
    all: unset;
    padding: 4px 12px;
    border: 1px solid white;
    cursor: pointer;
    font-size: 14px;
    color: ivory;
  }

`

export function useConfirm() {
  const [options, setOptions] = useState<ConfirmState>(null);

  const confirm = useCallback((message: string, modal?: boolean): Promise<boolean> => {
    console.log(message)
    return new Promise((resolve) => {
      setOptions({
        message,
        modal,
        resolve,
      });
    });
  }, []);

  const handleConfirm = () => {
    options?.resolve(true);
    setOptions(null);
  };

  const handleCancel = () => {
    options?.resolve(false);
    setOptions(null);
  };

  const ConfirmModal = () =>
    options ? (
      <Wrapper className={options.modal?"modal":""}>
        <Dialog>
          <p><ShieldCheck size={20} /> {options.message}</p>
          <Button>
            <button onClick={handleConfirm}>확인</button>
            <button onClick={handleCancel}>취소</button>
          </Button>
        </Dialog>
      </Wrapper>
    ) : null;

  return { confirm, ConfirmModal };
}