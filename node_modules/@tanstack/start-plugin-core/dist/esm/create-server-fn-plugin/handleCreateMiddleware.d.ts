import * as t from '@babel/types';
import type * as babel from '@babel/core';
export declare function handleCreateMiddleware(path: babel.NodePath<t.CallExpression>, opts: {
    env: 'client' | 'server';
}): void;
