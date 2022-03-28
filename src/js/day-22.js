import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { randomInRange, drawLetter } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day22 {
  async init() {
    ['createStripes', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'V',
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

  createStripes() {
    let sum = 0;

    while (sum < this.myCanvas.canvas.height) {
      const colors = [
        '#ef476f',
        '#ffd166',
        '#06d6a0',
        '#118ab2',
        '#073b4c',
      ];

      const stripe = {
        x: 0,
        y: this.myCanvas.canvas.height + sum,
        width: this.myCanvas.canvas.width,
        height: randomInRange(30, 50),
        rotation: randomInRange(0, 360),
        freeze: false,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      this.stripes.push(stripe);

      sum += stripe.height;
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-22' });
    this.recorder.start();
  }

  render() {
    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.globalCompositeOperation = 'source-over';

    drawLetter(this.myCanvas, 'V');

    this.myCanvas.ctx.globalCompositeOperation = 'source-atop';

    let frozenStripes = 0;

    this.stripes.forEach((stripe) => {
      if (!stripe.freeze) {
        stripe.y -= 2;
      }

      if (stripe.y < this.myCanvas.canvas.height / 2) {
        stripe.freeze = true;
        frozenStripes += 1;
      }

      this.myCanvas.ctx.translate(
        0.5 * this.myCanvas.canvas.width,
        0.5 * this.myCanvas.canvas.height,
      );
      this.myCanvas.ctx.rotate(stripe.rotation);
      this.myCanvas.ctx.translate(
        -0.5 * this.myCanvas.canvas.width,
        -0.5 * this.myCanvas.canvas.height,
      );
      this.myCanvas.ctx.fillStyle = stripe.color;
      this.myCanvas.ctx.fillRect(stripe.x, stripe.y, stripe.width, stripe.height);
      this.myCanvas.ctx.translate(
        0.5 * this.myCanvas.canvas.width,
        0.5 * this.myCanvas.canvas.height,
      );
      this.myCanvas.ctx.rotate(-stripe.rotation);
      this.myCanvas.ctx.translate(
        -0.5 * this.myCanvas.canvas.width,
        -0.5 * this.myCanvas.canvas.height,
      );
    });

    this.myCanvas.ctx.globalCompositeOperation = 'destination-over';

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    if (frozenStripes === this.stripes.length) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day22 = new Day22();

day22.init();
