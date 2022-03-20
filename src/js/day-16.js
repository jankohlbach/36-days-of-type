import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { checkIfInLetter } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day16 {
  async init() {
    ['createDots', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'P',
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
    for (let i = 0; i < this.myCanvas.canvas.height; i += 40) {
      for (let j = 0; j < this.myCanvas.canvas.width; j += 40) {
        const colors = [
          '#2274a5',
          '#f75c03',
          '#f1c40f',
          '#d90368',
          '#00cc66',
        ];

        const dot = {
          x: j,
          y: i,
          radius: 0,
          freeze: false,
          color: colors[Math.floor(Math.random() * colors.length)],
        };

        if (checkIfInLetter(this.letterMapData, dot.x, dot.y)) {
          this.dots.push(dot);
        }
      }
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-16' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    let frozenDots = 0;

    this.dots.forEach((dot, i) => {
      if (i < Math.floor(ts * 25)) {
        if (dot.radius < 8) {
          dot.radius += 0.08 * (10 - dot.radius) > 0.1 ? 0.08 * (10 - dot.radius) : 0.1;
        } else {
          dot.freeze = true;
          frozenDots += 1;
        }

        this.myCanvas.ctx.fillStyle = dot.color;
        this.myCanvas.ctx.beginPath();
        this.myCanvas.ctx.arc(dot.x, dot.y, dot.radius, 0, 360);
        this.myCanvas.ctx.closePath();
        this.myCanvas.ctx.fill();
      }
    });

    if (frozenDots === this.dots.length) {
      this.recorder?.stop();
    }

    window.requestAnimationFrame(this.render);
  }
}

const day16 = new Day16();

day16.init();
