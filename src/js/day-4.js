import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { randomInRange } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day4 {
  async init() {
    ['drawLetter', 'createStripes', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'D',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    // this.startRecording();

    this.drawLetter();

    this.stripes = [];

    this.rotation = randomInRange(0, 360);

    this.createStripes();

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
    this.myCanvas.ctx.fillText('D', 0, 0);
    this.myCanvas.ctx.translate(
      -0.5 * this.myCanvas.canvas.width,
      -0.6 * this.myCanvas.canvas.height,
    );
  }

  createStripes() {
    let index = 0;
    let sum = 0;

    while (sum < this.myCanvas.canvas.height) {
      const colors = [
        '#2fbf71',
        '#136f63',
        '#e0ca3c',
        '#f34213',
        '#3e2f5b',
      ];

      let stripe;

      do {
        stripe = {
          x: 0,
          y: this.myCanvas.canvas.height + sum,
          startY: this.myCanvas.canvas.height + sum,
          width: this.myCanvas.canvas.width,
          height: randomInRange(30, 80),
          rotation: this.rotation,
          freeze: false,
          index,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      } while (index > 0 && this.stripes[index - 1].color === stripe.color);

      this.stripes.push(stripe);

      sum += stripe.height;
      index += 1;
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-4' });
    this.recorder.start();
  }

  render() {
    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.globalCompositeOperation = 'source-over';

    this.drawLetter();

    this.myCanvas.ctx.globalCompositeOperation = 'source-atop';

    let frozenStripes = 0;

    this.stripes.forEach((stripe) => {
      if (!stripe.freeze) {
        stripe.y -= stripe.y * 0.015 > 1 ? stripe.y * 0.015 : 0.5;
      }

      if (stripe.startY - stripe.y > this.myCanvas.canvas.height) {
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

      if (frozenStripes === this.stripes.length) {
        this.recorder.stop();
      }
    });

    this.myCanvas.ctx.globalCompositeOperation = 'destination-over';

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    window.requestAnimationFrame(this.render);
  }
}

const day4 = new Day4();

day4.init();
