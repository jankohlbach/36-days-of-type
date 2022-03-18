import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { checkIfInLetter, randomInRange } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day13 {
  async init() {
    ['startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'M',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.dots = [];

    this.createDots();

    // this.startRecording();

    this.render();
  }

  createDots() {
    for (let i = 0; i < 100; i += 1) {
      const colors = [
        '#17bebb',
        '#2e282a',
        '#cd5334',
        '#edb88b',
        '#fad8d6',
      ];

      let dot;
      let inLetter;

      do {
        dot = {
          x: randomInRange(0, this.myCanvas.canvas.width),
          y: randomInRange(0, this.myCanvas.canvas.height),
          stepX: null,
          stepY: null,
          radius: randomInRange(2, 6),
          angle: randomInRange(0, 2),
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        dot.stepX = Math.cos(dot.angle * Math.PI) * 3;
        dot.stepY = Math.sin(dot.angle * Math.PI) * 3;
        inLetter = checkIfInLetter(this.letterMapData, dot.x, dot.y);
      } while (!inLetter);

      this.dots.push(dot);
    }

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-13' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    this.dots.forEach((dot) => {
      dot.x += dot.stepX;
      dot.y += dot.stepY;

      while (!checkIfInLetter(this.letterMapData, dot.x, dot.y)) {
        dot.angle = randomInRange(0, 2);
        dot.stepX = Math.cos(dot.angle * Math.PI) * 3;
        dot.stepY = Math.sin(dot.angle * Math.PI) * 3;
        dot.x += dot.stepX;
        dot.y += dot.stepY;
      }

      this.myCanvas.ctx.fillStyle = dot.color;
      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.arc(dot.x, dot.y, dot.radius, 0, 360);
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

const day13 = new Day13();

day13.init();
