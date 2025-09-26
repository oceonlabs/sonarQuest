import { PluginOption } from 'vite';
import { TanStackStartInputConfig } from '../schema.js';
import { GetConfigFn, TanStackStartVitePluginCoreOptions } from '../plugin.js';
export declare function tanStackStartRouter(startPluginOpts: TanStackStartInputConfig, getConfig: GetConfigFn, corePluginOpts: TanStackStartVitePluginCoreOptions): Array<PluginOption>;
