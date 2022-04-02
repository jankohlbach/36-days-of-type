import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { randomInRange, checkIfInLetter, drawLetter } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day31 {
  async init() {
    ['createPoints', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: '4',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      isNumber: true,
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
    const points = 300;

    for (let i = 0; i < points; i += 1) {
      const colors = [
        '#e3b505',
        '#95190c',
        '#610345',
        '#107e7d',
        '#044b7f',
      ];

      let point;
      let inLetter;

      do {
        let startX;
        let startY;

        if (i < points / 4) {
          startX = this.myCanvas.canvas.width / 6;
          startY = this.myCanvas.canvas.height / 6;
        } else if (i < points / 2) {
          startX = (this.myCanvas.canvas.width / 6) * 5;
          startY = this.myCanvas.canvas.height / 6;
        } else if (i < (points / 4) * 3) {
          startX = (this.myCanvas.canvas.width / 6) * 5;
          startY = (this.myCanvas.canvas.height / 6) * 5;
        } else {
          startX = this.myCanvas.canvas.width / 6;
          startY = (this.myCanvas.canvas.height / 6) * 5;
        }

        point = {
          x: startX,
          y: startY,
          startX,
          startY,
          endX: randomInRange(0, this.myCanvas.canvas.width),
          endY: randomInRange(0, this.myCanvas.canvas.height),
          angle: null,
          freeze: false,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        point.angle = Math.atan2(point.endY - point.startY, point.endX - point.startX);
        inLetter = checkIfInLetter(this.letterMapData, point.endX, point.endY);
      } while (!inLetter);

      this.points.push(point);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-31' });
    this.recorder.start();
  }

  render() {
    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.globalCompositeOperation = 'source-over';

    drawLetter(this.myCanvas, '4', true);

    this.myCanvas.ctx.globalCompositeOperation = 'source-atop';

    let frozenPoints = 0;

    this.points.forEach((point) => {
      if (!point.freeze) {
        point.x += Math.cos(point.angle) * 2;
        point.y += Math.sin(point.angle) * 2;
      }

      if (
        (
          (Math.cos(point.angle) > 0 && Math.sin(point.angle) > 0)
          && (point.x >= point.endX || point.y >= point.endY)
        )
        || (
          (Math.cos(point.angle) < 0 && Math.sin(point.angle) > 0)
          && (point.x <= point.endX || point.y >= point.endY)
        )
        || (
          (Math.cos(point.angle) < 0 && Math.sin(point.angle) < 0)
          && (point.x <= point.endX || point.y <= point.endY)
        )
        || (
          (Math.cos(point.angle) > 0 && Math.sin(point.angle) < 0)
          && (point.x >= point.endX || point.y <= point.endY)
        )
      ) {
        point.freeze = true;
        frozenPoints += 1;
      }

      this.myCanvas.ctx.beginPath();
      this.myCanvas.ctx.strokeStyle = point.color;
      this.myCanvas.ctx.lineWidth = 1;
      this.myCanvas.ctx.moveTo(point.startX, point.startY);
      this.myCanvas.ctx.lineTo(point.x, point.y);
      this.myCanvas.ctx.stroke();

      if (frozenPoints === this.points.length) {
        this.recorder?.stop();
      }
    });

    this.myCanvas.ctx.globalCompositeOperation = 'destination-over';

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    window.requestAnimationFrame(this.render);
  }
}

const day31 = new Day31();

day31.init();
