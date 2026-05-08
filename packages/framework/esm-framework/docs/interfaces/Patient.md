[O3 Framework](../API.md) / Patient

# Interface: Patient

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:15](https://github.com/egen/egen-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L15)

Superclass for all Egen Resources, with strict typings.
If the subclass does not have all attributes (including optional ones)
accounted for, use EgenResource instead.

## Extends

- [`EgenResourceStrict`](EgenResourceStrict.md)

## Properties

### auditInfo?

> `optional` **auditInfo**: `AuditInfo`

Defined in: packages/framework/esm-api/dist/types/egen-resource.d.ts:14

#### Inherited from

[`EgenResourceStrict`](EgenResourceStrict.md).[`auditInfo`](EgenResourceStrict.md#auditinfo)

***

### display?

> `optional` **display**: `string`

Defined in: packages/framework/esm-api/dist/types/egen-resource.d.ts:12

#### Inherited from

[`EgenResourceStrict`](EgenResourceStrict.md).[`display`](EgenResourceStrict.md#display)

***

### identifiers?

> `optional` **identifiers**: [`PatientIdentifier`](PatientIdentifier.md)[]

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:16](https://github.com/egen/egen-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L16)

***

### links?

> `optional` **links**: `Link`[]

Defined in: packages/framework/esm-api/dist/types/egen-resource.d.ts:13

#### Inherited from

[`EgenResourceStrict`](EgenResourceStrict.md).[`links`](EgenResourceStrict.md#links)

***

### person?

> `optional` **person**: `Person`

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:17](https://github.com/egen/egen-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L17)

***

### resourceVersion?

> `optional` **resourceVersion**: `string`

Defined in: packages/framework/esm-api/dist/types/egen-resource.d.ts:15

#### Inherited from

[`EgenResourceStrict`](EgenResourceStrict.md).[`resourceVersion`](EgenResourceStrict.md#resourceversion)

***

### uuid

> **uuid**: `string`

Defined in: packages/framework/esm-api/dist/types/egen-resource.d.ts:11

#### Inherited from

[`EgenResourceStrict`](EgenResourceStrict.md).[`uuid`](EgenResourceStrict.md#uuid)

***

### voided?

> `optional` **voided**: `boolean`

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:18](https://github.com/egen/egen-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L18)
