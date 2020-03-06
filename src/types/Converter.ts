export type Converter = (input: Buffer, dstPath: string) => Promise<void>;
