export default class FieldErrors {
  constructor() {
    this.errors = {};
    this.count = 0;
  }

  addError(field, error) {
    this.count += 1;
    if (!this.errors[field]) {
      this.errors[field] = [error];
    } else this.errors[field].push(error);
  }
}
