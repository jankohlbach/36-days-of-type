import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day20 {
  async init() {
    ['startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'T',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.colors = ['#c61c2d', '#e22437', '#9B1825', '#a5212e', '#e63042'];

    for (let i = this.colors.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.colors[i], this.colors[j]] = [this.colors[j], this.colors[i]];
    }

    // this.startRecording();

    this.render();
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-20' });
    this.recorder.start();
  }

  render(ts) {
    ts /= 1000;

    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    const gradient = this.myCanvas.ctx.createLinearGradient(
      -0.25 * this.myCanvas.canvas.width,
      -0.3 * this.myCanvas.canvas.height,
      0.25 * this.myCanvas.canvas.width,
      0.3 * this.myCanvas.canvas.height,
    );

    if (ts) {
      gradient.addColorStop(
        Math.abs(0.5 * Math.sin(ts * 2) + 0.5).toFixed(10) * 0.05, this.colors[0],
      );
      gradient.addColorStop(
        Math.abs(0.5 * Math.sin(ts * 2) + 0.5).toFixed(10) * 0.3 + 0.05, this.colors[1],
      );
      gradient.addColorStop(
        Math.abs(0.5 * Math.sin(ts * 2) + 0.5).toFixed(10) * 0.2 + 0.35, this.colors[2],
      );
      gradient.addColorStop(
        Math.abs(0.5 * Math.sin(ts * 2) + 0.5).toFixed(10) * 0.25 + 0.55, this.colors[3],
      );
      gradient.addColorStop(
        Math.abs(0.5 * Math.sin(ts * 2) + 0.5).toFixed(10) * 0.1 + 0.8, this.colors[4],
      );
    }

    this.myCanvas.ctx.save();

    this.myCanvas.ctx.translate(
      0.5 * this.myCanvas.canvas.width,
      0.6 * this.myCanvas.canvas.height,
    );

    this.myCanvas.ctx.font = `${1024 * devicePixelRatio}px Suez One`;
    this.myCanvas.ctx.textBaseline = 'middle';
    this.myCanvas.ctx.textAlign = 'center';
    this.myCanvas.ctx.fillStyle = gradient;
    this.myCanvas.ctx.lineWidth = 25;
    this.myCanvas.ctx.lineCap = 'round';
    this.myCanvas.ctx.fillText('T', 0, 0);

    this.myCanvas.ctx.restore();

    if (ts > 4) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day20 = new Day20();

day20.init();
