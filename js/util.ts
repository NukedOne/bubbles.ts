import * as _ from 'lodash';
import { PLAYGROUND_WIDTH, PLAYGROUND_HEIGHT, SCALE, Color, Direction } from "./index";

export class Vec2D {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public toXY(): [number, number] {
    return [this.x, this.y];
  }

  public add(vector: Vec2D): Vec2D {
    return new Vec2D(this.x + vector.x, this.y + vector.y);
  }

  public sub(vector: Vec2D): Vec2D {
    return new Vec2D(this.x - vector.x, this.y - vector.y);
  }

  public scalarMul(scalar: number): Vec2D {
    return new Vec2D(this.x * scalar, this.y * scalar);
  }

  public scalarDiv(scalar: number): Vec2D {
    return new Vec2D(this.x / scalar, this.y / scalar);
  }

  public length(): number {
    return Math.hypot(this.x, this.y);
  }
}

export type BubbleGrid = {
  [key: string]: Color | null;
};

export function createBubbleGrid(): BubbleGrid {
  const bubbleGrid: BubbleGrid = {};

  for (let row = 0; row < PLAYGROUND_HEIGHT; row++) {
    for (let col = 0; col < PLAYGROUND_WIDTH; col++) {
      const offset = row % 2 !== 0 ? 0.5 : 0;
      const index = coords2Key(
        new Vec2D(
          col + offset - PLAYGROUND_WIDTH / 2,
          -row + PLAYGROUND_HEIGHT
        )
      );
      
      bubbleGrid[index] = row < 5 ? pickRandomColor() : null;
    }
  }
  return bubbleGrid;
}

export function math2Canvas(vector: Vec2D): Vec2D {
  return new Vec2D(
    (2 * SCALE) * (vector.x + (PLAYGROUND_WIDTH / 2)),
    (2 * SCALE) * (-vector.y + PLAYGROUND_HEIGHT),
  );
}

export function canvas2Math(vector: Vec2D): Vec2D {
  const convertedCoord = new Vec2D(
    vector.x / (2 * SCALE) - PLAYGROUND_WIDTH / 2,
    -vector.y / (2 * SCALE) + PLAYGROUND_HEIGHT,
  );
  return convertedCoord;
}

export function key2Coords(index: string): Vec2D {
  const [x, y] = index.split(' ').map(c => parseFloat(c));
  return new Vec2D(x, y);
}

export function coords2Key(coord: Vec2D): string {
  return `${coord.x} ${coord.y}`;
}

export function rotate(point: Vec2D, direction: Direction): Vec2D {
  let matrix: Matrix;

  switch (direction) {
  case Direction.Left:
    matrix = ROTATION_MATRIX_COUNTERCLOCKWISE;
    break;
  case Direction.Right:
    matrix = ROTATION_MATRIX_CLOCKWISE;
    break;
  }

  return matrixVectorMul(matrix, point);
}

export function pickRandomColor() {
  return _.sample(Object.values(Color)) as Color;
}

type Matrix = number[][];

const ROTATION_MATRIX_COUNTERCLOCKWISE: Matrix = [
  [Math.cos(Math.PI / 360), Math.sin(Math.PI / 360)],
  [-Math.sin(Math.PI / 360), Math.cos(Math.PI / 360)],
];

const ROTATION_MATRIX_CLOCKWISE: Matrix = [
  [Math.cos(Math.PI / 360), -Math.sin(Math.PI / 360)],
  [Math.sin(Math.PI / 360), Math.cos(Math.PI / 360)],
];

function matrixVectorMul(matrix: Matrix, vector: Vec2D): Vec2D {
  const [col1, col2] = matrix;
  const rotatedCol1 = col1.map(coord => coord * vector.x);
  const rotatedCol2 = col2.map(coord => coord * vector.y);

  return new Vec2D(
    rotatedCol1[0] + rotatedCol2[0],
    rotatedCol1[1] + rotatedCol2[1]
  );
}
