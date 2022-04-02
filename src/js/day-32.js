import LetterMap from './create-letter-map';
import Canvas from './create-canvas';
import Recorder from './create-recorder';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

class Day32 {
  async init() {
    ['startRecording', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: '5',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      isNumber: true,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.offset = 0;

    this.lineDash = 2048;

    // this.startRecording();

    this.render();
  }

  startRecording() {
    this.stream = this.myCanvas.canvas.captureStream(25);
    this.recorder = new Recorder({ stream: this.stream, fileName: 'day-32' });
    this.recorder.start();
  }

  render() {
    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    const gradient = this.myCanvas.ctx.createLinearGradient(
      this.myCanvas.canvas.width / 2,
      -0.3 * this.myCanvas.canvas.height,
      this.myCanvas.canvas.width / 2,
      0.3 * this.myCanvas.canvas.height,
    );

    gradient.addColorStop(0, '#fcaa67');
    gradient.addColorStop(0.2, '#fcaa67');
    gradient.addColorStop(0.2, '#b0413e');
    gradient.addColorStop(0.4, '#b0413e');
    gradient.addColorStop(0.4, '#ffffc7');
    gradient.addColorStop(0.6, '#ffffc7');
    gradient.addColorStop(0.6, '#548687');
    gradient.addColorStop(0.8, '#548687');
    gradient.addColorStop(0.8, '#473335');
    gradient.addColorStop(1, '#473335');

    this.myCanvas.ctx.save();

    this.myCanvas.ctx.translate(
      0.5 * this.myCanvas.canvas.width,
      0.46 * this.myCanvas.canvas.height,
    );

    this.offset += 2 * (2048 / this.lineDash);

    this.lineDash -= 3;

    this.myCanvas.ctx.setLineDash([0, this.lineDash]);
    this.myCanvas.ctx.lineDashOffset = -this.offset;

    this.myCanvas.ctx.font = `${1024 * devicePixelRatio}px Suez One`;
    this.myCanvas.ctx.textBaseline = 'middle';
    this.myCanvas.ctx.textAlign = 'center';
    this.myCanvas.ctx.strokeStyle = gradient;
    this.myCanvas.ctx.lineWidth = 25;
    this.myCanvas.ctx.lineCap = 'round';
    this.myCanvas.ctx.strokeText('5', 0, 0);

    this.myCanvas.ctx.restore();

    if (this.lineDash < 1) {
      window.cancelAnimationFrame(this.render);
      this.recorder?.stop();
    } else {
      window.requestAnimationFrame(this.render);
    }
  }
}

const day32 = new Day32();

day32.init();
