import pngquant from 'pngquant-bin';
import execa from 'execa';

const PngConverter = (options: { qualityMin: number; qualityMax: number }) => (input: Buffer, dstPath: string): Promise<void> => {
  const { qualityMin, qualityMax } = options;

  return new Promise((resolve, reject) => {
    const args = ['-', '--quality', `${qualityMin}-${qualityMax}`, '-f', '-o', dstPath];
    execa(pngquant, args, { input, encoding: null, maxBuffer: Infinity })
      .then(() => {
        resolve();
      })
      .catch(e => {
        console.error(e);
        reject(e);
      });
  });
};
export default PngConverter;
