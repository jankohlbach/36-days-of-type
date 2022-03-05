import LetterMap from './create-letter-map';
import Canvas from './create-canvas';

const randomInRange = (min, max) => min + Math.random() * (max - min);

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 1024;

class Day1 {
  async init() {
    ['checkIfInLetter', 'checkOverlap', 'checkOutOfBounce', 'createRectangles', 'render'].forEach((fn) => { this[fn] = this[fn].bind(this); });

    this.letterMap = new LetterMap({
      letter: 'A',
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });

    await this.letterMap.init();

    this.letterMapData = this.letterMap.createImageData();

    this.myCanvas = new Canvas({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT });

    this.myCanvas.ctx.strokeStyle = 'black';
    this.myCanvas.ctx.lineWidth = 1;

    this.rectangles = [];

    this.spacing = 2;

    this.createRectangles();

    this.render();
  }

  checkIfInLetter(x, y) {
    const pos = (Math.round(y) * this.letterMapData.width + Math.round(x)) * 4;
    const v = this.letterMapData.data[pos];
    return v > 128;
  }

  checkOverlap(rectangle) {
    // eslint-disable-next-line no-restricted-syntax
    for (const currentRectangle of this.rectangles) {
      if (rectangle.index !== currentRectangle.index) {
        const rectangleRightFromCurrentRectangle = rectangle.x
          > currentRectangle.x + currentRectangle.width + this.spacing;
        const rectangleLeftFromCurrentRectangle = rectangle.x + rectangle.width + this.spacing
          < currentRectangle.x;
        const rectangleAboveCurrentRectangle = rectangle.y + rectangle.height + this.spacing
          < currentRectangle.y;
        const rectangleUnderCurrentRectangle = rectangle.y
          > currentRectangle.y + currentRectangle.height + this.spacing;

        if (!(
          rectangleRightFromCurrentRectangle
          || rectangleLeftFromCurrentRectangle
          || rectangleAboveCurrentRectangle
          || rectangleUnderCurrentRectangle
        )) {
          return true;
        }
      }
    }

    return false;
  }

  checkOutOfBounce(rectangle) {
    const rectangleLeftInBounds = rectangle.x < this.spacing;
    const rectangleRightInBounds = rectangle.x + rectangle.width
      > this.myCanvas.canvas.width - this.spacing;
    const rectangleUpInBounds = rectangle.y < this.spacing;
    const rectangleDownInBounds = rectangle.y + rectangle.height
      > this.myCanvas.canvas.height - this.spacing;

    if (
      rectangleLeftInBounds
      || rectangleRightInBounds
      || rectangleUpInBounds
      || rectangleDownInBounds
    ) {
      return true;
    }

    return false;
  }

  createRectangles() {
    for (let i = 0; i < 2000; i += 1) {
      const width = 3;
      const height = 3;
      const aspectRatioRange = 0.4;
      const colors = [
        '#ffff82',
        '#f5f7dc',
        '#b5d99c',
        '#0f0326',
        '#e65f5c',
      ];

      let rectangle;
      let overlaps;
      let inLetter;

      do {
        const aspectRatio = randomInRange(1 - aspectRatioRange, 1 + aspectRatioRange);

        rectangle = {
          x: randomInRange(0, this.myCanvas.canvas.width - width - this.spacing),
          y: randomInRange(0, this.myCanvas.canvas.height - height - this.spacing),
          width,
          height: height * aspectRatio,
          aspectRatio,
          freeze: false,
          index: i,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        inLetter = this.checkIfInLetter(rectangle.x, rectangle.y);
        overlaps = this.checkOverlap(rectangle);
      } while (overlaps || !inLetter);

      this.rectangles.push(rectangle);

      this.myCanvas.ctx.fillStyle = rectangle.color;
      this.myCanvas.ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    }
  }

  render() {
    this.myCanvas.ctx.clearRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.myCanvas.ctx.fillStyle = 'white';
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.canvas.width, this.myCanvas.canvas.height);

    this.rectangles.forEach((rectangle) => {
      if (!rectangle.freeze) {
        rectangle.x -= 0.05;
        rectangle.y -= 0.05;
        rectangle.width += 0.1;
        rectangle.height += 0.1 * rectangle.aspectRatio;
      }

      if (this.checkOverlap(rectangle) || this.checkOutOfBounce(rectangle)) {
        rectangle.freeze = true;
      }

      this.myCanvas.ctx.fillStyle = rectangle.color;
      this.myCanvas.ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    });

    window.requestAnimationFrame(this.render);
  }
}

const day1 = new Day1();

day1.init();
