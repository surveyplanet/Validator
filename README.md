# Validator

Validate HTML forms.

## Install

```bash
npm install --save @surveyplanet/validator
```

## Example

```js
import Validator from '@surveyplanet/validator'

validator = new Validator(
	[
		{
			name: "full-name",
			rules: ["required", "alpha"],
		},
		{
			name: "password",
			rules: ["required", "minLength[8]"],
		},
		{
			name: "password_confirm",
			label: "password confirmation",
			rules: ["required","matches[password]"],
		},
		{
			name: "zip-code",
			label: "Zip Code",
			rules: "exactLength[5]",
			message: "Hey! your %s has to be at exactly %s characters.",
		}
		{
			name: "agree-checkbox",
			rules: "required",
			message: "You must agree to the terms of service.",
		},
	]
);

validator.showValidationErrors = true;

const errors = validator.validate();

if (errors.length) {
	return alert(errors[0].message)
}

// process form...

```

## Options

| Param          | Type             | Description                                                                           |
| -------------- | ---------------- | ------------------------------------------------------------------------------------- |
| fields         | `Array.<Object>` | A collection of field inputs to validate.                                             |
| fields.name    | `String`         | Then input name (required).                                                           |
| fields.id      | `String`         | The input id.                                                                         |
| fields.label   | `String`         | The input label used to parse error message (if not provided filed name is used).     |
| fields.rules   | `String\|Array`  | A single rule name or a list of rule names to use for validation default: 'required'. |
| fields.value   | `Array`          | Input value (required if input name is not provided).                                 |
| fields.message | `String`         | A custom message for the input use %s to parse input label and param respectively.    |

### Rules

| Name                  | Violation Message                                                                   | Description                                                        |
| --------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `required`            | "The %s field is required."                                                         | Must not be empty.                                                 |
| `matches[String]`     | "The %s field does not match the %s field."                                         | Must match another field value.                                    |
| `url`                 | "The %s field must contain a valid url."                                            | Must be a valid url.                                               |
| `email`               | "The %s field must contain a valid email address."                                  | Must be a valid email address.                                     |
| `emails`              | "The %s field must contain all valid email addresses."                              | Must be a comma separated list of valid email addresses.           |
| `minLength[Number]`   | "The %s field must be at least %s characters in length."                            | Must be at least X characters long.                                |
| `maxLength[Number]`   | "The %s field must not exceed %s characters in length."                             | Must be no longer than X characters.                               |
| `exactLength[Number]` | "The %s field must be exactly %s characters in length."                             | Must be exactly X characters long.                                 |
| `greaterThan[Number]` | "The %s field must contain a number greater than %s."                               | Must be greater than X.                                            |
| `equals[Number]`      | "The %s field must equal %s."                                                       | Must be equal to X.                                                |
| `lessThan[Number]`    | "The %s field must contain a number less than %s."                                  | Must be less than X.                                               |
| `alpha`               | "The %s field must only contain alphabetical characters."                           | Must only contain alphabetical characters (A-z).                   |
| `alphaNumeric`        | "The %s field must only contain alpha-numeric characters."                          | Must only contain alpha-numeric characters (A-z, 0-9).             |
| `alphaDash`           | "The %s field must only contain alpha-numeric characters, underscores, and dashes." | Must only contain alpha-numeric characters, underscores, or dashes |
| `numeric`             | "The %s field must only contain numbers."                                           | Must be a whole number.                                            |
| `integer`             | "%s must be a whole number."                                                        | Must be an integer.                                                |
| `decimal`             | "The %s field must contain a decimal number."                                       | Must be a valid decimal.                                           |
| `ip`                  | "The %s field must contain a valid IP address."                                     | Must be a valid IP address.                                        |
| `base64`              | "The %s field must contain a base64 string."                                        | Must be a base64 string.                                           |
| `cvc`                 | "The %s field must contain a valid CVC."                                            | Must be a valid credit card cvc.                                   |
| `creditCard`          | "The %s field must contain a valid credit card number."                             | Must be a valid credit card number.                                |
| `phone`               | "The %s field must contain a valid phone number."                                   | Must be a valid phone number.                                      |
| `fileType`            | "The %s field must contain only %s files."                                          | Must be a comma separated list of file types (e.g.: gif,png,jpg).  |
| `hasNumber`           | "The %s field must contain at least one number."                                    | Must contain a number.                                             |
| `hasUpper`            | "The %s field must contain at least one upper case letter."                         | Must contain an upper case letter.                                 |
| `hasLower`            | "The %s field must contain at least one lower case letter."                         | Must contain a lower case letter.                                  |
| `custom[Regex]`       | "The %s field is invalid."                                                          | Must match a Regular Expression.                                   |

## Methods

### validate()

Validates the form.
**Returns**: `Array.<Object>` - A list of all validation errors.

### createValidationErrorMessages(error)

Add a validation error messages to the dom.

| Param | Type     | Description                                  |
| ----- | -------- | -------------------------------------------- |
| error | `Object` | A single error object from the errors array. |

### removeAllValidationErrorMessages()

Removes all the validation error messages from the dom.

## Properties

### validator.errors

| Name           | Type             | Description                     |
| -------------- | ---------------- | ------------------------------- |
| errors         | `Array.<Object>` | A collection of errors.         |
| errors.id      | `String`         | The input id.                   |
| errors.name    | `String`         | The input name                  |
| errors.class   | `String`         | The input class                 |
| errors.message | `String`         | The error message               |
| errors.rule    | `String`         | The rule name that was violated |

**Default**: `[]`

### validator.showValidationErrors

| Name                 | Type      | Description                                                |
| -------------------- | --------- | ---------------------------------------------------------- |
| showValidationErrors | `Boolean` | Whether or not the errors should be rendered into the dom. |

**Default**: `false`

### validator.fields

| Name   | Type             | Description                         |
| ------ | ---------------- | ----------------------------------- |
| fields | `Array.<Object>` | A collection of fields to validate. |

**Default**: `[]`

### Validator.RULES

| Name  | Type             | Description                   |
| ----- | ---------------- | ----------------------------- |
| RULES | `Array.<Object>` | All the validation rule data. |

## Testing

```bash
npm install
npm test
```
