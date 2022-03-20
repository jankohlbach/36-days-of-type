import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { checkIfInLetter } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day17 {
  async init() {
    ['createDots', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'Q',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.frozenDots = 0;

    this.dots = [];

    this.createDots();

    // this.startRecording();

    this.render();
  }

  createDots() {
    for (let i = 0; i < this.myCanvas.canvas.height; i += 40) {
      for (let j = 0; j < this.myCanvas.canvas.width; j += 40) {
        const colors = [
          '#ed254e',
          '#f9dc5c',
          '#55e1c7',
          '#011936',
          '#465362',
        ];

        const dot = {
          x: j,
          nextX: null,
          y: i,
          nextY: null,
          radius: 5,
          directionX: Math.random() < 0.5 ? -50 : 50,
          directionY: Math.random() < 0.5 ? -50 : 50,
          freeze: false,
          color: colors[Math.floor(Math.random() * colors.length)],
        };

        dot.nextX = dot.x + dot.directionX;
        dot.nextY = dot.y + dot.directionY;

        if (checkIfInLetter(this.letterMapData, dot.x, dot.y)) {
          this.dots.push(dot);
        }
      }
    }

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-17' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    this.dots.forEach((dot, i) => {
      if (i < Math.floor(ts * 25) && !dot.freeze) {
        const random = Math.random() < 0.5;

        if (random) {
          dot.nextX = dot.x + dot.directionX;
        } else {
          dot.nextY = dot.y + dot.directionY;
        }

        if (!checkIfInLetter(this.letterMapData, dot.nextX, dot.nextY)) {
          dot.freeze = true;
          this.frozenDots += 1;
        }

        this.myCanvas.ctx.beginPath();
        this.myCanvas.ctx.strokeStyle = dot.color;
        this.myCanvas.ctx.lineWidth = dot.radius;
        this.myCanvas.ctx.lineCap = 'round';
        this.myCanvas.ctx.moveTo(dot.x, dot.y);
        this.myCanvas.ctx.lineTo(random ? dot.nextX : dot.x, random ? dot.y : dot.nextY);
        this.myCanvas.ctx.stroke();

        if (random) {
          dot.x = dot.nextX;
        } else {
          dot.y = dot.nextY;
        }
      }
    });

    if (this.frozenDots === this.dots.length) {
      this.recorder?.stop();
    }

    window.requestAnimationFrame(this.render);
  }
}

const day17 = new Day17();

day17.init();
