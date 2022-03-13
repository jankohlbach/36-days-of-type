import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { randomInRange, checkIfInLetter, checkCircleOverlap } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day9 {
  async init() {
    ['createDots', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'I',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
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
    for (let i = 0; i < 750; i += 1) {
      const radius = randomInRange(2, 6);
      const colors = [
        '#da2c38',
        '#226f54',
        '#87c38f',
        '#fff89c',
        '#43291f',
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
          freeze: false,
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
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-9' });
    this.recorder.start();
  }

  render() {
    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    let frozenDots = 0;

    this.dots.forEach((dot) => {
      if (!checkIfInLetter(this.letterMapData, dot.x, dot.y)) {
        frozenDots += 1;
      } else {
        dot.x += Math.cos(dot.angle * Math.PI * 2) * 1.5;
        dot.y += Math.sin(dot.angle * Math.PI * 2) * 1.5;
      }

      this.myCanvas.ctx.fillStyle = dot.color;
      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.arc(dot.x, dot.y, dot.radius, 0, 360);
      this.myCanvas.ctx.closePath();
      this.myCanvas.ctx.fill();

      if (frozenDots === this.dots.length) {
        this.recorder?.stop();
      }
    });

    window.requestAnimationFrame(this.render);
  }
}

const day9 = new Day9();

day9.init();
