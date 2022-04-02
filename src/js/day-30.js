import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { drawLetter } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day30 {
  async init() {
    ['createLines', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: '3',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      isNumber: true,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.linesX = [];
    this.linesY = [];

    this.createLines();

    // this.startRecording();

    this.render();
  }

  createLines() {
    const colors = [
      'black',
      'red',
      'blue',
      'gray',
      'orange',
    ];

    for (let i = 0; i < this.myCanvas.canvas.width; i += 40) {
      const line = {
        minusX: null,
        minusY: null,
        plusX: null,
        plusY: null,
        startX: i,
        startY: this.myCanvas.canvas.height / 2,
        freeze: false,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      line.minusX = line.startX;
      line.minusY = line.startY;
      line.plusX = line.startX;
      line.plusY = line.startY;

      this.linesY.push(line);
    }

    for (let j = 0; j < this.myCanvas.canvas.height; j += 40) {
      const line = {
        minusX: null,
        minusY: null,
        plusX: null,
        plusY: null,
        startX: this.myCanvas.canvas.width / 2,
        startY: j,
        freeze: false,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      line.minusX = line.startX;
      line.minusY = line.startY;
      line.plusX = line.startX;
      line.plusY = line.startY;

      this.linesX.push(line);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-30' });
    this.recorder.start();
  }

  render(ts = 1) {
    ts /= 1000;

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.globalCompositeOperation = 'source-over';

    drawLetter(this.myCanvas, '3', true, true);

    this.myCanvas.ctx.globalCompositeOperation = 'source-atop';

    this.linesX.forEach((line) => {
      line.minusX -= ts * 1.2;
      line.plusX += ts * 1.2;

      this.myCanvas.ctx.strokeStyle = line.color;
      this.myCanvas.ctx.lineWidth = 3;
      this.myCanvas.ctx.lineCap = 'round';

      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.moveTo(line.startX, line.startY);
      this.myCanvas.ctx.lineTo(line.minusX, line.startY);
      this.myCanvas.ctx.stroke();
      this.myCanvas.ctx.closePath();

      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.moveTo(line.startX, line.startY);
      this.myCanvas.ctx.lineTo(line.plusX, line.startY);
      this.myCanvas.ctx.stroke();
      this.myCanvas.ctx.closePath();
    });

    this.linesY.forEach((line) => {
      line.minusY -= ts * 1.2;
      line.plusY += ts * 1.2;

      this.myCanvas.ctx.strokeStyle = line.color;
      this.myCanvas.ctx.lineWidth = 3;
      this.myCanvas.ctx.lineCap = 'round';

      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.moveTo(line.startX, line.startY);
      this.myCanvas.ctx.lineTo(line.startX, line.minusY);
      this.myCanvas.ctx.stroke();
      this.myCanvas.ctx.closePath();

      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.moveTo(line.startX, line.startY);
      this.myCanvas.ctx.lineTo(line.startX, line.plusY);
      this.myCanvas.ctx.stroke();
      this.myCanvas.ctx.closePath();
    });

    this.myCanvas.ctx.globalCompositeOperation = 'destination-over';

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    if (ts > 4) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day30 = new Day30();

day30.init();
