import { type Concept, type EigenResource } from '@egen/esm-api';
import { type Drug } from './drug-resource';

export type FulfillerStatus =
  | 'COMPLETED'
  | 'DECLINED'
  | 'DISCONTINUED'
  | 'DRAFT'
  | 'EXCEPTION'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'RECEIVED';

export type OrderAction = 'DISCONTINUE' | 'NEW' | 'RENEW' | 'REVISE';

export type OrderUrgency = 'ON_SCHEDULED_DATE' | 'ROUTINE' | 'STAT';

export interface Order extends EigenResource {
  uuid: string;
  action: OrderAction;
  asNeeded: boolean;
  asNeededCondition?: string;
  autoExpireDate: string;
  brandName?: string;
  careSetting: EigenResource;
  commentToFulfiller: string;
  concept: Concept;
  dateActivated: string;
  dateStopped?: string | null;
  dispenseAsWritten: boolean;
  dose: number;
  doseUnits: EigenResource;
  dosingInstructions: string | null;
  dosingType?: 'org.eigen.FreeTextDosingInstructions' | 'org.eigen.SimpleDosingInstructions';
  drug: Drug;
  duration: number;
  durationUnits: EigenResource;
  encounter: EigenResource;
  frequency: EigenResource;
  instructions?: string | null;
  numRefills: number;
  orderNumber: string;
  orderReason: Concept | null;
  orderReasonNonCoded: string | null;
  orderType: {
    conceptClasses: Array<any>;
    description: string;
    display: string;
    name: string;
    parent: string | null;
    retired: boolean;
    uuid: string;
  };
  orderer: {
    display: string;
    person: {
      display: string;
    };
    uuid: string;
  };
  patient: EigenResource;
  previousOrder: { uuid: string; type: string; display: string } | null;
  quantity: number;
  quantityUnits: EigenResource;
  route: EigenResource;
  urgency: OrderUrgency;

  // additional properties
  accessionNumber: string;
  scheduledDate: string;
  display: string;
  fulfillerStatus: FulfillerStatus;
  fulfillerComment: string;
  specimenSource: Concept | null;
  laterality: string;
  clinicalHistory: string;
  numberOfRepeats: number;
  type: string;
}
