import jpegTran from 'jpegtran-bin';
import execa from 'execa';
import imageminGuetzli from 'imagemin-guetzli';

const GuetzliConvert = (options: { quality: number }) => (input: Buffer, dstPath: string): Promise<void> => {
  const { quality } = options;
  return new Promise((resolve, reject) => {
    imageminGuetzli({ quality })(input)
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
export default GuetzliConvert;
