import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { checkIfInLetter } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day33 {
  async init() {
    ['createDots', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: '6',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      isNumber: true,
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
    for (let i = 0; i < this.myCanvas.canvas.height; i += 32) {
      for (let j = 0; j < this.myCanvas.canvas.width; j += 32) {
        const colors = [
          '#6e44ff',
          '#06d6a0',
          '#1b9aaa',
          '#ef476f',
          '#ffc43d',
        ];

        const dot = {
          x: j,
          y: i,
          radius: 5,
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
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-33' });
    this.recorder.start();
  }

  render(ts = 1) {
    ts /= 1000;

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.dots.forEach((dot, i) => {
      dot.x += Math.cos(ts * 3 + i / 25) / 4;
      dot.y += Math.sin(ts * 3 + i / 25) / 4;

      this.myCanvas.ctx.fillStyle = dot.color;
      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.arc(dot.x, dot.y, dot.radius, 0, 360);
      this.myCanvas.ctx.closePath();
      this.myCanvas.ctx.fill();
    });

    if (ts > 5) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day33 = new Day33();

day33.init();
