import { fabric } from "fabric";
import { useEvent } from "react-use";

interface UseHotkeysProps {
  copy: () => void;
  paste: () => void;
}

export const useHotkeys = ({
  copy,
  paste
}: UseHotkeysProps) => {
  useEvent("keydown", (event) => {
    const isCtrlKey = event.ctrlKey || event.metaKey;
    const isInput = ["INPUT", "TEXTAREA"].includes(
      (event.target as HTMLElement).tagName,
    );

    if (isInput) return;

    if (isCtrlKey && event.key === "c") {
      event.preventDefault();
      copy();
    }

    if (isCtrlKey && event.key === "v") {
      event.preventDefault();
      paste();
    }

  });
};
