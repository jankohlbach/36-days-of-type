import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day18 {
  async init() {
    ['startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'R',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.offset = 0;

    // this.startRecording();

    this.render();
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-18' });
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

    gradient.addColorStop(0, '#f9c80e');
    gradient.addColorStop(0.2, '#f9c80e');
    gradient.addColorStop(0.2, '#f86624');
    gradient.addColorStop(0.4, '#f86624');
    gradient.addColorStop(0.4, '#ea3546');
    gradient.addColorStop(0.6, '#ea3546');
    gradient.addColorStop(0.6, '#662e9b');
    gradient.addColorStop(0.8, '#662e9b');
    gradient.addColorStop(0.8, '#43bccd');
    gradient.addColorStop(1, '#43bccd');

    this.myCanvas.ctx.save();

    this.myCanvas.ctx.translate(
      0.5 * this.myCanvas.canvas.width,
      0.6 * this.myCanvas.canvas.height,
    );

    this.offset += 1;

    this.myCanvas.ctx.setLineDash([20, 50, 50, 40, 40, 30]);
    this.myCanvas.ctx.lineDashOffset = -this.offset;

    this.myCanvas.ctx.font = `${1024 * devicePixelRatio}px Suez One`;
    this.myCanvas.ctx.textBaseline = 'middle';
    this.myCanvas.ctx.textAlign = 'center';
    this.myCanvas.ctx.strokeStyle = gradient;
    this.myCanvas.ctx.lineWidth = 25;
    this.myCanvas.ctx.lineCap = 'round';
    this.myCanvas.ctx.strokeText('R', 0, 0);

    this.myCanvas.ctx.restore();

    if (ts > 6) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day18 = new Day18();

day18.init();
