import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day24 {
  async init() {
    ['createLetters', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'X',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      isNumber: true,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.letters = [];

    this.createLetters();

    // this.startRecording();

    this.render();
  }

  createLetters() {
    for (let i = 0; i < 10; i += 1) {
      const letter = {
        fontSize: 1024 - i * 80,
        offset: 0,
        direction: Math.random() < 0.5 ? -1 : 1,
      };

      this.letters.push(letter);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-24' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    const gradient = this.myCanvas.ctx.createRadialGradient(
      0,
      -0.05 * this.myCanvas.canvas.height,
      this.myCanvas.canvas.width / 100,
      0,
      -0.05 * this.myCanvas.canvas.height,
      this.myCanvas.canvas.width / 2.5,
    );

    gradient.addColorStop(0, '#54d19d');
    gradient.addColorStop(0.2, '#18d988');
    gradient.addColorStop(0.4, '#069459');
    gradient.addColorStop(0.6, '#194f38');
    gradient.addColorStop(0.8, '#0c291d');

    this.myCanvas.ctx.save();

    this.myCanvas.ctx.translate(
      0.5 * this.myCanvas.canvas.width,
      0.6 * this.myCanvas.canvas.height,
    );

    this.letters.forEach((letter) => {
      letter.offset += 1 * letter.direction;

      this.myCanvas.ctx.setLineDash([20, 50, 50, 40, 40, 30]);
      this.myCanvas.ctx.lineDashOffset = letter.offset;

      this.myCanvas.ctx.font = `${letter.fontSize * devicePixelRatio}px Suez One`;
      this.myCanvas.ctx.textBaseline = 'middle';
      this.myCanvas.ctx.textAlign = 'center';
      this.myCanvas.ctx.strokeStyle = gradient;
      this.myCanvas.ctx.lineWidth = letter.fontSize / 80;
      this.myCanvas.ctx.lineCap = 'round';
      this.myCanvas.ctx.strokeText('X', 0, 0);
    });

    this.myCanvas.ctx.restore();

    if (ts > 6) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day24 = new Day24();

day24.init();
