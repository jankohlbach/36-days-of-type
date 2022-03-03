export default class LetterMap {
  constructor({ letter, canvasWidth, canvasHeight }) {
    this.letter = letter;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  async init() {
    await this.loadFont();
    this.initCanvas();
    this.drawLetter();
  }

  // eslint-disable-next-line class-methods-use-this
  async loadFont() {
    const tmpFont = new FontFace(
      'Suez One',
      'url(https://fonts.gstatic.com/s/suezone/v8/taiJGmd_EZ6rqscQgOFOmos.woff2)',
    );

    const font = await tmpFont.load();
    document.fonts.add(font);
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');

    this.canvas.width = this.canvasWidth * devicePixelRatio;
    this.canvas.height = this.canvasHeight * devicePixelRatio;

    this.canvas.style.width = `${this.canvasWidth}px`;
    this.canvas.style.height = `${this.canvasHeight}px`;
  }

  drawLetter() {
    this.ctx = this.canvas.getContext('2d');
    this.ctx.font = '70vw Suez One';

    this.ctx.save();
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(0.5 * this.canvas.width, 0.5 * this.canvas.height);
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(this.letter, 0, 0);
    this.ctx.restore();
  }

  createImageData() {
    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }
}
