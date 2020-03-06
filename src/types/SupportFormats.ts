import { FormatInfo } from './FormatInfo';

export interface SupportFormats {
  jpeg: FormatInfo;
  png: FormatInfo;
  webp: FormatInfo;
  jp2: FormatInfo;
  guetzliJpeg: FormatInfo;
}

export type SupportFormat = keyof SupportFormats;
