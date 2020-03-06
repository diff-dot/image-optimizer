import pngquant from 'pngquant-bin';
import execa from 'execa';
import sharp from 'sharp';

const PngConverter = (options: { qualityMin: number; qualityMax: number }) => (input: Buffer, dstPath: string): Promise<void> => {
  const { qualityMin, qualityMax } = options;

  return new Promise((resolve, reject) => {
    sharp(input)
      .toFormat('png', { quality: qualityMax })
      .toBuffer()
      .then(buffer => {
        const args = ['-', '--quality', `${qualityMin}-${qualityMax}`, '-f', '-o', dstPath];
        execa(pngquant, args, { input: buffer, encoding: null, maxBuffer: Infinity })
          .then(() => {
            resolve();
          })
          .catch(e => {
            console.error(e);
            reject(e);
          });
      })
      .catch(e => {
        reject(e);
      });
  });
};
export default PngConverter;
