import { useState, useCallback } from "react";

export type ConfirmOptions = {
  message: string;
};

export type ConfirmState = {
  message: string;
  resolve: (value: boolean) => void;
} | null;

export function useConfirm() {
  const [options, setOptions] = useState<ConfirmState>(null);

  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions({
        message,
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
      <div className="modal">
        <p>{options.message}</p>
        <button onClick={handleConfirm}>확인</button>
        <button onClick={handleCancel}>취소</button>
      </div>
    ) : null;

  return { confirm, ConfirmModal };
}