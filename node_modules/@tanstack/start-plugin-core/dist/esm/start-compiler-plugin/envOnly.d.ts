import { CompileOptions } from './compilers.js';
import * as t from '@babel/types';
import type * as babel from '@babel/core';
export declare const handleCreateServerOnlyFnCallExpression: (path: babel.NodePath<t.CallExpression>, opts: CompileOptions) => void;
export declare const handleCreateClientOnlyFnCallExpression: (path: babel.NodePath<t.CallExpression>, opts: CompileOptions) => void;
