import html2canvas from "html2canvas";
import Webgl from "./models/Webgl";
import { wait } from "./utils/wait";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

const testShaderCode = `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
varying vec2 v_texCoord;
uniform float u_time;

uniform float u_duration;

float speed = 50.0;
float rippleWidth = 30.0;
float rippleHeight = 0.02;

void main() {  
  vec2 st = v_texCoord;
  st.x *= u_resolution.x/u_resolution.y;
    
  vec2 p = st - 0.0;
    
	float dist = length(p);
    
	float ripple = sin(dist * rippleWidth - u_time * speed) * rippleHeight;
    
    vec4 textureColor = texture2D(u_texture, v_texCoord);
    vec2 rippleUV = v_texCoord + p * ripple;
    
    float maxRadius = 3.0;
    float innerRadius = smoothstep(0.0, 1.0, u_time / (u_duration * 3.0)) * maxRadius;
    float outerRadius = innerRadius - 0.3;

    vec4 color = texture2D(u_texture, rippleUV);
    
    if(dist > innerRadius) color = textureColor;
    
    if(dist < outerRadius) color = vec4(0.0);
    
    gl_FragColor = color;
}
`;

class Transflow {
  HTMLElement: HTMLElement;

  constructor(HTMLElement?: HTMLElement) {
    this.HTMLElement = HTMLElement ?? document.body;
  }

  captureScreen = async () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const canvas = await html2canvas(document.body, {
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      width: viewportWidth,
      height: viewportHeight,
      windowWidth: viewportWidth,
      windowHeight: viewportHeight,
      useCORS: true,
    });

    return canvas;
  };

  private _applyCanvasStyles = (HTMLCanvasElement: HTMLCanvasElement) => {
    HTMLCanvasElement.style.position = "fixed";
    HTMLCanvasElement.style.top = "0px";
    HTMLCanvasElement.style.left = "0px";
    HTMLCanvasElement.style.width = "100vw";
    HTMLCanvasElement.style.height = "100vh";
    HTMLCanvasElement.style.zIndex = "100000";
  };

  startTransition = async (toggleFn: VoidFunction) => {
    const canvasWith2dContext = await this.captureScreen();
    const canvasWithWebglContext = document.createElement("canvas");

    this._applyCanvasStyles(canvasWith2dContext);
    this._applyCanvasStyles(canvasWithWebglContext);

    toggleFn();

    document.body.appendChild(canvasWithWebglContext);

    const webgl = new Webgl(canvasWithWebglContext, testShaderCode);
    webgl.bindTexture(canvasWith2dContext);

    webgl.bindUniform("u_duration", 1);

    let running = false;
    
    const renderLoop = () => {
      webgl.render();
      if(running) requestAnimationFrame(renderLoop);
    };
    
    running = true
    renderLoop();

    await wait(2000);
    running = false;

    canvasWith2dContext.remove();
    canvasWithWebglContext.remove();

  };
}

const themeToggleBtn = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;

if (!themeToggleBtn) throw new Error("Theme toggle button not found");

function setTheme(theme: string) {
  const transflow = new Transflow();

  transflow.startTransition(() => {
    htmlElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
    //@ts-ignore
    themeToggleBtn.textContent = theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode";
  });
}

themeToggleBtn.addEventListener("click", () => {
  setTheme(htmlElement.getAttribute("data-bs-theme") === "light" ? "dark" : "light");
});

export default Transflow;
