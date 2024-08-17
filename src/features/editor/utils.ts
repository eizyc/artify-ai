import { RGBColor } from "react-color";

export const isTextType = (type: string | undefined) => {
  return type === "text" || type === "i-text" || type === "textbox";
};

export const rgbaObjectToString = (rgba: RGBColor | "transparent") => {
  if (rgba === "transparent") {
    return `rgba(0,0,0,0)`;
  }

  const alpha = rgba.a === undefined ? 1 : rgba.a;

  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
};

export const mixColors = (colors: string[]) => {
  colors = colors.filter((color) => color !== "transparent");
  let rSum = 0, gSum = 0, bSum = 0, aSum = 0;

  colors.forEach(color => {
    const [r, g, b, a] = color?.match(/\d+(\.\d+)?/g)!.map(Number);
    rSum += r;
    gSum += g;
    bSum += b;
    aSum += a;
  });

  const count = colors.length;
  const rAvg = Math.round(rSum / count);
  const gAvg = Math.round(gSum / count);
  const bAvg = Math.round(bSum / count);
  const aAvg = Number((aSum / count).toFixed(2));

  return `rgba(${rAvg}, ${gAvg}, ${bAvg}, ${aAvg})`;
}