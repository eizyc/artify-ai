import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { UTApi } from "uploadthing/server";
 
const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function
 
export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
 
      if (!user) throw new UploadThingError("Unauthorized");
 
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof uploadRouter;
 
export const utapi = new UTApi();