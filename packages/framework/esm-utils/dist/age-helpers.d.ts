import dayjs from 'dayjs';
/**
 * Gets a human readable and locale supported representation of a person's age, given their birthDate,
 * The representation logic follows the guideline here:
 * https://webarchive.nationalarchives.gov.uk/ukgwa/20160921162509mp_/http://systems.digital.nhs.uk/data/cui/uig/patben.pdf
 * (See Tables 7 and 8)
 *
 * @param birthDate The birthDate. If birthDate is null, returns null.
 * @param currentDate Optional. If provided, calculates the age of the person at the provided currentDate (instead of now).
 * @returns A human-readable string version of the age.
 */
export declare function age(birthDate: dayjs.ConfigType, currentDate?: dayjs.ConfigType): string | null;
//# sourceMappingURL=age-helpers.d.ts.map