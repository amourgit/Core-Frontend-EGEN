[O3 Framework](../API.md) / PatientIdentifier

# Interface: PatientIdentifier

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:21](https://github.com/egen/egen-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L21)

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

### identifier?

> `optional` **identifier**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:22](https://github.com/egen/egen-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L22)

***

### identifierType?

> `optional` **identifierType**: [`PatientIdentifierType`](PatientIdentifierType.md)

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:23](https://github.com/egen/egen-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L23)

***

### links?

> `optional` **links**: `Link`[]

Defined in: packages/framework/esm-api/dist/types/egen-resource.d.ts:13

#### Inherited from

[`EgenResourceStrict`](EgenResourceStrict.md).[`links`](EgenResourceStrict.md#links)

***

### location?

> `optional` **location**: `Location`

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:24](https://github.com/egen/egen-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L24)

***

### preferred?

> `optional` **preferred**: `boolean`

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:25](https://github.com/egen/egen-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L25)

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

Defined in: [packages/framework/esm-emr-api/src/types/patient-resource.ts:26](https://github.com/egen/egen-esm-core/blob/main/packages/framework/esm-emr-api/src/types/patient-resource.ts#L26)
