import { Validator } from "jsonschema";
import labelFieldsSchema from "./schema/2021-03-01/fields.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isLabelFieldWithCorrectFormat = (jsonFileToValidate:any) => {
    const validator = new Validator();
    return validator.validate(jsonFileToValidate, labelFieldsSchema).valid;
};
