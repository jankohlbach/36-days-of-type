import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { checkIfInLetter, randomInRange } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day19 {
  async init() {
    ['createDots', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'S',
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
    for (let i = 0; i < 500; i += 1) {
      const colors = [
        '#227c9d',
        '#17c3b2',
        '#ffcb77',
        '#ff1053',
        '#fe6d73',
      ];

      let dot;

      do {
        dot = {
          x: randomInRange(0, this.myCanvas.canvas.width),
          y: randomInRange(0, this.myCanvas.canvas.height),
          rotation: randomInRange(0, 2),
          rotationStep: Math.random() < 0.5 ? -0.02 : 0.02,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      } while (!checkIfInLetter(this.letterMapData, dot.x, dot.y));

      this.dots.push(dot);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-19' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.dots.forEach((dot) => {
      this.myCanvas.ctx.save();

      this.myCanvas.ctx.translate(
        dot.x,
        dot.y,
      );

      this.myCanvas.ctx.rotate(dot.rotation * 2 * Math.PI);

      this.myCanvas.ctx.font = `${20 * devicePixelRatio}px Suez One`;
      this.myCanvas.ctx.textBaseline = 'middle';
      this.myCanvas.ctx.textAlign = 'center';
      this.myCanvas.ctx.fillStyle = dot.color;
      this.myCanvas.ctx.fillText('S', 0, 0);

      this.myCanvas.ctx.restore();

      dot.rotation += dot.rotationStep / 2;
    });

    if (ts > 5) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day19 = new Day19();

day19.init();
