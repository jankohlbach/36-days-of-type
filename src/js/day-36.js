import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { checkIfInLetter, randomInRange } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day36 {
  async init() {
    ['createDots', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: '9',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      isNumber: true,
      extra: true,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.dots = [];

    this.createDots();

    // this.startRecording();

    this.render();
  }

  createDots() {
    for (let i = 0; i < this.myCanvas.canvas.height; i += 35) {
      for (let j = 0; j < this.myCanvas.canvas.width; j += 35) {
        const colors = [
          '#ffe94e',
          '#ffda3d',
          '#fecf3e',
          '#fdc43f',
          '#fdb833',
        ];

        const dot = {
          x: j,
          y: i,
          startAngle: 0,
          endAngle: 0,
          radius: 10,
          freeze: false,
          index: null,
          color: colors[Math.floor(Math.random() * colors.length)],
        };

        if (
          checkIfInLetter(this.letterMapData, dot.x, dot.y)
          && checkIfInLetter(this.letterMapData, dot.x - 22, dot.y)
          && checkIfInLetter(this.letterMapData, dot.x + 18, dot.y)
          && checkIfInLetter(this.letterMapData, dot.x, dot.y - 20)
          && checkIfInLetter(this.letterMapData, dot.x, dot.y + 22)
        ) {
          this.dots.push(dot);
        }
      }
    }

    this.dots.forEach((dot) => {
      dot.index = randomInRange(0, this.dots.length);
    });
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-36' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    let frozenDots = 0;

    this.dots.forEach((dot) => {
      if (dot.index < Math.floor(ts * 25)) {
        this.myCanvas.ctx.strokeStyle = dot.color;
        this.myCanvas.ctx.lineWidth = 2;
        this.myCanvas.ctx.beginPath();
        dot.endAngle += 0.1;
        this.myCanvas.ctx.arc(dot.x, dot.y, dot.radius, dot.startAngle, dot.endAngle);
        this.myCanvas.ctx.stroke();
      }

      if (dot.endAngle >= 2 * Math.PI) {
        this.myCanvas.ctx.fillStyle = dot.color;
        this.myCanvas.ctx.fill();

        dot.freeze = true;
        frozenDots += 1;
      }
    });

    this.myCanvas.ctx.save();

    this.myCanvas.ctx.translate(
      0.5 * this.myCanvas.canvas.width,
      0.46 * this.myCanvas.canvas.height,
    );

    this.myCanvas.ctx.font = `${1024 * devicePixelRatio}px Suez One`;
    this.myCanvas.ctx.textBaseline = 'middle';
    this.myCanvas.ctx.textAlign = 'center';
    this.myCanvas.ctx.strokeStyle = 'black';
    this.myCanvas.ctx.lineWidth = 10;
    this.myCanvas.ctx.strokeText('9', 0, 0);

    this.myCanvas.ctx.restore();

    if (frozenDots === this.dots.length) {
      this.recorder?.stop();
    }

    window.requestAnimationFrame(this.render);
  }
}

const day36 = new Day36();

day36.init();
