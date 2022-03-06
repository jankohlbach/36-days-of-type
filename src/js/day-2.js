import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { randomInRange, checkIfInLetter, checkCircleOverlap } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day2 {
  async init() {
    ['createDots', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'B',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.dots = [];

    this.spacing = 2;

    // this.startRecording();

    this.createDots();

    this.render();
  }

  createDots() {
    for (let i = 0; i < 2000; i += 1) {
      const radius = 2;
      const colors = [
        '#e53d00',
        '#ffe900',
        '#fcfff7',
        '#21a0a0',
        '#046865',
      ];

      let dot;
      let inLetter;
      let overlaps;

      do {
        dot = {
          x: randomInRange(0, this.myCanvas.canvas.width - 2 * radius - this.spacing),
          y: randomInRange(0, this.myCanvas.canvas.height - 2 * radius - this.spacing),
          radius,
          freeze: false,
          index: i,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        inLetter = checkIfInLetter(this.letterMapData, dot.x, dot.y);
        overlaps = checkCircleOverlap(dot, this.dots, this.spacing);
      } while (overlaps || !inLetter);

      this.dots.push(dot);

      this.myCanvas.ctx.fillStyle = dot.color;
      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.arc(dot.x, dot.y, dot.radius, 0, 360);
      this.myCanvas.ctx.closePath();
      this.myCanvas.ctx.fill();
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-2' });
    this.recorder.start();
  }

  render() {
    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    let frozenDots = 0;

    this.dots.forEach((dot) => {
      if (!dot.freeze) {
        dot.radius += 0.1;
      }

      if (checkCircleOverlap(dot, this.dots, this.spacing)) {
        dot.freeze = true;
        frozenDots += 1;
      }

      this.myCanvas.ctx.fillStyle = dot.color;
      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.arc(dot.x, dot.y, dot.radius, 0, 360);
      this.myCanvas.ctx.closePath();
      this.myCanvas.ctx.fill();

      if (frozenDots === this.dots.length) {
        this.recorder.stop();
      }
    });

    window.requestAnimationFrame(this.render);
  }
}

const day2 = new Day2();

day2.init();
