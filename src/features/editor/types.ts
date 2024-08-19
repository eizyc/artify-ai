import { ITextboxOptions } from "fabric/fabric-impl";
export interface EditorHookProps {
  defaultWidth?: number;
  defaultHeight?: number;
  clearSelectionCallback?: () => void;
};

export type ActiveTool =
  | "select"
  | "shapes"
  | "text"
  | "images"
  | "draw"
  | "fill"
  | "stroke-color"
  | "stroke-width"
  | "font"
  | "opacity"
  | "filter"
  | "settings"
  | "ai"
  | "remove-bg"
  | "templates";



  export type BuildEditorProps = {
    canvas: fabric.Canvas;
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
    selectedObjects: fabric.Object[];
    strokeDashArray: number[];
    setStrokeDashArray: (value: number[]) => void;
    setFillColor: (value: string) => void;
    setStrokeColor: (value: string) => void;
    setStrokeWidth: (value: number) => void;
  };
  
  export interface Editor {
    addCircle: () => void;
    addSoftRectangle: () => void;
    addRectangle: () => void;
    addTriangle: () => void;
    addInverseTriangle: () => void;
    addDiamond: () => void;
    changeStrokeWidth: (value: number) => void;
    changeFillColor: (value: string) => void;
    changeStrokeColor: (value: string) => void;
    changeStrokeDashArray: (value: number[]) => void;
    getActiveFillColor: () => string;
    getActiveStrokeColor: () => string;
    selectedObjects: fabric.Object[];
  };
  