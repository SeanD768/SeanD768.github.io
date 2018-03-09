import sinon from 'sinon';

describe('FormManager', () => {
  let FormManager;

  beforeEach(() => {
    jest.resetModules();
    FormManager = require('./FormManager').default;
  });

  it('adds form', () => {
    FormManager.addForm({ id: 'testing' });

    expect(FormManager.forms.size).toBe(1);
  });

  it('removes form', () => {
    const removeForm = FormManager.addForm({ id: 'testing' });
    removeForm();

    expect(FormManager.forms.get('testing')).toBe(undefined);
  });

  it('adds validator to form', () => {
    const removeForm = FormManager.addForm({ id: 'testing' });
    FormManager.addValidator('testing', {
      id: 'validator_1',
      validator: () => {
        return {
          id: 'name',
          valid: true,
        }
      },
    });

    expect(FormManager.forms.get('testing').validators.length).toBe(1);
  });

  it('gets validator by ID', () => {
    FormManager.addForm({ id: 'testing' });
    FormManager.addValidator('testing', {
      id: 'validator_1',
      validator: () => {
        return {
          id: 'name',
          valid: true,
        }
      },
    });
    const form = FormManager.forms.get('testing');
    const validator = FormManager.getValidatorByID('validator_1', form);

    expect(validator.id).toBe('validator_1');
  });

  it('gets validator index by ID', () => {
    FormManager.addForm({ id: 'testing' });
    const form = FormManager.forms.get('testing');
    FormManager.addValidator('testing', {
      id: 'validator_1',
      validator: () => {
        return {
          id: 'name',
          valid: true,
        }
      },
    });
    const index = FormManager.getValidatorIndexByID('validator_1', form);

    expect(index).toBe(0);
  });

  it('validates from by id', () => {
    FormManager.addForm({ id: 'testing' });
    FormManager.addValidator('testing', {
      id: 'name',
      validator: () => {
        return {
          id: 'name',
          valid: true,
        }
      },
    });
    FormManager.addValidator('testing', {
      id: 'age',
      validator: () => {
        return {
          id: 'age',
          valid: true,
          value: 27,
        }
      },
    });
    const details = FormManager.validateFormById('testing');

    expect(details.valid).toBe(true);
    expect(details.fields.name.valid).toBe(true);
    expect(details.fields.age.valid).toBe(true);
    expect(details.fields.age.value).toBe(27);
  });

  it('validates value', () => {
    const isValid = FormManager.validate('Bob', [
      value => value.length > 2,
      value => value === 'Bob',
    ]);

    expect(isValid).toBe(true);
  });
});
