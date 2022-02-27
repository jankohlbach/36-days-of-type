const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;

const canvas = document.createElement('canvas');

canvas.width = CANVAS_WIDTH * devicePixelRatio;
canvas.height = CANVAS_HEIGHT * devicePixelRatio;

canvas.style.width = `${CANVAS_WIDTH}px`;
canvas.style.height = `${CANVAS_HEIGHT}px`;

document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.font = '400px Suez One';

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
};

init();
