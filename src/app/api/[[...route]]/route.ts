import { Context, Hono } from "hono";
import { handle } from "hono/vercel";
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "./uploadthing";
import { initAuthConfig, type AuthConfig } from "@hono/auth-js"
import authConfig from "@/auth.config";

import ai from "./ai";
import images from "./images";
import users from "./users";
import projects from "./projects";



// Revert to "edge" if planning on running on the edge
export const runtime = "nodejs";

const getAuthConfig =(c: Context): AuthConfig => {
  return {
    secret: c.env.AUTH_SECRET,
    ...authConfig
  };
};

const app = new Hono().basePath("/api");

const { GET: UT_GET , POST: UT_POST } = createRouteHandler({
  router: uploadRouter,
});

app.use("*", initAuthConfig(getAuthConfig));

const ut = new Hono()
  .get("/", (context) => UT_GET(context.req.raw))
  .post("/", (context) => UT_POST(context.req.raw));

const routes = app
  .route("/ai", ai)
  .route("/images", images)
  .route("/uploadthing",ut)
  .route("/users", users)
  .route("/projects", projects);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);



export type AppType = typeof routes;

