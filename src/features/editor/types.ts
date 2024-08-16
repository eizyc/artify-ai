import { ITextboxOptions } from "fabric/fabric-impl";
export interface EditorHookProps {
  defaultWidth?: number;
  defaultHeight?: number;
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
  };
  
  export interface Editor {
    addCircle: () => void;
    addSoftRectangle: () => void;
    addRectangle: () => void;
    addTriangle: () => void;
    addInverseTriangle: () => void;
    addDiamond: () => void;
  };
  