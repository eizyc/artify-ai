import { fabric } from "fabric";
import { useCallback, useRef, useState } from "react";

import { JSON_KEYS, WORKSPACE_NAME } from "@/features/editor/const";

interface UseHistoryProps {
  canvas: fabric.Canvas | null;
  autoZoom: () => void;
  saveCallback?: (values: {
    json: string;
    height: number;
    width: number;
  }) => void;
};

export const useHistory = ({ canvas, autoZoom, saveCallback }: UseHistoryProps) => {
  const [historyIndex, setHistoryIndex] = useState(0);
  const canvasHistory = useRef<string[]>([]);
  const skipSave = useRef(false);

  const canUndo = useCallback(() => {
    return historyIndex > 0;
  }, [historyIndex]);

  const canRedo = useCallback(() => {
    return historyIndex < canvasHistory.current.length - 1;
  }, [historyIndex]);

  const save = useCallback((skip = false) => {
    if (!canvas) return;

    const currentState = canvas.toJSON(JSON_KEYS);
    const json = JSON.stringify(currentState);

    if (!skip && !skipSave.current) {
      let history = canvasHistory.current.slice(0, historyIndex+1);
      history.push(json);
      canvasHistory.current = history;
      setHistoryIndex(history.length - 1);
    }

    const workspace = canvas
      .getObjects()
      .find((object) => object.name === WORKSPACE_NAME);
    const height = workspace?.height || 0;
    const width = workspace?.width || 0;

    saveCallback?.({ json, height, width });

  }, 
  [canvas, historyIndex, saveCallback]);

  const undo = useCallback(() => {
    if (canUndo()) {
      skipSave.current = true;
      canvas?.clear().renderAll();

      const previousIndex = historyIndex - 1;
      const previousState = JSON.parse(
        canvasHistory.current[previousIndex]
      );

      canvas?.loadFromJSON(previousState, () => {
        canvas.renderAll();
        autoZoom()
        setHistoryIndex(previousIndex);
        skipSave.current = false;
      });
    }
  }, [autoZoom, canUndo, canvas, historyIndex]);

  const redo = useCallback(() => {
    if (canRedo()) {
      skipSave.current = true;
      canvas?.clear().renderAll();

      const nextIndex = historyIndex + 1;
      const nextState = JSON.parse(
        canvasHistory.current[nextIndex]
      );

      canvas?.loadFromJSON(nextState, () => {
        canvas.renderAll();
        autoZoom();
        setHistoryIndex(nextIndex);
        skipSave.current = false;
      });
    }
  }, [canRedo, canvas, historyIndex, autoZoom]);

  return { 
    save,
    canUndo,
    canRedo,
    undo,
    redo,
    setHistoryIndex,
    canvasHistory,
  };
};
