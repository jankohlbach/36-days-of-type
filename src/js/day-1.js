import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { randomInRange, checkIfInLetter, checkRectOverlap } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day1 {
  async init() {
    ['createRectangles', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'A',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.rectangles = [];

    this.spacing = 2;

    // this.startRecording();

    this.createRectangles();

    this.render();
  }

  createRectangles() {
    for (let i = 0; i < 2000; i += 1) {
      const width = 3;
      const height = 3;
      const aspectRatioRange = 0.4;
      const colors = [
        '#083d77',
        '#ebebd3',
        '#f4d35e',
        '#ee964b',
        '#f95738',
      ];

      let rectangle;
      let inLetter;
      let overlaps;

      do {
        const aspectRatio = randomInRange(1 - aspectRatioRange, 1 + aspectRatioRange);

        rectangle = {
          x: randomInRange(0, this.myCanvas.canvas.width - width - this.spacing),
          y: randomInRange(0, this.myCanvas.canvas.height - height - this.spacing),
          width,
          height: height * aspectRatio,
          aspectRatio,
          freeze: false,
          index: i,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        inLetter = checkIfInLetter(this.letterMapData, rectangle.x, rectangle.y);
        overlaps = checkRectOverlap(rectangle, this.rectangles, this.spacing);
      } while (overlaps || !inLetter);

      this.rectangles.push(rectangle);

      this.myCanvas.ctx.fillStyle = rectangle.color;
      this.myCanvas.ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-1' });
    this.recorder.start();
  }

  render() {
    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    let frozenRectangles = 0;

    this.rectangles.forEach((rectangle) => {
      if (!rectangle.freeze) {
        rectangle.x -= 0.06;
        rectangle.y -= 0.06;
        rectangle.width += 0.12;
        rectangle.height += 0.12 * rectangle.aspectRatio;
      }

      if (checkRectOverlap(rectangle, this.rectangles, this.spacing)) {
        rectangle.freeze = true;
        frozenRectangles += 1;
      }

      this.myCanvas.ctx.fillStyle = rectangle.color;
      this.myCanvas.ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);

      if (frozenRectangles === this.rectangles.length) {
        this.recorder?.stop();
      }
    });

    window.requestAnimationFrame(this.render);
  }
}

const day1 = new Day1();

day1.init();
