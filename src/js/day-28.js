import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { randomInRange, checkIfInLetter, checkCircleOverlap } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day28 {
  async init() {
    ['createDots', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: '1',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      isNumber: true,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.spacing = 2;

    this.dots = [];

    this.createDots();

    // this.startRecording();

    this.render();
  }

  createDots() {
    for (let i = 0; i < 600; i += 1) {
      const radius = randomInRange(2, 3);
      const colors = [
        '#26547c',
        '#ef476f',
        '#ffd166',
        '#06d6a0',
        '#6f472a',
      ];

      let dot;
      let inLetter;
      let overlaps;

      do {
        dot = {
          x: randomInRange(0, this.myCanvas.canvas.width - 2 * radius - this.spacing),
          y: randomInRange(0, this.myCanvas.canvas.height - 2 * radius - this.spacing),
          radius,
          angle: randomInRange(0, 2),
          index: i,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        inLetter = checkIfInLetter(this.letterMapData, dot.x, dot.y);
        overlaps = checkCircleOverlap(dot, this.dots, this.spacing);
      } while (overlaps || !inLetter);

      this.dots.push(dot);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-28' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.dots.forEach((dot) => {
      if (
        !checkIfInLetter(this.letterMapData, dot.x, dot.y)
        || checkCircleOverlap(dot, this.dots, this.spacing)
      ) {
        dot.angle += Math.PI;
      }

      dot.x += Math.cos(dot.angle * Math.PI * 2) * 0.5;
      dot.y += Math.sin(dot.angle * Math.PI * 2) * 0.5;

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

const day28 = new Day28();

day28.init();
