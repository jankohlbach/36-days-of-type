import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';
import { checkIfInLetter, randomInRange } from './helper';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day26 {
  async init() {
    ['createLines', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'Z',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.step = 40;

    this.lines = [];

    this.createLines();

    // this.startRecording();

    this.render();
  }

  createLines() {
    const colors = [
      '#2364aa',
      '#3da5d9',
      '#73bfb8',
      '#fec601',
      '#ea7317',
    ];

    for (let i = 0; i < this.myCanvas.canvas.height; i += this.step) {
      const direction = Math.random() < 0.5 ? -1 : 1;
      const letters = [];
      let startX;
      let gap = true;

      for (let j = 0; j < this.myCanvas.canvas.width; j += this.step) {
        const letter = {
          x: j,
          y: i,
          color: colors[Math.floor(Math.random() * colors.length)],
        };

        if (checkIfInLetter(this.letterMapData, letter.x, letter.y)) {
          if (letters[letters.length - 1]?.x === letter.x - this.step) {
            gap = false;
          } else {
            gap = true;
          }

          if (gap) {
            startX = j;
          }

          letter.startX = startX;

          letters.push(letter);
        }
      }

      let endX = letters[letters.length - 1]?.x;
      let prevX = endX;

      letters.reverse().forEach((letter) => {
        if (prevX > letter.x + this.step) {
          endX = letter.x;
        }

        prevX = letter.x;
        letter.endX = endX;
      });

      this.lines.push({
        direction,
        speed: randomInRange(0.8, 1.3),
        letters,
      });
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-26' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.lines.forEach((line) => {
      line.letters.forEach((letter) => {
        letter.x += line.direction * line.speed;

        if (!checkIfInLetter(this.letterMapData, letter.x, letter.y)) {
          letter.x = line.direction === -1 ? letter.endX : letter.startX;
        }

        this.myCanvas.ctx.font = `${20 * devicePixelRatio}px Suez One`;
        this.myCanvas.ctx.textBaseline = 'middle';
        this.myCanvas.ctx.textAlign = 'center';
        this.myCanvas.ctx.fillStyle = letter.color;
        this.myCanvas.ctx.fillText('Z', letter.x, letter.y);
      });
    });

    if (ts > 5) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day26 = new Day26();

day26.init();
