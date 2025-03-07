import vertexShaderSource from "@constants/defaultVertexShaderSource";
import getCanvasWebglContext from "@utils/getGL";

class Webgl {
  HTMLCanvasElement: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  shaderProgram: WebGLProgram;
  shaderCode: string;
  startTime: number | null = null;
  timeLocation: WebGLUniformLocation | null = null;

  constructor(canvas: HTMLCanvasElement, shaderCode: string) {
    this.HTMLCanvasElement = canvas;
    this.shaderCode = shaderCode;
    this.HTMLCanvasElement.width = window.innerWidth;
    this.HTMLCanvasElement.height = window.innerHeight;
    this.gl = getCanvasWebglContext(canvas);
    this.shaderProgram = this._createProgram();
    this.timeLocation = this.gl.getUniformLocation(this.shaderProgram, "u_time");
    this._createQuadBuffer();
  }

  private _createProgram() {
    const vertexShader = this._compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this._compileShader(this.shaderCode, this.gl.FRAGMENT_SHADER);

    const shaderProgram = this.gl.createProgram()!;

    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      const log = this.gl.getProgramInfoLog(shaderProgram);
      this.gl.deleteProgram(shaderProgram);
      throw new Error("Failed to link program: " + log);
    }

    this.gl.useProgram(shaderProgram);

    return shaderProgram!;
  }

  private _compileShader(source: string, type: GLenum) {
    const shader = this.gl.createShader(type);

    if (!shader) throw new Error("Shader not created");

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error("ERROR compiling shader:", this.gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  bindTexture = (sourceCanvas: HTMLCanvasElement) => {
    this.HTMLCanvasElement.width = sourceCanvas.width;
    this.HTMLCanvasElement.height = sourceCanvas.height;
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, sourceCanvas);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    const textureLocation = this.gl.getUniformLocation(this.shaderProgram, "u_texture");
    this.gl.uniform1i(textureLocation, 0);
  };

  bindUniform = (uniformKey: string, uniformValue: number) => {
    const uniformLocation = this.gl.getUniformLocation(this.shaderProgram, uniformKey);
    this.gl.uniform1f(uniformLocation, uniformValue);
  };

  private _createQuadBuffer() {
    const vertices = new Float32Array([
      -1.0, -1.0, 0.0, 0.0, 1.0, -1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0,
      -1.0, 1.0, 0.0, 1.0, 1.0, -1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0,
    ]);

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    const positionLocation = this.gl.getAttribLocation(this.shaderProgram, "a_position");
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 16, 0);

    const texCoordLocation = this.gl.getAttribLocation(this.shaderProgram, "a_texCoord");
    this.gl.enableVertexAttribArray(texCoordLocation);
    this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 16, 8);

    const resolutionLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution");
    this.gl.uniform2f(resolutionLocation, this.HTMLCanvasElement.width, this.HTMLCanvasElement.height);
  }

  render = () => {
    if (!this.startTime) this.startTime = new Date().getTime();
    const timePassed = (new Date().getTime() - this.startTime) / 1000;

    this.gl.uniform1f(this.timeLocation, timePassed);

    this.gl.viewport(0, 0, this.HTMLCanvasElement.width, this.HTMLCanvasElement.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  };
}

export default Webgl;
