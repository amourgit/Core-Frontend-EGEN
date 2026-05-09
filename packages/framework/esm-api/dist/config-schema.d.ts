import { type ConfigSchema } from '@egen/esm-config';
export declare const defaultRedirectAuthFailureUrl = "${egenSpaBase}/login";
export declare const configSchema: ConfigSchema;
export interface EsmApiConfigObject {
    redirectAuthFailure: {
        enabled: boolean;
        url: string;
        errors: number[];
        resolvePromise: boolean;
    };
    followRedirects: boolean;
}
//# sourceMappingURL=config-schema.d.ts.map