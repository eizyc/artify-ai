import { useEffect, useMemo, useState } from "react";
import { 
  ActiveTool, 
  Editor, 
} from "@/features/editor/types";

import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { TbColorFilter } from "react-icons/tb"
import { BsBorderWidth } from "react-icons/bs";
import { RxTransparencyGrid } from "react-icons/rx";
import { AlignCenter, AlignLeft, AlignRight, ArrowDown, ArrowUp, ChevronDown, Copy, SquareSplitHorizontal, Trash } from "lucide-react";
import { FontSizeInput, FontWeightSelect } from "./components";
import { isTextType } from "../../../utils";
import { FILL_COLOR, FONT_FAMILY, FONT_SIZE, FONT_WEIGHT, STROKE_COLOR } from "@/features/editor/const";
import { FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa6";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

const side = 'top';
const sideOffset = 5;
export const Toolbar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ToolbarProps) => {
  const initialFillColor = editor?.getActiveFillColor() ?? FILL_COLOR;
  const initialStrokeColor = editor?.getActiveStrokeColor() ?? STROKE_COLOR;
  const initialFontFamily = editor?.getActiveFontFamily() ?? FONT_FAMILY;
  const initialFontWeight = editor?.getActiveFontWeight() ?? FONT_WEIGHT;
  const initialFontSize = editor?.getActiveFontSize() ?? FONT_SIZE;
  const initialFontStyle = editor?.getActiveFontStyle();
  const initialFontLinethrough = editor?.getActiveFontLinethrough();
  const initialFontUnderline = editor?.getActiveFontUnderline();
  const initialTextAlign = editor?.getActiveTextAlign();
  const initialActiveFilter = editor?.getActiveImageFilter();

  const [properties, setProperties] = useState({
    fillColor: initialFillColor,
    strokeColor: initialStrokeColor,
    fontFamily: initialFontFamily,
    fontWeight: initialFontWeight,
    fontSize: initialFontSize,
    fontStyle: initialFontStyle,
    fontLinethrough: initialFontLinethrough,
    fontUnderline: initialFontUnderline,
    textAlign: initialTextAlign,
    filter: initialActiveFilter
  });

  const selectedObjects = useMemo(() => editor?.selectedObjects, [editor]);

  const [includeText, onlyImage] = useMemo(() => {
    const includeText = selectedObjects?.some((object) => isTextType(object.type));
    const onlyImage = selectedObjects?.every((object) => object.type === "image");
    return [includeText, onlyImage]
  }, [selectedObjects])

  useEffect(() => {
    if (!editor)  return
    setProperties((current) => ({
      ...current,
      fillColor: editor?.getActiveFillColor() ?? FILL_COLOR,
      strokeColor: editor?.getActiveStrokeColor() ?? STROKE_COLOR,
      fontFamily: editor?.getActiveFontFamily() ?? FONT_FAMILY,
      fontWeight: editor?.getActiveFontWeight() ?? FONT_WEIGHT,
      fontSize: editor?.getActiveFontSize() ?? FONT_SIZE,
      fontStyle: editor?.getActiveFontStyle(),
      fontLinethrough: editor?.getActiveFontLinethrough(),
      fontUnderline: editor?.getActiveFontUnderline(),
      textAlign: editor?.getActiveTextAlign(),
      filter: editor?.getActiveImageFilter(),
    }));
    },[editor])



  const onChangeFontSize = (value: number) => {
    if (!selectedObjects) return;

    editor?.changeFontSize(value);
    setProperties((current) => ({
      ...current,
      fontSize: value,
    }));
  };

  const onChangeFontWeight = (value: number) => {
    if (!selectedObjects) return;

    editor?.changeFontWeight(value);
    setProperties((current) => ({
      ...current,
      fontWeight: value,
    }));
  };

  const toggleItalic = () => {
    if (!selectedObjects) return;

    const isItalic = properties.fontStyle === "italic";
    const newValue = isItalic ? "normal" : "italic";

    editor?.changeFontStyle(newValue);
    setProperties((current) => ({
      ...current,
      fontStyle: newValue,
    }));
  };

  const toggleLinethrough = () => {
    if (!selectedObjects) return;

    const newValue = properties.fontLinethrough ? false : true;

    editor?.changeFontLinethrough(newValue);
    setProperties((current) => ({
      ...current,
      fontLinethrough: newValue,
    }));
  };

  const toggleUnderline = () => {
    if (!selectedObjects) return;

    const newValue = properties.fontUnderline ? false : true;

    editor?.changeFontUnderline(newValue);
    setProperties((current) => ({
      ...current,
      fontUnderline: newValue,
    }));
  };

  const onChangeTextAlign = (value: string) => {
    if (!selectedObjects) return;

    editor?.changeTextAlign(value);
    setProperties((current) => ({
      ...current,
      textAlign: value,
    }));
  };

  if (editor?.selectedObjects.length === 0) {
    return (
      <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2" />
    );
  }

  return (
    <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
      {(!onlyImage)&&(
        <div className="flex items-center h-full justify-center">
          <Hint label="Color" side={side} sideOffset={sideOffset}>
            <Button
              onClick={() => onChangeActiveTool("fill")}
              size="icon"
              variant="ghost"
              className={cn(
                activeTool === "fill" && "bg-gray-100"
              )}
            >
              <div
                className="rounded-sm size-4 border"
                style={{ backgroundColor: properties.fillColor }}
              />
            </Button>
          </Hint>
        </div>
      )}
      
      <div className="flex items-center h-full justify-center">
        <Hint label="Stroke color" side={side} sideOffset={sideOffset}>
          <Button
            onClick={() => onChangeActiveTool("stroke-color")}
            size="icon"
            variant="ghost"
            className={cn(
              activeTool === "stroke-color" && "bg-gray-100"
            )}
          >
            <div
              className="rounded-sm size-4 border-2 bg-white"
              style={{ borderColor: properties.strokeColor }}
            />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Stroke Style" side={side} sideOffset={sideOffset}>
          <Button
            onClick={() => onChangeActiveTool("stroke-style")}
            size="icon"
            variant="ghost"
            className={cn(
              activeTool === "stroke-style" && "bg-gray-100"
            )}
          >
            <BsBorderWidth className="size-4" />
          </Button>
        </Hint>
      </div>
      {includeText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Italic" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleItalic}
              size="icon"
              variant="ghost"
              className={cn(
                properties.fontStyle === "italic" && "bg-gray-100"
              )}
            >
              <FaItalic className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {includeText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Underline" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleUnderline}
              size="icon"
              variant="ghost"
              className={cn(
                properties.fontUnderline && "bg-gray-100"
              )}
            >
              <FaUnderline className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {includeText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Strike" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleLinethrough}
              size="icon"
              variant="ghost"
              className={cn(
                properties.fontLinethrough && "bg-gray-100"
              )}
            >
              <FaStrikethrough className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {includeText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Align left" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign("left")}
              size="icon"
              variant="ghost"
              className={cn(
                properties.textAlign === "left" && "bg-gray-100"
              )}
            >
              <AlignLeft className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {includeText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Align center" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign("center")}
              size="icon"
              variant="ghost"
              className={cn(
                properties.textAlign === "center" && "bg-gray-100"
              )}
            >
              <AlignCenter className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {includeText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Align right" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign("right")}
              size="icon"
              variant="ghost"
              className={cn(
                properties.textAlign === "right" && "bg-gray-100"
              )}
            >
              <AlignRight className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {includeText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Font" side={side} sideOffset={sideOffset}>
            <Button
              onClick={() => onChangeActiveTool("font")}
              size="icon"
              variant="ghost"
              className={cn(
                "w-auto px-2 text-sm",
                activeTool === "font" && "bg-gray-100"
              )}
            >
              <div className="max-w-[100px] truncate">
                {properties.fontFamily}
              </div>
              <ChevronDown className="size-4 ml-2 shrink-0" />
            </Button>
          </Hint>
        </div>
      )}
      <div className="flex items-center h-full justify-center">
        <Hint label="Bring forward" side={side} sideOffset={sideOffset}>
          <Button
            onClick={() => editor?.bringForward()}
            size="icon"
            variant="ghost"
          >
            <ArrowUp className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Send backwards" side={side} sideOffset={sideOffset}>
          <Button
            onClick={() => editor?.sendBackwards()}
            size="icon"
            variant="ghost"
          >
            <ArrowDown className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Opacity" side={side} sideOffset={sideOffset}>
          <Button
            onClick={() => onChangeActiveTool("opacity")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "opacity" && "bg-gray-100")}
          >
            <RxTransparencyGrid className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Duplicate" side={side} sideOffset={sideOffset}>
          <Button
            onClick={() => {
              editor?.onCopy();
              editor?.onPaste();
            }}
            size="icon"
            variant="ghost"
          >
            <Copy className="size-4" />
          </Button>
        </Hint>
      </div>
      {includeText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Font Weight" side="top" sideOffset={sideOffset}>
            <div>
              <FontWeightSelect
                value={properties.fontWeight}
                onChange={(value) => { onChangeFontWeight (value) }}
              />
            </div>
          </Hint>
        </div>
      )}
      {includeText && (
        <div className="flex items-center h-full justify-center">
        <Hint label="Font Size" side={side} sideOffset={sideOffset}>
          <div className="flex items-center justify-center">
            <FontSizeInput
              value={properties.fontSize}
              onChange={(value) => { onChangeFontSize (value) }}
            />
          </div>
         </Hint>
        </div>
      )}
      {onlyImage && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Filters" side={side} sideOffset={sideOffset}>
            <Button
              onClick={() => onChangeActiveTool("filter")}
              size="icon"
              variant="ghost"
              className={cn(
                (activeTool === "filter" || properties.filter != "none") && "bg-gray-100"
              )}
            >
              <TbColorFilter className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {onlyImage && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Remove background" side={side} sideOffset={sideOffset}>
            <Button
              onClick={() => onChangeActiveTool("remove-bg")}
              size="icon"
              variant="ghost"
              className={cn(
                activeTool === "remove-bg" && "bg-gray-100"
              )}
            >
              <SquareSplitHorizontal className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      <div className="flex items-center h-full justify-center">
        <Hint label="Delete" side={side} sideOffset={sideOffset}>
          <Button
            onClick={() => editor?.delete()}
            size="icon"
            variant="ghost"
          >
            <Trash className="size-4" />
          </Button>
        </Hint>
      </div>
    </div>
  );
};
