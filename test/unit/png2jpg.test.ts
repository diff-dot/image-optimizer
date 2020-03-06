import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { promisify } from 'util';

// let tmpDstFolder: string;
describe('optimizer', async () => {
  it('png2jpg.test', async () => {
    const srcPath = path.resolve(__dirname, 'sample-images/src/sample.png');
    const source = await promisify(fs.readFile)(srcPath);
    sharp(source)
      .toFormat('jpeg', { quality: 100 })
      .toBuffer()
      .then(res => {
        console.log(res);
        // expect(1).to.be.eq(1);
      })
      .catch(e => {
        //
      });
  });

  // after(() => {
  //   if (tmpDstFolder) rimraf.sync(tmpDstFolder);
  // });
});
