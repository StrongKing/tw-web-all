export default class CustomError extends Error {
  code = null;

  constructor(message, code) {
    super(message);
    this.code = code;
  }
}
