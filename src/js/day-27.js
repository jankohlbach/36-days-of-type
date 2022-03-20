import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { randomInRange, checkIfInLetter } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day27 {
  async init() {
    ['createEllipses', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: '0',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      isNumber: true,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.ellipses = [];

    this.createEllipses();

    // this.startRecording();

    this.render();
  }

  createEllipses() {
    for (let i = 0; i < 300; i += 1) {
      const colors = [
        '#f2efea',
        '#fc7753',
        '#66d7d1',
        '#403d58',
        '#dbd56e',
      ];

      let ellipse;
      let inLetter;

      do {
        ellipse = {
          x: randomInRange(0, this.myCanvas.canvas.width),
          y: randomInRange(0, this.myCanvas.canvas.height),
          radiusX: randomInRange(5, 40),
          radiusY: randomInRange(5, 40),
          index: i,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        inLetter = checkIfInLetter(this.letterMapData, ellipse.x, ellipse.y);
      } while (!inLetter);

      this.ellipses.push(ellipse);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-27' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.ellipses.forEach((ellipse) => {
      do {
        ellipse.radiusX += randomInRange(-0.7, 0.7);
        ellipse.radiusY += randomInRange(-0.7, 0.7);
      } while (ellipse.radiusX < 0.5 || ellipse.radiusY < 0.5);

      this.myCanvas.ctx.fillStyle = ellipse.color;
      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.ellipse(ellipse.x, ellipse.y, ellipse.radiusX, ellipse.radiusY, 0, 0, 360);
      this.myCanvas.ctx.closePath();
      this.myCanvas.ctx.fill();
    });

    if (ts > 6) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day27 = new Day27();

day27.init();
