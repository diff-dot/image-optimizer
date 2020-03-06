import { Plugin } from 'imagemin';

declare function imageminGuetzli(options?: { quality: number }): Plugin;
export = imageminGuetzli;
