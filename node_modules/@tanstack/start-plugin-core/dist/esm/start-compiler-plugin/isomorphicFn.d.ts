import { CompileOptions } from './compilers.js';
import * as t from '@babel/types';
import type * as babel from '@babel/core';
export declare function handleCreateIsomorphicFnCallExpression(path: babel.NodePath<t.CallExpression>, opts: CompileOptions): void;
