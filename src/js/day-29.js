import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day29 {
  async init() {
    ['createLetters', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: '2',
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
    const colors = [
      '#987284',
      '#75b9be',
      '#d0d6b5',
      '#f9b5ac',
      '#ee7674',
    ];

    for (let i = 0; i < 15; i += 1) {
      let letter;

      do {
        letter = {
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      } while (i > 0 && this.letters[i - 1].color === letter.color);

      this.letters.push(letter);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-29' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.save();

    this.myCanvas.ctx.translate(
      0.5 * this.myCanvas.canvas.width,
      0.45 * this.myCanvas.canvas.height,
    );

    this.letters.forEach((letter, i) => {
      this.myCanvas.ctx.font = `${1024 * devicePixelRatio}px Suez One`;
      this.myCanvas.ctx.textBaseline = 'middle';
      this.myCanvas.ctx.textAlign = 'center';
      this.myCanvas.ctx.fillStyle = letter.color;
      this.myCanvas.ctx.fillText('2', -Math.sin(ts + i * 0.1) * 100, Math.cos(ts + i * 0.1) * 100);
    });

    this.myCanvas.ctx.restore();

    if (ts > 5) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day29 = new Day29();

day29.init();
