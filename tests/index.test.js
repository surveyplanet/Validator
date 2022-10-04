import Validator from '../validator.js';
import
{
    JSDOM
}
from 'jsdom';
import
{
    expect
}
from 'chai';

const data = [
{
    rule: "required",
    value: "required",
    invalid: ""
},
{
    rule: "matches[test-required]",
    value: "required",
    invalid: "invalid"
},
{
    rule: "url",
    value: "https://www.apple.com",
    invalid: "invalid-url"
},
{
    rule: "email",
    value: "testing@surveyplanet.com",
    invalid: "invalid-email"
},
{
    rule: "emails",
    value: "testing1@surveyplanet.com,testing2@surveyplanet.com",
    invalid: "invalid1-email,invalid2-email"
},
{
    rule: "minLength[2]",
    value: "Mauris non congue volutpat.",
    invalid: "A"
},
{
    rule: "maxLength[20]",
    value: "Nulla at odio",
    invalid: "Donec ut mauris nisl donec"
},
{
    rule: "exactLength[20]",
    value: "Nullam cursus fringi",
    invalid: "Suspendisse faucibus blandit auctor"
},
{
    rule: "greaterThan[20]",
    value: "21",
    invalid: "20"
},
{
    rule: "equals[20]",
    value: "20",
    invalid: "s"
},
{
    rule: "lessThan[20]",
    value: "2",
    invalid: "20"
},
{
    rule: "alpha",
    value: "abc",
    invalid: "123"
},
{
    rule: "alphaNumeric",
    value: "abc123",
    invalid: "abc(123)"
},
{
    rule: "alphaDash",
    value: "_abc-123",
    invalid: "#abc-123"
},
{
    rule: "numeric",
    value: "3",
    invalid: "invalid3"
},
{
    rule: "integer",
    value: "-3",
    invalid: "invalid"
},
{
    rule: "decimal",
    value: ".3",
    invalid: "invalid3"
},
{
    rule: "ip",
    value: "8.8.8.8",
    invalid: "invalid-ip"
},
{
    rule: "base64",
    value: "U29tZVN0cmluZ09idmlvdXNseU5vdEJhc2U2NEVuY29kZWQ=",
    invalid: "in"
},
{
    rule: "cvc",
    value: "123",
    invalid: "invalid-cvc"
},
{
    rule: "creditCard",
    value: "4242-4242-4242-4242",
    invalid: "invalid-cc"
},
{
    rule: "phone",
    value: "5558889999",
    invalid: "invalid-phone"
},
{
    rule: "hasNumber",
    value: "hell0",
    invalid: "no-number"
},
{
    rule: "hasUpper",
    value: "Hello",
    invalid: "no-upper"
},
{
    rule: "hasLower",
    value: "HELLo",
    invalid: "NO-LOWER"
},
{
    rule: "custom[/[a-z]/m]",
    value: "abcdefg",
    invalid: "123"
}];

describe('Validator', function()
{

    before(() =>
    {

        const markup = `<html><body><form id="test-form"></form></body></html>`;
        const dom = new JSDOM(markup,
        {
            url: 'http://localhost'
        });
        // Add window and document to global scope so it's accessible from validator.js
        global.window = dom.window;
        global.document = dom.window.document;

    });

    describe('Text input validation', function()
    {


        before(async () =>
        {

            const form = document.getElementById('test-form');

            data.forEach(function(item, index)
            {

                const p = document.createElement('p');
                form.appendChild(p);

                const label = document.createElement('label');
                label.textContent = item.rule;
                p.appendChild(label);

                const input = document.createElement('input');
                input.id = `test-${item.rule}`;
                input.className = 'validation-test';
                input.value = item.value;
                input.setAttribute('type', 'text');
                input.setAttribute('name', `test-${item.rule}`);
                p.appendChild(input);

            });

            // console.log(form.outerHTML);

        });


        it('should get validator rule object', function()
        {
            const ruleName = data[0].rule;

            const validator = new Validator([
            {
                name: `test-${ruleName}`,
                rules: ruleName
            }]);

            const rule = validator.getRule(ruleName);
            expect(rule.name).to.equal(ruleName);
            expect(rule.message).to.equal('The %s field is required.');
            expect(rule.description).to.equal('must not be empty');
        });

        it('should validate the text input form', function()
        {

            const rules = data.map((item) =>
            {
                return {
                    name: `test-${item.rule}`,
                    rules: item.rule
                };
            });

            const validator = new Validator(rules);
            const errors = validator.validate()
            expect(errors).to.have.length(0);

        });

        it('should invalidate the text input form', function()
        {

            data.forEach((item, index) =>
            {
                const input = document.querySelector(`input[name='test-${item.rule}']`);
                input.value = item.invalid;
            });

            const rules = data.map(item => (
            {
                name: `test-${item.rule}`,
                rules: item.rule
            }));

            const validator = new Validator(rules);
            validator.showValidationErrors = true;
            const errors = validator.validate()

            expect(errors).to.have.length(data.length);

            errors.forEach(function(err)
            {
                expect(err.hasOwnProperty('id')).to.be.true;
                expect(err.hasOwnProperty('name')).to.be.true;
                expect(err.hasOwnProperty('class')).to.be.true;
                expect(err.hasOwnProperty('message')).to.be.true;
                expect(err.hasOwnProperty('label')).to.be.true;
            });

            const errLabels = document.querySelectorAll('.validation-error.error');
            expect(errLabels.length).to.equal(errors.length);

        });

        it('should return a custom validation message', function()
        {
            const ruleName = 'required';
            const customMessage = "Hey!! The %s input is a required field!";

            const validator = new Validator([
            {
                name: `test-${data[0].rule}`,
                rules: data[0].rule,
                label: "custom message",
                message: customMessage
            }]);

            const errors = validator.validate();
            expect(errors).to.have.length(1);
            expect(errors[0].message).to.equal(customMessage.replace("%s", "custom message"));

        });

        it('should alter the validation with custom label', function()
        {
            const rule = {
                name: 'test-minLength[2]',
                rules: 'minLength[2]',
                label: "halabalu"
            };

            const validator = new Validator(rule);
            const errors = validator.validate();
            expect(errors).have.length(1);
            expect(errors[0].message.indexOf(rule.label)).to.be.above(0);

        });

        it('should return validation error form multiple rules', function()
        {

            document.querySelector("input[name='test-minLength[2]']").value = 'abc';

            const violation = 'numeric';

            const rule = {
                name: 'test-minLength[2]',
                rules: ['minLength[2]', violation]
            };

            const validator = new Validator(rule);
            const errors = validator.validate();
            expect(errors).to.have.length(1);
            expect(errors[0].rule).to.equal(violation);

        });

    });

    describe('Check/Radio validation', function()
    {

        before(() =>
        {

            const form = document.getElementById('test-form');
            form.innerHTML = '';

            ['checkbox', 'radio'].forEach(type =>
            {

                [1, 2, 3, 4, 5].forEach((i) =>
                {

                    const p = document.createElement('p');
                    form.appendChild(p);

                    const label = document.createElement('label');
                    label.setAttribute('for', `${type}-test-${i}`);
                    label.textContent = `${type.toUpperCase()}: ${i}`;
                    p.appendChild(label);

                    const input = document.createElement('input');
                    input.type = type;
                    input.id = `${type}-test-${i}`;
                    input.value = `${type}-test-${i}`;
                    input.name = `${type}-test-${i}`;
                    p.appendChild(input);


                });

            });

            // console.log(form.outerHTML);
        });


        it('should invalidate the checkbox/radio form', function()
        {
            const rules = [
            {
                name: "checkbox-test-1",
                rules: 'required'
            },
            {
                name: "radio-test-1",
                rules: 'required'
            }];
            const validator = new Validator(rules);
            const errors = validator.validate();
            expect(errors).to.have.length(rules.length);
        });


        it('should validate the checkbox/radio form', function()
        {
            document.querySelector('input[type="checkbox"]').checked = true;
            document.querySelector('input[type="radio"]').checked = true;
            const rules = [
            {
                name: "checkbox-test",
                rules: 'required'
            },
            {
                name: "radio-test",
                rules: 'required'
            }];
            const validator = new Validator(rules);
            const errors = validator.validate()
            expect(errors).to.have.length(0);
        });

    });

    describe('Select input validation', function()
    {

        before(() =>
        {

            const form = document.getElementById('test-form');
            form.innerHTML = '';

            const select = document.createElement('select');
            select.id = 'test-select';
            select.name = 'test-select';
            form.appendChild(select);

            const option = document.createElement('option');
            option.textContent = 'Choose one';
            option.value = "";
            select.appendChild(option);

            [1, 2, 3, 4, 5].forEach((i) =>
            {
                const option = document.createElement('option');
                option.textContent = `Option ${i}`
                option.value = `option-${i}`
                select.appendChild(option)
            });

            // console.log(form.outerHTML);
        });


        it('should invalidate the select input', function()
        {
            const validator = new Validator(
            {
                name: "test-select",
                rules: 'required'
            });
            const errors = validator.validate();
            expect(errors).to.have.length(1);
        });

        it('should validate the select input', function()
        {
            document.getElementById('test-select').value = 'option-2';
            const validator = new Validator(
            {
                name: "test-select",
                rules: 'required'
            });
            const errors = validator.validate();
            expect(errors).to.have.length(0);
        });

        it('should validate a passed value instead of an input', function()
        {
            document.getElementById('test-select').value = 'option-2';
            const validator = new Validator([
            {
                value: "tester@tester.test",
                rules: ['required', 'email']
            },
            {
                value: "not a valid ip",
                rules: ["ip", 'minLength[15]'],
                message: "not a valid ip"
            },
            {
                value: "#This is anInvalid(!)",
                rules: ['alphaDash'],
                message: "alpha numeric characters only"
            },
            {
                value: "9673A",
                rules: ["custom[/^[0-9]{5}$/m]"],
                message: "invalid regular expression match"
            },
            {
                value: '96735',
                rules: 'custom[/^[0-9]{5}$/m]',
                message: "valid regular expression match"
            }]);
            const errors = validator.validate();
            expect(errors).to.have.length(3);
        });

    });

});