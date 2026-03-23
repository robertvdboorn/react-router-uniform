import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  // API route for Uniform preview/contextual editing
  route("api/preview", "./routes/api.preview.ts"),
  
  // API route for health checks (monitoring)
  route("api/health", "./routes/api.health.ts"),

  // Uniform Playground route for testing component patterns
  route("uniform-playground", "./routes/uniform-playground.tsx"),

  // Homepage route (root path /)
  index("./routes/_index.tsx"),

  // Catch-all route for ALL other dynamic Uniform pages
  route("*", "./routes/$.tsx"),
] satisfies RouteConfig;
