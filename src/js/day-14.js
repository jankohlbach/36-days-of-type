import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { randomInRange, drawLetter } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day14 {
  async init() {
    ['createLines', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'N',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.lines = [];

    this.createLines();

    // this.startRecording();

    this.render();
  }

  createLines() {
    const colors = [
      '#003049',
      '#d62828',
      '#f77f00',
      '#fcbf49',
      '#eae2b7',
    ];

    for (let i = 1; i < ((this.myCanvas.canvas.width / 8) * 6) / 15; i += 1) {
      let line;

      do {
        line = {
          x: i * 15 + (this.myCanvas.canvas.width / 8),
          y: 0,
          startY: 0,
          direction: 2,
          width: randomInRange(5, 8),
          freeze: false,
          color: colors[Math.floor(Math.random() * colors.length)],
        };

        if (Math.random() < 0.5) {
          line.startY = this.myCanvas.canvas.height;
          line.direction *= -1;
        }

        line.y = line.startY;
      } while (i > 1 && this.lines[i - 2].color === line.color);

      this.lines.push(line);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-14' });
    this.recorder.start();
  }

  render() {
    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.globalCompositeOperation = 'source-over';

    drawLetter(this.myCanvas, 'N');

    this.myCanvas.ctx.globalCompositeOperation = 'source-atop';

    let frozenLines = 0;

    this.lines.forEach((line) => {
      if (!line.freeze) {
        line.y += line.direction * (randomInRange(2, 20) / 10);
      }

      if (line.y < 0 || line.y > this.myCanvas.canvas.height) {
        line.freeze = true;
        frozenLines += 1;
      }

      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.strokeStyle = line.color;
      this.myCanvas.ctx.lineWidth = line.width;
      this.myCanvas.ctx.lineCap = 'round';
      this.myCanvas.ctx.moveTo(line.x, line.startY);
      this.myCanvas.ctx.lineTo(line.x, line.y);
      this.myCanvas.ctx.stroke();
    });

    this.myCanvas.ctx.globalCompositeOperation = 'destination-over';

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    if (frozenLines === this.lines.length) {
      this.recorder.stop();
    }

    window.requestAnimationFrame(this.render);
  }
}

const day14 = new Day14();

day14.init();
