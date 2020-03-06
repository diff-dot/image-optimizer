import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import sharp, { ResizeOptions } from 'sharp';
import PngConverter from './converters/PngConverter';
import JpegConverter from './converters/JpegConverter';
import WebpConverter from './converters/WebpConverter';
import ImageUtils from './utils/ImageUtils';
import Jp2Convert from './converters/Jp2Convert';
import GuetzliConvert from './converters/GuetzliConvert';
import tmp from 'tmp-promise';
import { SupportFormats, SupportFormat } from './types/SupportFormats';
import { FormatInfo } from './types/FormatInfo';

const TMP_PATH_PREFIX = 'optmz-';

export class ImageOptimizer {
  private static supportFormats: SupportFormats = {
    jpeg: { converter: JpegConverter({ quality: 84 }), ext: 'jpg' },
    guetzliJpeg: { converter: GuetzliConvert({ quality: 84 }), ext: 'jpg' },
    png: { converter: PngConverter({ qualityMin: 65, qualityMax: 75 }), ext: 'png' },
    webp: { converter: WebpConverter({ quality: 75 }), ext: 'webp' },
    jp2: { converter: Jp2Convert({ quality: 75 }), ext: 'jp2' }
  };
  private readonly srcPath: string;
  private readonly dstFormats: FormatInfo[];
  private readonly dstSizes: ResizeOptions[];

  constructor(args: { srcPath: string; outputFormats: SupportFormat[]; outputSizes: ResizeOptions[] }) {
    const { srcPath, outputFormats, outputSizes = [] } = args;
    this.srcPath = srcPath;
    this.dstFormats = [];
    for (const format of outputFormats) {
      this.dstFormats.push(ImageOptimizer.supportFormats[format]);
    }
    this.dstSizes = outputSizes;
  }

  async save(dstFolder?: string): Promise<{ folder: string; files: string[] }> {
    let source = await promisify(fs.readFile)(this.srcPath);
    const files: string[] = [];

    // 소ㅔ파일 포멧 확인
    if (!ImageUtils.isJpeg(source)) {
      source = await this.toLossLessJpeg(source);
    }

    if (dstFolder) {
      if (!(await promisify(fs.exists)(dstFolder))) {
        await promisify(fs.mkdir)(dstFolder);
      }
    } else {
      dstFolder = (await tmp.dir({ prefix: TMP_PATH_PREFIX })).path;
    }

    // origin
    const orgFilename = 'org.jpg';
    const orgDstpath = path.resolve(dstFolder, orgFilename);
    await promisify(fs.writeFile)(orgDstpath, source);
    files.push(orgFilename);

    // default
    for (const formatInfo of this.dstFormats) {
      const filename = 'default.' + formatInfo.ext;
      const dstPath = path.resolve(dstFolder, filename);
      await formatInfo.converter(source, dstPath);
      files.push(filename);
    }

    // by size
    if (this.dstSizes.length) {
      for (const size of this.dstSizes) {
        const resizedSource = await this.resize(source, size);
        for (const formatInfo of this.dstFormats) {
          const filename = `${size.width}x${size.height}.` + formatInfo.ext;
          const dstPath = path.resolve(dstFolder, filename);
          await formatInfo.converter(resizedSource, dstPath);
          files.push(filename);
        }
      }
    }

    return {
      folder: dstFolder,
      files
    };
  }

  private async toLossLessJpeg(src: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      sharp(src)
        .toFormat('jpeg', { quality: 100 })
        .toBuffer()
        .then(res => {
          resolve(res);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  private async resize(src: Buffer, size: ResizeOptions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      sharp(src)
        .resize(size)
        .toBuffer()
        .then(res => {
          resolve(res);
        })
        .catch(e => {
          reject(e);
        });
    });
  }
}
