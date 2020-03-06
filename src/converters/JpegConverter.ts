import jpegTran from 'jpegtran-bin';
import execa from 'execa';
import sharp from 'sharp';

const JpegConverter = (options: { quality: number }) => (input: Buffer, dstPath: string): Promise<void> => {
  const { quality } = options;
  return new Promise((resolve, reject) => {
    sharp(input)
      .toFormat('jpeg', { quality })
      .toBuffer()
      .then(buffer => {
        const args = ['-copy', 'none', '-progressive', '-outfile', dstPath];
        execa(jpegTran, args, { input: buffer, encoding: null, maxBuffer: Infinity })
          .then(() => {
            resolve();
          })
          .catch(e => {
            reject(e);
          });
      })
      .catch(e => {
        reject(e);
      });
  });
};
export default JpegConverter;
