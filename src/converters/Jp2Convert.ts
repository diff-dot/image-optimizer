import imageminWebp from 'imagemin-webp';
import fs from 'fs';
import sharp from 'sharp';
import gm from 'gm';

const Jp2Convert = (options: { quality: number }) => (input: Buffer, dstPath: string): Promise<void> => {
  const { quality } = options;

  return new Promise((resolve, reject) => {
    gm(input)
      .quality(quality)
      .write(dstPath, err => {
        if (err) reject(err);
        else resolve();
      });
  });
};
export default Jp2Convert;
