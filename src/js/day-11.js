import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { randomInRange, checkIfInLetter } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day11 {
  async init() {
    ['createPoints', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'K',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.points = [];

    this.createPoints();

    // this.startRecording();

    this.render();
  }

  createPoints() {
    for (let i = 0; i < 500; i += 1) {
      const colors = [
        '#ff6f59',
        '#254441',
        '#43aa8b',
        '#5256DC',
        '#ef3054',
      ];

      let point;
      let inLetter;

      do {
        point = {
          x: randomInRange(0, this.myCanvas.canvas.width),
          y: randomInRange(0, this.myCanvas.canvas.height),
          nextX: null,
          nextY: null,
          stepX: null,
          stepY: null,
          angle: randomInRange(0, 2),
          freeze: false,
          index: i,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        point.stepX = Math.cos(point.angle * Math.PI) * 1.5;
        point.stepY = Math.sin(point.angle * Math.PI) * 1.5;
        inLetter = checkIfInLetter(this.letterMapData, point.x, point.y);
      } while (!inLetter);

      this.points.push(point);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-11' });
    this.recorder.start();
  }

  render() {
    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    let frozenPoints = 0;

    this.points.forEach((point) => {
      if (!point.freeze) {
        point.nextX += point.stepX;
        point.nextY += point.stepY;
      }

      if (!checkIfInLetter(this.letterMapData, point.x + point.nextX, point.y + point.nextY)) {
        point.freeze = true;
        frozenPoints += 1;
      }

      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.strokeStyle = point.color;
      this.myCanvas.ctx.lineWidth = 1;
      this.myCanvas.ctx.moveTo(point.x, point.y);
      this.myCanvas.ctx.lineTo(point.x + point.nextX, point.y + point.nextY);
      this.myCanvas.ctx.stroke();

      if (frozenPoints === this.points.length) {
        this.recorder?.stop();
      }
    });

    window.requestAnimationFrame(this.render);
  }
}

const day11 = new Day11();

day11.init();
