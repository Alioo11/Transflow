import Transition from "@models/Transition";
import Webgl from "@models/Webgl";
import { wait } from "@utils/wait";
import shader from "./shader";
import type { CanvasContextType } from "@_types/index";

class GrowTransition extends Transition {
  canvas2d: HTMLCanvasElement;
  canvasWebgl: HTMLCanvasElement;
  contextType: CanvasContextType = "2d";

  webgl: Webgl;
  constructor(canvas2d: HTMLCanvasElement, canvasWebgl: HTMLCanvasElement) {
    super();
    this.canvas2d = canvas2d;
    this.canvasWebgl = canvasWebgl;
    this.webgl = new Webgl(canvasWebgl, shader);

    this.webgl.bindTexture(canvas2d);
    this.webgl.bindUniform("u_duration", 1);
  }

  triggerAnimation = async () => {
    let running = false;    
    
    const animationLoop = ()=>{
      this.webgl.render();
      requestAnimationFrame(animationLoop);
    }
    

    running = true;
    animationLoop();

    /** !!TEMPORARILY HARD CODED TRANSITION DURATION!! */
    await wait(2000);
    running = false;

    this.canvas2d.remove();
    this.canvasWebgl.remove();
  };
}

export default GrowTransition;
