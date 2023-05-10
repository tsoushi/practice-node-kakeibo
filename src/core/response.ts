export class APIResponseTemplate {
    static failed(message: string) {
        return {
            status: 'failed',
            message: message
        };
    }
}