import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { replicate } from "@/lib/replicate";
import { predict } from "@/lib/remove-bg";
import { utapi } from "./uploadthing";
import { getImageInfo } from "@/lib/utils";

const app = new Hono()
  .post(
    "/generate-image",
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
        num_outputs: 1,
        aspect_ratio: "1:1",
        output_format: "webp",
        output_quality: 80
      };
      
      const output = await replicate.run("black-forest-labs/flux-schnell", { input });
      
      const res = output as Array<string>;

      return c.json({ data: res[0] });
    },
  )
  .post(
    "/remove-bg",
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

      const response = await utapi.uploadFiles(imageFile);
      if (response.error) {
        console.log(response.error)
        throw new Error("Failed to upload remove bg image");
      }

      const { data } = await response as any;
      const { url:imgUrl } = data as { url: string };
      return c.json({ data: imgUrl });
    },
  );

export default app;
