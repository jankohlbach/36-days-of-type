export const randomInRange = (min, max) => min + Math.random() * (max - min);

export const lerp = (a, b, n) => (1 - n) * a + n * b;

export const checkIfInLetter = (letterMapData, x, y) => {
  const pos = (Math.round(y) * letterMapData.width + Math.round(x)) * 4;
  const v = letterMapData.data[pos];
  return v > 128;
};

export const checkRectOverlap = (object, allObjects, spacing) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const currentObject of allObjects) {
    if (object.index !== currentObject.index) {
      if (
        object.x + object.width + spacing > currentObject.x
        && object.x < currentObject.x + currentObject.width + spacing
        && object.y + object.height + spacing > currentObject.y
        && object.y < currentObject.y + currentObject.height + spacing
      ) {
        return true;
      }
    }
  }

  return false;
};

export const checkCircleOverlap = (object, allObjects, spacing) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const currentObject of allObjects) {
    if (object.index !== currentObject.index) {
      const dx = object.x - currentObject.x;
      const dy = object.y - currentObject.y;
      const dr = object.radius + currentObject.radius;

      if (dx * dx + dy * dy < dr * dr + 2 * spacing * 10) {
        return true;
      }
    }
  }

  return false;
};

export const checkOutOfBounds = (object, canvas, spacing) => {
  const objectLeftOutOfBounds = object.x < spacing;
  const objectRightOutOfBounds = object.x + object.width > canvas.width - spacing;
  const objectUpOutOfBounds = object.y < spacing;
  const objectDownOutOfBounds = object.y + object.height > canvas.height - spacing;

  if (
    objectLeftOutOfBounds
    || objectRightOutOfBounds
    || objectUpOutOfBounds
    || objectDownOutOfBounds
  ) {
    return true;
  }

  return false;
};

export const drawLetter = (myCanvas, letter, isNumber = false) => {
  myCanvas.ctx.font = `${1024 * devicePixelRatio}px Suez One`;
  myCanvas.ctx.translate(
    0.5 * myCanvas.canvas.width,
    (isNumber ? 0.52 : 0.6) * myCanvas.canvas.height,
  );
  myCanvas.ctx.textBaseline = 'middle';
  myCanvas.ctx.textAlign = 'center';
  myCanvas.ctx.fillStyle = 'white';
  myCanvas.ctx.fillText(letter, 0, 0);
  myCanvas.ctx.translate(
    -0.5 * myCanvas.canvas.width,
    (isNumber ? -0.52 : -0.6) * myCanvas.canvas.height,
  );
};
