import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { checkIfInLetter } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day10 {
  async init() {
    ['createLines', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'J',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      isNumber: true,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.stopRender = false;

    this.step = 2;

    this.overlap = 50;

    this.linesX = [];

    this.linesY = [];

    this.createLines();

    // this.startRecording();

    this.render();
  }

  createLines() {
    const colors = [
      '#083d77',
      '#ebebd3',
      '#f4d35e',
      '#ee964b',
      '#f95738',

    ];

    for (let i = 1; i < this.myCanvas.canvas.height / 15; i += 1) {
      let line;

      do {
        line = {
          x: this.myCanvas.canvas.width / 6,
          lastX: this.myCanvas.canvas.width / 6 + 2 * this.step,
          y: i * 15,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      } while (i > 1 && this.linesX[i - 2].color === line.color);

      this.linesX.push(line);
    }

    for (let i = 1; i < this.myCanvas.canvas.width / 15; i += 1) {
      let line;

      do {
        line = {
          x: i * 15,
          y: this.myCanvas.canvas.width / 12,
          lastY: this.myCanvas.canvas.width / 12 + 2 * this.step,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      } while (i > 1 && this.linesY[i - 2].color === line.color);

      this.linesY.push(line);
    }

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.height, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-10' });
    this.recorder.start();
  }

  render() {
    this.linesX.forEach((line) => {
      if (line.lastX < (this.myCanvas.canvas.width / 6) * 5) {
        line.x += this.step;
      }

      if (
        (
          checkIfInLetter(this.letterMapData, line.x + this.overlap, line.y)
          && !checkIfInLetter(this.letterMapData, line.x, line.y)
        )
        || (
          checkIfInLetter(this.letterMapData, line.x - this.overlap, line.y)
          && !checkIfInLetter(this.letterMapData, line.x, line.y)
        )
      ) {
        this.myCanvas.ctx.beginPath();
        this.myCanvas.ctx.strokeStyle = line.color;
        this.myCanvas.ctx.lineWidth = 3;
        this.myCanvas.ctx.moveTo(line.x, line.y);
        this.myCanvas.ctx.lineTo(line.lastX, line.y);
        this.myCanvas.ctx.stroke();
      }

      line.lastX += this.step;
    });

    this.linesY.forEach((line, i) => {
      if (line.lastY < (this.myCanvas.canvas.width / 12) * 11) {
        line.y += this.step;
      }

      if (i === this.linesY.length - 1 && line.lastY >= (this.myCanvas.canvas.width / 12) * 11) {
        this.stopRender = true;
        this.recorder?.stop();
      }

      if (
        (
          checkIfInLetter(this.letterMapData, line.x, line.y + this.overlap)
          && !checkIfInLetter(this.letterMapData, line.x, line.y)
        )
        || (
          checkIfInLetter(this.letterMapData, line.x, line.y - this.overlap)
          && !checkIfInLetter(this.letterMapData, line.x, line.y)
        )
      ) {
        this.myCanvas.ctx.beginPath();
        this.myCanvas.ctx.strokeStyle = line.color;
        this.myCanvas.ctx.lineWidth = 3;
        this.myCanvas.ctx.moveTo(line.x, line.y);
        this.myCanvas.ctx.lineTo(line.x, line.lastY);
        this.myCanvas.ctx.stroke();
      }

      line.lastY += this.step;
    });

    if (this.stopRender) {
      window.cancelAnimationFrame(this.render);
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day10 = new Day10();

day10.init();
