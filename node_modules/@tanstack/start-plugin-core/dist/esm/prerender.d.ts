import { Rollup, ViteBuilder } from 'vite';
import { TanStackStartOutputConfig } from './schema.js';
export declare function prerender({ startConfig, builder, serverBundle, }: {
    startConfig: TanStackStartOutputConfig;
    builder: ViteBuilder;
    serverBundle: Rollup.OutputBundle;
}): Promise<void>;
export declare function writeBundleToDisk({ bundle, outDir, }: {
    bundle: Rollup.OutputBundle;
    outDir: string;
}): Promise<void>;
