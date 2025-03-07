const getCanvasWebglContext = (canvas: HTMLCanvasElement) => {
  const gl = canvas.getContext("webgl");

  if (!gl || gl === null) throw new Error("WebGL not supported");

  return gl!;
};

export default getCanvasWebglContext;
