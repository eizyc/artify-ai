import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { verifyAuth } from "@hono/auth-js";

import { predict } from "@/lib/remove-bg";
import { utapi } from "./uploadthing";
import { getImageInfo } from "@/lib/utils";

const text2imgURL = `${process.env.TEXT2IMG_MODEL_ADDRESS}`;
const app = new Hono()
  .post(
    "/generate-image",
    verifyAuth(),
    zValidator(
      "json",
      z.object({
        prompt: z.string(),
      }),
    ),
    async (c) => {
      const { prompt } = c.req.valid("json");

      const input = {
        prompt,
      };
      
      const res = await fetch(text2imgURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      }).then((res) => res.arrayBuffer());

      const output = res as unknown as ArrayBuffer | Uint8Array;

      const imgName = `text2img-${prompt}.png`
      const type =  `image/png`
      const blob = new Blob([output], { type });
      const imageFile = new File([blob], imgName, { type });
      const imgUrl = await uploadImg(imageFile);

      return c.json({ data: imgUrl });
    },
  )
  .post(
    "/remove-bg",
    verifyAuth(),
    zValidator(
      "json",
      z.object({
        image: z.string(),
      }),
    ),
    async (c) => {
      const { image: url } = c.req.valid("json");

      let output = await predict(url);

      const { name } = getImageInfo(url);
      const extension = 'png'
      output = await output.toFormat('png').toBuffer();
      const imgName = `${name}-remove-bg.${extension}`
      const type =  `image/${extension}`
      const blob = new Blob([output], { type });
      const imageFile = new File([blob], imgName, { type });
      const imgUrl = await uploadImg(imageFile);

      return c.json({ data: imgUrl });
    },
  );

export default app;



const uploadImg = async (imgFile: File) => {
  const response = await utapi.uploadFiles(imgFile);
  if (response.error) {
    console.log(response.error)
    throw new Error("Failed to upload remove bg image");
  }

  const { data } = await response as any;
  return data.url
}