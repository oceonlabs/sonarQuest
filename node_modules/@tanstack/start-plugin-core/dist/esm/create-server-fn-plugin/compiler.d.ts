import { parseAst } from '@tanstack/router-utils';
import * as t from '@babel/types';
type Binding = {
    type: 'import';
    source: string;
    importedName: string;
    resolvedKind?: Kind;
} | {
    type: 'var';
    init: t.Expression | null;
    resolvedKind?: Kind;
};
type ExportEntry = {
    tag: 'Normal';
    name: string;
} | {
    tag: 'Default';
    name: string;
} | {
    tag: 'Namespace';
    name: string;
    targetId: string;
};
type Kind = 'None' | `Root` | `Builder` | LookupKind;
export type LookupKind = 'ServerFn' | 'Middleware';
export type LookupConfig = {
    libName: string;
    rootExport: string;
};
interface ModuleInfo {
    id: string;
    code: string;
    ast: ReturnType<typeof parseAst>;
    bindings: Map<string, Binding>;
    exports: Map<string, ExportEntry>;
}
export declare class ServerFnCompiler {
    private options;
    private moduleCache;
    private initialized;
    private validLookupKinds;
    constructor(options: {
        env: 'client' | 'server';
        lookupConfigurations: Array<LookupConfig>;
        lookupKinds: Set<LookupKind>;
        loadModule: (id: string) => Promise<void>;
        resolveId: (id: string, importer?: string) => Promise<string | null>;
    });
    private init;
    ingestModule({ code, id }: {
        code: string;
        id: string;
    }): ModuleInfo;
    invalidateModule(id: string): boolean;
    compile({ code, id }: {
        code: string;
        id: string;
    }): Promise<import('@tanstack/router-utils').GeneratorResult | null>;
    private collectCandidates;
    private resolveIdentifierKind;
    private resolveBindingKind;
    private resolveExprKind;
    private resolveCalleeKind;
    private getModuleInfo;
}
export {};
