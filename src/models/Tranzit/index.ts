import html2canvas from "html2canvas";
import GrowTransition from "@models/Transition/Grow"

class Tranzit {
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


    /* TEMPORARILY HARD CODED GROW TRANSITION */    
    const growTransition = new GrowTransition(canvasWith2dContext , canvasWithWebglContext);

    document.body.appendChild(canvasWithWebglContext);

    await growTransition.triggerAnimation();

  };
}

export default Tranzit;
