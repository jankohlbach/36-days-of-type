import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { randomInRange, checkIfInLetter } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day8 {
  async init() {
    ['drawLetter', 'createPoints', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'H',
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

  drawLetter() {
    this.myCanvas.ctx.font = `${1024 * devicePixelRatio}px Suez One`;
    this.myCanvas.ctx.translate(
      0.5 * this.myCanvas.canvas.width,
      0.6 * this.myCanvas.canvas.height,
    );
    this.myCanvas.ctx.textBaseline = 'middle';
    this.myCanvas.ctx.textAlign = 'center';
    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillText('H', 0, 0);
    this.myCanvas.ctx.translate(
      -0.5 * this.myCanvas.canvas.width,
      -0.6 * this.myCanvas.canvas.height,
    );
  }

  createPoints() {
    for (let i = 0; i < 500; i += 1) {
      const colors = [
        '#5bc0eb',
        '#fde74c',
        '#9bc53d',
        '#e55934',
        '#fa7921',
      ];

      let point;
      let inLetter;

      do {
        const start = this.myCanvas.canvas.width / 10;

        point = {
          x: start,
          y: start,
          startX: start,
          startY: start,
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
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-8' });
    this.recorder.start();
  }

  render() {
    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.globalCompositeOperation = 'source-over';

    this.drawLetter();

    this.myCanvas.ctx.globalCompositeOperation = 'source-atop';

    let frozenPoints = 0;

    this.points.forEach((point) => {
      if (!point.freeze) {
        point.x += Math.cos(point.angle) * 2;
        point.y += Math.sin(point.angle) * 2;
      }

      if (point.x >= point.endX || point.y >= point.endY) {
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

const day8 = new Day8();

day8.init();
