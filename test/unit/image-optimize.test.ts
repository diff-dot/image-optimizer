import { expect } from 'chai';
import { ImageOptimizer } from '../../src/ImageOptimizer';
import path from 'path';
import { ResizeOptions } from 'sharp';
import { promisify } from 'util';
import fs from 'fs';
import rimraf from 'rimraf';

let tmpDstFolder: string;
describe('optimizer', async () => {
  it('Optimize to multiple sizes and formats', async () => {
    const sizes: ResizeOptions[] = [{ width: 100, height: 100 }];
    const optimizer = new ImageOptimizer({
      srcPath: path.resolve(__dirname, 'sample-images/src/1.jpg'),
      outputFormats: ['png', 'jpeg', 'webp', 'jp2'],
      dstSizes: sizes
    });
    const res = await optimizer.save();
    tmpDstFolder = res.folder;
    expect(res.files.length).to.be.eq(9);
  });

  it('save to specified folder.', async () => {
    const sizes: ResizeOptions[] = [{ width: 100, height: 100 }];
    const optimizer = new ImageOptimizer({
      srcPath: path.resolve(__dirname, 'sample-images/src/1.jpg'),
      outputFormats: ['png', 'jpeg', 'webp', 'jp2'],
      dstSizes: sizes
    });

    const dstFolder = path.resolve(__dirname, 'sample-images/dst');
    const res = await optimizer.save(path.resolve(__dirname, 'sample-images/dst'));

    expect(await promisify(fs.exists)(path.resolve(dstFolder, res.files[0]))).to.be.true;
  });

  after(() => {
    if (tmpDstFolder) rimraf.sync(tmpDstFolder);
  });
});
