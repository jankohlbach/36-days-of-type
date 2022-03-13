import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { checkIfInLetter } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day7 {
  async init() {
    ['createLines', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'G',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.step = 3;

    this.lines = [];

    this.createLines();

    // this.startRecording();

    this.render();
  }

  createLines() {
    const colors = [
      '#8b1e3f',
      '#3c153b',
      '#89bd9e',
      '#f0c987',
      '#db4c40',
    ];

    for (let i = 1; i < this.myCanvas.canvas.height / 15; i += 1) {
      let line;

      do {
        line = {
          x: this.myCanvas.canvas.width / 8,
          lastX: this.myCanvas.canvas.width / 8 + this.step * 2,
          y: i * 15,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      } while (i > 1 && this.lines[i - 2].color === line.color);

      this.lines.push(line);
    }

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-7' });
    this.recorder.start();
  }

  render() {
    this.lines.forEach((line, i) => {
      if (line.lastX < (this.myCanvas.canvas.width / 8) * 7) {
        line.x += this.step;
      }

      if (i === this.lines.length - 1 && line.lastX >= (this.myCanvas.canvas.width / 8) * 7) {
        this.recorder.stop();
      }

      if (
        checkIfInLetter(this.letterMapData, line.x - 50, line.y)
        || checkIfInLetter(this.letterMapData, line.x + 50, line.y)
        || checkIfInLetter(this.letterMapData, line.x, line.y - 20)
        || checkIfInLetter(this.letterMapData, line.x, line.y + 20)
      ) {
        if (checkIfInLetter(this.letterMapData, line.x, line.y)) {
          this.myCanvas.ctx.beginPath();
          this.myCanvas.ctx.strokeStyle = line.color;
          this.myCanvas.ctx.lineWidth = 5;
          this.myCanvas.ctx.moveTo(line.x, line.y);
          this.myCanvas.ctx.lineTo(line.lastX, line.y);
        } else {
          this.myCanvas.ctx.beginPath();
          this.myCanvas.ctx.strokeStyle = line.color;
          this.myCanvas.ctx.lineWidth = 1;
          this.myCanvas.ctx.moveTo(line.x, line.y);
          this.myCanvas.ctx.lineTo(line.lastX, line.y);
        }
      }

      line.lastX += this.step;

      this.myCanvas.ctx.stroke();
    });

    window.requestAnimationFrame(this.render);
  }
}

const day7 = new Day7();

day7.init();
