import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { randomInRange, drawLetter } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day23 {
  async init() {
    ['createCircles', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'W',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.circles = [];

    this.createCircles();

    // this.startRecording();

    this.render();
  }

  createCircles() {
    const colors = [
      '#ed254e',
      '#f9dc5c',
      '#c2eabd',
      '#011936',
      '#465362',
    ];

    for (let i = 0; i < 600; i += 1) {
      const circle = {
        x: randomInRange(this.myCanvas.canvas.width / 12, (this.myCanvas.canvas.width / 12) * 11),
        y: this.myCanvas.canvas.height * 0.85,
        nextY: 0,
        radius: randomInRange(5, 20),
        strokeWidth: randomInRange(1, 3),
        delay: i / 10,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      this.circles.push(circle);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(23);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-23' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.globalCompositeOperation = 'source-over';

    drawLetter(this.myCanvas, 'W');

    this.myCanvas.ctx.globalCompositeOperation = 'source-atop';
    this.circles.forEach((circle) => {
      if (ts * 4 > circle.delay) {
        circle.nextY += 1;

        this.myCanvas.ctx.strokeStyle = circle.color;
        this.myCanvas.ctx.lineWidth = circle.strokeWidth;
        this.myCanvas.ctx.beginPath();
        this.myCanvas.ctx.arc(circle.x, circle.y - circle.nextY, circle.radius, 0, 360);
        this.myCanvas.ctx.closePath();
        this.myCanvas.ctx.stroke();
      }
    });

    this.myCanvas.ctx.globalCompositeOperation = 'destination-over';

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    if (this.circles[this.circles.length - 1].nextY > 0) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day23 = new Day23();

day23.init();
