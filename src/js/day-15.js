import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { randomInRange } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day15 {
  async init() {
    ['createLetters', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'O',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.loopIndex = 0;

    this.loopCount = 0;

    this.letters = [];

    this.createLetters();

    // this.startRecording();

    this.render();
  }

  createLetters() {
    const colors = [
      '#f7c1bb',
      '#885a5a',
      '#353a47',
      '#84b082',
      '#dc136c',
    ];

    for (let i = 0; i < 25; i += 1) {
      let letter;

      do {
        letter = {
          fontSize: randomInRange(500, 1024),
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      } while (i > 0 && this.letters[i - 1].color === letter.color);

      this.letters.push(letter);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-15' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 250;

    const timeIndex = Math.floor(ts) % this.letters.length;

    if (!(this.loopIndex === timeIndex)) {
      if (this.loopIndex % 2 === 0) {
        this.loopCount += 1;
      }

      this.loopIndex = timeIndex;

      this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

      this.myCanvas.ctx.save();

      this.myCanvas.ctx.translate(
        0.5 * this.myCanvas.canvas.width,
        0.6 * this.myCanvas.canvas.height,
      );

      this.myCanvas.ctx.globalCompositeOperation = 'destination-over';

      this.letters.forEach((letter) => {
        letter.fontSize = randomInRange(500, 1024);

        this.myCanvas.ctx.font = `${letter.fontSize * devicePixelRatio}px Suez One`;
        this.myCanvas.ctx.textBaseline = 'middle';
        this.myCanvas.ctx.textAlign = 'center';
        this.myCanvas.ctx.fillStyle = letter.color;
        this.myCanvas.ctx.fillText('O', 0, 0);
      });

      this.myCanvas.ctx.restore();

      this.myCanvas.ctx.globalCompositeOperation = 'destination-over';

      this.myCanvas.ctx.fillStyle = 'white';
      this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);
    }

    if (this.loopCount > 15) {
      window.cancelAnimationFrame(this.render);
      this.recorder.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day15 = new Day15();

day15.init();
