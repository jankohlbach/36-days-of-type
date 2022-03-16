import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { randomInRange } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day12 {
  async init() {
    ['drawLetter', 'createStripes', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'L',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.stripes = [];

    this.createStripes();

    // this.startRecording();

    this.render();
  }

  drawLetter() {
    this.myCanvas.ctx.font = '60vw Suez One';
    this.myCanvas.ctx.translate(
      0.5 * this.myCanvas.canvas.width,
      0.6 * this.myCanvas.canvas.height,
    );
    this.myCanvas.ctx.textBaseline = 'middle';
    this.myCanvas.ctx.textAlign = 'center';
    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillText('L', 0, 0);
    this.myCanvas.ctx.translate(
      -0.5 * this.myCanvas.canvas.width,
      -0.6 * this.myCanvas.canvas.height,
    );
  }

  createStripes() {
    for (let i = 0; i < 500; i += 1) {
      const colors = [
        '#721817',
        '#fa9f42',
        '#2b4162',
        '#0b6e4f',
        '#e0e0e2',
      ];

      const stripe = {
        x: 0,
        y: randomInRange(0, this.myCanvas.canvas.height),
        width: this.myCanvas.canvas.width,
        height: randomInRange(20, 60),
        angle: randomInRange(0, 2),
        freeze: false,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      this.stripes.push(stripe);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-12' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.globalCompositeOperation = 'source-over';

    this.drawLetter();

    this.myCanvas.ctx.globalCompositeOperation = 'source-atop';

    this.stripes.forEach((stripe) => {
      if (Math.floor(ts) % 2 === 0) {
        stripe.angle = randomInRange(0, 2);
      }

      this.myCanvas.ctx.rotate(stripe.angle * Math.PI);
      this.myCanvas.ctx.fillStyle = stripe.color;
      this.myCanvas.ctx.fillRect(stripe.x, stripe.y, stripe.width, stripe.height);
      this.myCanvas.ctx.setTransform(1, 0, 0, 1, 0, 0);
    });

    this.myCanvas.ctx.globalCompositeOperation = 'destination-over';

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    if (ts > 5) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day12 = new Day12();

day12.init();
