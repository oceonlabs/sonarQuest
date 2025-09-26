import { TanStackStartOutputConfig } from './schema.js';
import { Rollup, ViteBuilder } from 'vite';
export declare function postServerBuild({ builder, startConfig, serverBundle, }: {
    builder: ViteBuilder;
    startConfig: TanStackStartOutputConfig;
    serverBundle: Rollup.OutputBundle;
}): Promise<void>;
