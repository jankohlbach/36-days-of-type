import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { checkIfInLetter, randomInRange } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day3 {
  async init() {
    ['createLines', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'C',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    // this.startRecording();

    this.lines = [];

    this.createLines();

    this.render();
  }

  createLines() {
    for (let i = 0; i < 200; i += 1) {
      const colors = [
        '#0b3954',
        '#bfd7ea',
        '#ff6663',
        '#e0ff4f',
        '#fefffe',
      ];
      const border = Math.ceil(Math.random() * 4);

      let startX;
      let startY;
      let moveX;
      let moveY;

      switch (border) {
        case 1:
          startX = randomInRange(0, this.myCanvas.canvas.width);
          startY = randomInRange(0, this.myCanvas.canvas.height / 6);
          moveX = startX < this.myCanvas.canvas.width / 2
            ? randomInRange(0.5, 1) : randomInRange(-1, -0.5);
          moveY = randomInRange(0.5, 1);
          break;
        case 2:
          startX = randomInRange(
            this.myCanvas.canvas.width * (5 / 6),
            this.myCanvas.canvas.width,
          );
          startY = randomInRange(0, this.myCanvas.canvas.height);
          moveX = randomInRange(-1, -0.5);
          moveY = startY < this.myCanvas.canvas.height / 2
            ? randomInRange(0.5, 1) : randomInRange(-1, -0.5);
          break;
        case 3:
          startX = randomInRange(0, this.myCanvas.canvas.width);
          startY = randomInRange(
            this.myCanvas.canvas.height * (5 / 6),
            this.myCanvas.canvas.height,
          );
          moveX = startX < this.myCanvas.canvas.width / 2
            ? randomInRange(0.5, 1) : randomInRange(-1, -0.5);
          moveY = randomInRange(-1, -0.5);
          break;
        case 4:
          startX = randomInRange(0, this.myCanvas.canvas.width / 6);
          startY = randomInRange(0, this.myCanvas.canvas.height);
          moveX = randomInRange(0.5, 1);
          moveY = startY < this.myCanvas.canvas.height / 2
            ? randomInRange(0.5, 1) : randomInRange(-1, -0.5);
          break;
        default:
      }

      const line = {
        startX,
        startY,
        endX: null,
        endY: null,
        moveX,
        moveY,
        freeze: false,
        wasInLetter: false,
        color: colors[Math.floor(Math.random() * colors.length)],
        strokeWidth: randomInRange(2, 5),
      };

      line.endX = line.startX + line.moveX;
      line.endY = line.startY + line.moveY;

      this.lines.push(line);

      this.myCanvas.ctx.strokeStyle = 'white';
      this.myCanvas.ctx.lineWidth = line.strokeWidth;
      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.moveTo(line.startX, line.startY);
      this.myCanvas.ctx.lineTo(line.endX, line.endY);
      this.myCanvas.ctx.stroke();
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-3' });
    this.recorder.start();
  }

  render() {
    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    let frozenLines = 0;

    this.lines.forEach((line) => {
      if (!line.freeze) {
        line.endX += 4 * line.moveX;
        line.endY += 4 * line.moveY;

        if (!line.wasInLetter && checkIfInLetter(this.letterMapData, line.endX, line.endY)) {
          line.wasInLetter = true;
          line.startX = line.endX;
          line.startY = line.endY;
        }
      }

      if (
        line.endX <= 0
        || line.endX >= this.myCanvas.canvas.width
        || line.endY <= 0
        || line.endY >= this.myCanvas.canvas.height
        || (line.wasInLetter && !checkIfInLetter(this.letterMapData, line.endX, line.endY))
      ) {
        line.freeze = true;
        frozenLines += 1;
      }

      if (line.wasInLetter) {
        this.myCanvas.ctx.strokeStyle = line.color;
      } else {
        this.myCanvas.ctx.strokeStyle = 'white';
      }

      this.myCanvas.ctx.lineWidth = line.strokeWidth;
      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.moveTo(line.startX, line.startY);
      this.myCanvas.ctx.lineTo(line.endX, line.endY);
      this.myCanvas.ctx.stroke();

      if (frozenLines === this.lines.length) {
        this.recorder?.stop();
      }
    });

    window.requestAnimationFrame(this.render);
  }
}

const day3 = new Day3();

day3.init();
