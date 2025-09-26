import * as t from '@babel/types';
import type * as babel from '@babel/core';
export declare function handleCreateServerFn(path: babel.NodePath<t.CallExpression>, opts: {
    env: 'client' | 'server';
    code: string;
}): void;
