import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day25 {
  async init() {
    ['createLetters', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'Y',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.loops = 0;

    this.amount = 0.0007;

    this.degrees = 0;

    this.letters = [];

    this.createLetters();

    // this.startRecording();

    this.render();
  }

  createLetters() {
    const colors = [
      '#9b5de5',
      '#f15bb5',
      '#fee440',
      '#00bbf9',
      '#00f5d4',
    ];

    for (let i = 0; i < 20; i += 1) {
      let letter;

      do {
        letter = {
          fontSize: (1024 - 20 * 40) + 40 * i,
          startFontSize: 1024,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      } while (i > 0 && this.letters[i - 1].color === letter.color);

      this.letters.push(letter);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-25' });
    this.recorder.start();
  }

  render() {
    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.save();

    this.myCanvas.ctx.translate(
      0.5 * this.myCanvas.canvas.width,
      0.6 * this.myCanvas.canvas.height,
    );

    let degreeSum = 0;

    this.letters.forEach((letter, i) => {
      if ((degreeSum < 170 && this.amount > 0) || (degreeSum < -170 && this.amount < 0)) {
        if (this.degrees < 0 && this.amount < 0) {
          this.loops += 1;
        }

        this.amount = 0.0007;
      } else {
        this.amount = -0.0007;
      }

      this.degrees += this.amount;

      degreeSum += this.degrees * i;

      this.myCanvas.ctx.rotate(this.degrees * i * (Math.PI / 180));
      this.myCanvas.ctx.font = `${letter.fontSize * devicePixelRatio}px Suez One`;
      this.myCanvas.ctx.textBaseline = 'middle';
      this.myCanvas.ctx.textAlign = 'center';
      this.myCanvas.ctx.strokeStyle = letter.color;
      this.myCanvas.ctx.lineWidth = letter.fontSize / 200;
      this.myCanvas.ctx.strokeText('Y', 0, 0);
    });

    this.myCanvas.ctx.restore();

    if (this.loops > 0 && this.degrees > 0) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day25 = new Day25();

day25.init();
