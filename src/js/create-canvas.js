export default class Canvas {
  constructor({ canvasWidth, canvasHeight }) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.init();
  }

  init() {
    this.initCanvas();
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');

    this.canvas.width = this.canvasWidth * devicePixelRatio;
    this.canvas.height = this.canvasHeight * devicePixelRatio;

    this.canvas.style.width = `${this.canvasWidth}px`;
    this.canvas.style.height = `${this.canvasHeight}px`;

    this.ctx = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);
  }
}
