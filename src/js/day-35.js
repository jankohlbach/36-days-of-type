import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { drawLetter } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day35 {
  async init() {
    ['createLines', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: '8',
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
      '#ee6352',
      '#08b2e3',
      '#a977d1',
      '#57a773',
      '#484d6d',
    ];

    for (let x = 0; x < this.myCanvas.canvas.width; x += 25) {
      const direction = Math.random() < 0.5 ? -1 : 1;

      const line = {
        x,
        y: null,
        startY: direction === -1
          ? (this.myCanvas.canvas.height / 10) * 9
          : this.myCanvas.canvas.height / 10,
        direction,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      line.y = line.startY;

      this.lines.push(line);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-35' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.globalCompositeOperation = 'source-over';

    drawLetter(this.myCanvas, '8');

    this.myCanvas.ctx.globalCompositeOperation = 'source-atop';

    this.lines.forEach((line) => {
      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.lineWidth = 3;
      this.myCanvas.ctx.lineCap = 'round';
      this.myCanvas.ctx.strokeStyle = line.color;

      line.y += line.direction * 5;

      this.myCanvas.ctx.moveTo(line.x, line.startY);

      let x;
      if (line.direction === -1) {
        for (let y = line.startY; y > line.y; y -= 1) {
          x = Math.sin((line.startY - y) * 0.05 + ts * 1.5)
            * (this.myCanvas.canvas.width / 40)
            + (this.myCanvas.canvas.width / 40);
          this.myCanvas.ctx.lineTo(line.x - x, y);
        }
      } else {
        for (let y = line.startY; y < line.y; y += 1) {
          x = Math.sin(y * 0.05 + ts * 1.5)
            * (this.myCanvas.canvas.width / 40)
            + (this.myCanvas.canvas.width / 40);
          this.myCanvas.ctx.lineTo(line.x + x, y);
        }
      }

      this.myCanvas.ctx.stroke();
      this.myCanvas.ctx.closePath();
    });

    this.myCanvas.ctx.globalCompositeOperation = 'destination-over';

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    if (ts > 7.5) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day35 = new Day35();

day35.init();
