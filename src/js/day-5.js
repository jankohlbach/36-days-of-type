import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { randomInRange } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day5 {
  async init() {
    ['drawLetter', 'createBoxes', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'E',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    // this.startRecording();

    this.boxes = [];

    this.createBoxes();

    this.render();
  }

  drawLetter() {
    this.myCanvas.ctx.font = `${1024 * devicePixelRatio}px Suez One`;
    this.myCanvas.ctx.translate(
      0.5 * this.myCanvas.canvas.width,
      0.6 * this.myCanvas.canvas.height,
    );
    this.myCanvas.ctx.textBaseline = 'middle';
    this.myCanvas.ctx.textAlign = 'center';
    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillText('E', 0, 0);
    this.myCanvas.ctx.translate(
      -0.5 * this.myCanvas.canvas.width,
      -0.6 * this.myCanvas.canvas.height,
    );
  }

  createBoxes() {
    const colors = [
      '#0A4371',
      '#1ED166',
      '#2ec4b6',
      '#e71d36',
      '#ff9f1c',
    ];

    let heightSum = 0;

    do {
      const height = randomInRange(20, 50);

      heightSum += height;

      const boxes = [];

      let widthSum = 0;
      let index = 0;
      let box;

      do {
        do {
          box = {
            x: widthSum - 2,
            y: 0 - height,
            heightSum,
            width: randomInRange(20, 50),
            height,
            freeze: false,
            color: colors[Math.floor(Math.random() * colors.length)],
          };
        } while (index > 0 && boxes[index - 1].color === box.color);

        index += 1;
        widthSum += box.width;
        boxes.push(box);
      } while (widthSum <= this.myCanvas.canvas.width);

      this.boxes.push({ boxes });
    } while (heightSum <= this.myCanvas.canvas.height);
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-5' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.globalCompositeOperation = 'source-over';

    this.drawLetter();

    this.myCanvas.ctx.globalCompositeOperation = 'source-atop';

    let frozenRectangles = 0;

    this.boxes.forEach((row) => {
      row.boxes.forEach((box, j) => {
        if (!box.freeze && j < Math.floor(ts * 6)) {
          const factor = this.myCanvas.canvas.height - box.y;
          box.y += factor * 0.01 > 2 ? factor * 0.01 + 1 : 2;
        }

        if (box.y + box.heightSum > this.myCanvas.canvas.height) {
          box.freeze = true;
          frozenRectangles += 1;
        }

        if (
          frozenRectangles === this.boxes
            .reduce((prevValue, currValue) => prevValue + currValue.boxes.length, 0)
        ) {
          this.recorder.stop();
        }

        this.myCanvas.ctx.fillStyle = box.color;
        this.myCanvas.ctx.fillRect(box.x, box.y, box.width, box.height);
      });
    });

    this.myCanvas.ctx.globalCompositeOperation = 'destination-over';

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    window.requestAnimationFrame(this.render);
  }
}

const day5 = new Day5();

day5.init();
