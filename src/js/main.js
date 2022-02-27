const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 1024;

const canvas = document.createElement('canvas');

canvas.width = CANVAS_WIDTH * devicePixelRatio;
canvas.height = CANVAS_HEIGHT * devicePixelRatio;

canvas.style.width = `${CANVAS_WIDTH}px`;
canvas.style.height = `${CANVAS_HEIGHT}px`;

document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.font = '50vw Suez One';

const tmpFont = new FontFace(
  'Suez One',
  'url(https://fonts.gstatic.com/s/suezone/v8/taiJGmd_EZ6rqscQgOFOmos.woff2)',
);

const generateLetter = () => {
  ctx.save();
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.translate(0.5 * canvas.width, 0.5 * canvas.height);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
  ctx.fillText('A', 0, 0);
  ctx.restore();
};

const init = async () => {
  const font = await tmpFont.load();
  document.fonts.add(font);
  generateLetter();

  const letterData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const randomInRange = (min, max) => min + Math.random() * (max - min);

  document.body.appendChild(canvas);

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;

  const rectangles = [];

  const spacing = 2;

  const checkIfInLetter = (x, y) => {
    const pos = (Math.round(y) * letterData.width + Math.round(x)) * 4;
    const v = letterData.data[pos];
    return v > 128;
  };

  const checkOverlap = (rectangle) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const currentRectangle of rectangles) {
      if (rectangle.index !== currentRectangle.index) {
        const rectangleRightFromCurrentRectangle = rectangle.x
          > currentRectangle.x + currentRectangle.width + spacing;
        const rectangleLeftFromCurrentRectangle = rectangle.x + rectangle.width + spacing
          < currentRectangle.x;
        const rectangleAboveCurrentRectangle = rectangle.y + rectangle.height + spacing
          < currentRectangle.y;
        const rectangleUnderCurrentRectangle = rectangle.y
          > currentRectangle.y + currentRectangle.height + spacing;

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
  };

  const checkOutOfBounce = (rectangle) => {
    const rectangleLeftInBounds = rectangle.x < spacing;
    const rectangleRightInBounds = rectangle.x + rectangle.width > canvas.width - spacing;
    const rectangleUpInBounds = rectangle.y < spacing;
    const rectangleDownInBounds = rectangle.y + rectangle.height > canvas.height - spacing;

    if (
      rectangleLeftInBounds
      || rectangleRightInBounds
      || rectangleUpInBounds
      || rectangleDownInBounds
    ) {
      return true;
    }

    return false;
  };

  for (let i = 0; i < 500; i += 1) {
    const width = 10;
    const height = 10;
    const aspectRatioRange = 0.4;

    let rectangle;
    let overlaps;
    let inLetter;

    do {
      const aspectRatio = randomInRange(1 - aspectRatioRange, 1 + aspectRatioRange);

      rectangle = {
        x: randomInRange(0, canvas.width - width - spacing),
        y: randomInRange(0, canvas.height - height - spacing),
        width,
        height: height * aspectRatio,
        aspectRatio,
        freeze: false,
        index: i,
      };
      inLetter = checkIfInLetter(rectangle.x, rectangle.y);
      overlaps = checkOverlap(rectangle);
    } while (overlaps || !inLetter);

    rectangles.push(rectangle);

    ctx.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  }

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rectangles.forEach((rectangle) => {
      if (!rectangle.freeze) {
        rectangle.x -= 0.2;
        rectangle.y -= 0.2;
        rectangle.width += 0.4;
        rectangle.height += 0.4 * rectangle.aspectRatio;
      }

      if (checkOverlap(rectangle) || checkOutOfBounce(rectangle)) {
        rectangle.freeze = true;
      }

      ctx.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    });

    window.requestAnimationFrame(render);
  };

  render();
};

init();
