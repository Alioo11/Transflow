export interface TransitionTypeMap {
  grow: void;
}

export type TransitionMode = keyof TransitionTypeMap;

export interface TransitionProps {
  mode?: TransitionMode;
}

export type CanvasContextType = "2d" | "webgl";
