/** @category Pictograms */
import React from 'react';
import { type Argument } from 'classnames';
/** Array of all available EGEN pictogram IDs that can be used with the Pictogram component. */
export declare const pictogramIds: readonly ["omrs-pict-appointments", "omrs-pict-assessment-1", "omrs-pict-assessment-2", "omrs-pict-blood-bank", "omrs-pict-cardiology", "omrs-pict-ct-scan", "omrs-pict-dentistry", "omrs-pict-emergency-department", "omrs-pict-facility", "omrs-pict-geriatrics", "omrs-pict-gynaecology", "omrs-pict-in-patient", "omrs-pict-laboratory", "omrs-pict-labs-2", "omrs-pict-obstetrics", "omrs-pict-patient-search", "omrs-pict-patients", "omrs-pict-payments-desk", "omrs-pict-pharmacy", "omrs-pict-pharmacy-2", "omrs-pict-registration", "omrs-pict-service-queues", "omrs-pict-stock-management", "omrs-pict-transfer", "omrs-pict-triage", "omrs-pict-x-ray"];
export type PictogramId = (typeof pictogramIds)[number];
export type PictogramProps = {
    className?: Argument;
    size?: number;
};
export declare const AppointmentsPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
/**
 * @deprecated use AppointmentsPictogram instead
 */
export declare const AppointmentsAltPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const Assessment1Pictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const Assessment2Pictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const BloodBankPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const CardiologyPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const CtScanPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const DentistryPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const EmergencyDepartmentPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const FacilityPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const GeriatricsPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const GynaecologyPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const InPatientPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const LaboratoryPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const Labs2Pictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const ObstetricsPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const PatientSearchPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const PatientsPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const PaymentsDeskPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const PharmacyPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const Pharmacy2Pictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const RegistrationPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const ServiceQueuesPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const StockManagementPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const TransferPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const TriagePictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const XrayPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const HomePictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
export declare const PatientListsPictogram: React.NamedExoticComponent<PictogramProps & React.RefAttributes<SVGSVGElement>>;
/**
 * This is a utility component that takes an `pictogram` and render it if the sprite for the pictogram
 * is available. The goal is to make it easier to conditionally render configuration-specified pictograms.
 *
 * @example
 * ```tsx
 *   <MaybePictogram pictogram='omrs-icon-baby' className={styles.myPictogramStyles} />
 * ```
 */
export declare const MaybePictogram: React.NamedExoticComponent<{
    pictogram: string;
    fallback?: React.ReactNode;
} & PictogramProps & React.RefAttributes<SVGSVGElement>>;
export type SvgPictogramProps = {
    /** the id of the pictogram  */
    pictogram: PictogramId;
    /** properties when using the pictogram  */
    pictogramProps: PictogramProps;
};
/**
 * This is a utility type for custom pictograms. Please maintain alphabetical order when adding new pictograms for readability.
 */
export declare const Pictogram: React.NamedExoticComponent<SvgPictogramProps & React.RefAttributes<SVGSVGElement>>;
//# sourceMappingURL=pictograms.d.ts.map