export type AppRoute =
  | "/"
  | "/onboarding"
  | "/auth"
  | "/assessment/start"
  | "/assessment/question"
  | "/assessment/loading"
  | "/recommendations"
  | "/roadmap/generating"
  | "/roadmap"
  | "/progress"
  | "/chat"
  | "/profile";

export type * from "./user";
export type * from "./assessment";
export type * from "./career";
export type * from "./roadmap";
export type * from "./chat";
