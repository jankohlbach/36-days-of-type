import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day6 {
  async init() {
    ['createLetters', 'startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'F',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.loopCount = 0;

    this.fontSize = 1024;

    this.letters = [];

    this.createLetters();

    // this.startRecording();

    this.render();
  }

  createLetters() {
    const colors = [
      '#3891a6',
      '#4c5b5c',
      '#fde74c',
      '#db5461',
      '#ff715b',
    ];

    for (let i = 0; i < 25; i += 1) {
      let letter;

      do {
        letter = {
          fontSize: 1024 - 25 * i,
          startFontSize: 1024,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      } while (i > 0 && this.letters[i - 1].color === letter.color);

      this.letters.push(letter);
    }
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-6' });
    this.recorder.start();
  }

  render() {
    if (this.loopCount === 1) {
      setTimeout(() => {
        this.recorder.stop();
      }, 2000);
    }

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.save();

    this.myCanvas.ctx.translate(
      0.5 * this.myCanvas.canvas.width,
      0.6 * this.myCanvas.canvas.height,
    );

    this.myCanvas.ctx.globalCompositeOperation = 'destination-over';

    this.letters.forEach((letter, i) => {
      this.myCanvas.ctx.font = `${letter.fontSize * devicePixelRatio}px Suez One`;
      this.myCanvas.ctx.textBaseline = 'middle';
      this.myCanvas.ctx.textAlign = 'center';
      this.myCanvas.ctx.strokeStyle = letter.color;
      this.myCanvas.ctx.lineWidth = letter.fontSize / 200;
      this.myCanvas.ctx.strokeText('F', 0, 0);

      if (this.loopCount < 1 && letter.fontSize > 100) {
        letter.fontSize -= 2;
      } else if (this.loopCount < 1) {
        if (i === 0) {
          this.loopCount += 1;
        }

        letter.fontSize = letter.startFontSize;
      }
    });

    this.myCanvas.ctx.restore();

    this.myCanvas.ctx.globalCompositeOperation = 'destination-over';

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    window.requestAnimationFrame(this.render);
  }
}

const day6 = new Day6();

day6.init();
