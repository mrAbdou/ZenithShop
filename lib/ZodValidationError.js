export default class ZodValidationError extends Error {
    constructor(message, issues) {
        super(message);
        this.name = 'ZodValidationError';
        this.issues = issues;
    }
}