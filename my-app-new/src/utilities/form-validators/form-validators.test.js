import FormValidators from './';

describe('FormValidators', () => {
  it('required', () => {
    expect(FormValidators.required()).toBe(false);
    expect(FormValidators.required(' ')).toBe(false);
    expect(FormValidators.required('Yeppers')).toBe(true);
  });

  it('minLength', () => {
    expect(FormValidators.minLength(2, 'a')).toBe(false);
    expect(FormValidators.minLength(2)).toBe(false);
    expect(FormValidators.minLength(2, ' b')).toBe(false);
    expect(FormValidators.minLength(5, 'abcde')).toBe(true);
  });

  it('maxLength', () => {
    expect(FormValidators.maxLength(2, 'abc')).toBe(false);
    expect(FormValidators.maxLength(2, ' b')).toBe(true);
    expect(FormValidators.maxLength(2)).toBe(true);
    expect(FormValidators.maxLength(5, 'abcde')).toBe(true);
  });

  it('gets validators', () => {
    expect(FormValidators.getValidators({
      required: true,
    }).length).toBe(1);
    expect(FormValidators.getValidators({
      required: true,
      minLength: 3,
    }).length).toBe(2);
    expect(FormValidators.getValidators({
      required: true,
      minLength: 3,
      maxLength: 3,
    }).length).toBe(3);
  });
});
