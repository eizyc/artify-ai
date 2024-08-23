import { Context, Hono } from "hono";
import { handle } from "hono/vercel";
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "./uploadthing";

import ai from "./ai";
import images from "./images";


// Revert to "edge" if planning on running on the edge
export const runtime = "nodejs";


const app = new Hono().basePath("/api");

const { GET: UT_GET , POST: UT_POST } = createRouteHandler({
  router: uploadRouter,
});

const ut = new Hono()
  .get("/", (context) => UT_GET(context.req.raw))
  .post("/", (context) => UT_POST(context.req.raw));

const routes = app
  .route("/ai", ai)
  .route("/images", images)
  .route("/uploadthing",ut)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);



export type AppType = typeof routes;

