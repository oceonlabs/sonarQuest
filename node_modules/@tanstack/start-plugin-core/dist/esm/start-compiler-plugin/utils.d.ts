import type * as t from '@babel/types';
import type * as babel from '@babel/core';
export declare function getRootCallExpression(path: babel.NodePath<t.CallExpression>): babel.NodePath<t.CallExpression>;
export declare function codeFrameError(code: string, loc: {
    start: {
        line: number;
        column: number;
    };
    end: {
        line: number;
        column: number;
    };
}, message: string): Error;
