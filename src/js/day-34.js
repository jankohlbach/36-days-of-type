import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { randomInRange, checkIfInLetter, checkRectOverlap } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day34 {
  async init() {
    ['createBoxes', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: '7',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      isNumber: true,
      extra: true,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.spacing = 2;

    this.boxes = [];

    this.createBoxes();

    // this.startRecording();

    this.render();
  }

  createBoxes() {
    for (let i = 0; i < 150; i += 1) {
      const width = 2;
      const height = 2;
      const aspectRatioRange = 0.4;
      const colors = [
        '#1b998b',
        '#2d3047',
        '#fffd82',
        '#ff9b71',
        '#e84855',
      ];

      let box;
      let inLetter;
      let overlaps;

      do {
        const aspectRatio = randomInRange(1 - aspectRatioRange, 1 + aspectRatioRange);

        box = {
          x: randomInRange(0, this.myCanvas.canvas.width - width - this.spacing),
          y: randomInRange(0, this.myCanvas.canvas.height - height - this.spacing),
          width,
          height: height * aspectRatio,
          aspectRatio,
          index: i,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        inLetter = checkIfInLetter(this.letterMapData, box.x, box.y);
        overlaps = checkRectOverlap(box, this.boxes, this.spacing);
      } while (overlaps || !inLetter);

      this.boxes.push(box);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-34' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.boxes.forEach((box, i) => {
      if (i < Math.floor(ts * 25)) {
        box.x -= 0.1;
        box.y -= 0.1;
        box.width += 0.2;
        box.height += 0.2 * box.aspectRatio;

        this.myCanvas.ctx.fillStyle = box.color;
        this.myCanvas.ctx.fillRect(box.x, box.y, box.width, box.height);
      }
    });

    if (ts > 8.5) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day34 = new Day34();

day34.init();
