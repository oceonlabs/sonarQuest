import { GeneratorResult, ParseAstOptions } from '@tanstack/router-utils';
import * as babel from '@babel/core';
import * as t from '@babel/types';
export type CompileStartFrameworkOptions = 'react' | 'solid';
export declare function compileStartOutputFactory(framework: CompileStartFrameworkOptions): (opts: CompileOptions) => GeneratorResult;
export type CompileOptions = ParseAstOptions & {
    env: 'server' | 'client';
    dce?: boolean;
    filename: string;
};
export type IdentifierConfig = {
    name: string;
    handleCallExpression: (path: babel.NodePath<t.CallExpression>, opts: CompileOptions) => void;
    paths: Array<babel.NodePath>;
};
