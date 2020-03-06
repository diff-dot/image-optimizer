import { ResizeOptions } from 'sharp';

export interface Size extends ResizeOptions {
  width: number;
  height: number;
}
