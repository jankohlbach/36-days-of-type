import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { drawLetter } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day21 {
  async init() {
    ['startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'U',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    // this.startRecording();

    this.render();
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-21' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    const colors = [
      '#44af69',
      '#f8333c',
      '#fcab10',
      '#2b9eb3',
      '#dbd5b5',
    ];

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.globalCompositeOperation = 'source-over';

    drawLetter(this.myCanvas, 'U');

    this.myCanvas.ctx.globalCompositeOperation = 'source-atop';

    for (let i = 0; i < this.myCanvas.canvas.height; i += 50) {
      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.lineWidth = 3;
      this.myCanvas.ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];

      let y;
      for (let x = 0; x < this.myCanvas.canvas.width; x += 40) {
        y = Math.sin(x * 0.05 + ts * 1.5)
          * (this.myCanvas.canvas.height / 30)
          + (this.myCanvas.canvas.height / 30);
        this.myCanvas.ctx.lineTo(x, y + i);
      }
      this.myCanvas.ctx.stroke();
      this.myCanvas.ctx.closePath();
    }

    this.myCanvas.ctx.globalCompositeOperation = 'destination-over';

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    if (ts > 4) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day21 = new Day21();

day21.init();
