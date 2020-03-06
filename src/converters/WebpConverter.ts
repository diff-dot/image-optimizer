import imageminWebp from 'imagemin-webp';
import fs from 'fs';

const WebpConverter = (options: { quality: number }) => (input: Buffer, dstPath: string): Promise<void> => {
  const { quality } = options;

  return new Promise((resolve, reject) => {
    imageminWebp({ quality, method: 4 })(input)
      .then(res => {
        fs.writeFile(dstPath, res, err => {
          if (err) reject(err);
          resolve();
        });
      })
      .catch(e => {
        reject(e);
      });
  });
};
export default WebpConverter;
