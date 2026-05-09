export declare enum Type {
    Array = "Array",
    Boolean = "Boolean",
    ConceptUuid = "ConceptUuid",
    Number = "Number",
    Object = "Object",
    String = "String",
    UUID = "UUID",
    PersonAttributeTypeUuid = "PersonAttributeTypeUuid",
    PatientIdentifierTypeUuid = "PatientIdentifierTypeUuid"
}
export interface ConfigSchema {
    [key: string]: ConfigSchema | ConfigValue;
    _type?: Type;
    _validators?: Array<Validator>;
    _elements?: ConfigSchema;
}
export interface Config {
    [moduleName: string]: {
        [key: string]: any;
    };
}
export interface ConfigObject {
    [key: string]: any;
    /** Options that control when this extension is displayed  */
    'Display conditions'?: DisplayConditionsConfigObject;
    'Translation overrides'?: Record<string, Record<string, string>>;
}
export interface DisplayConditionsConfigObject {
    /** The privileges a user should have to see this extension */
    privileges?: string[];
    /** An expression to evaluate whether or not the user should see this extension */
    expression?: string;
    /** Whether to display this extension when connected to the server */
    online?: boolean;
    /** Whether to display this extension when not connected to the server */
    offline?: boolean;
}
export type ConfigValue = string | number | boolean | void | Array<any> | object;
export interface ExtensionSlotConfig {
    /** Additional extension IDs to assign to this slot, in addition to those `attach`ed in code. */
    add?: Array<string>;
    /** Extension IDs which were `attach`ed to the slot but which should not be assigned. */
    remove?: Array<string>;
    /** Overrides the default ordering of extensions. */
    order?: Array<string>;
    configure?: ExtensionSlotConfigureValueObject;
}
export interface ExtensionSlotConfigureValueObject {
    [key: string]: object;
}
export type ProvidedConfig = {
    source: string;
    config: Config;
};
export type ValidatorFunction = (value: any) => boolean;
export type Validator = (value: any) => void | string;
//# sourceMappingURL=types.d.ts.map