import bcrypt from 'bcrypt';


export class Password {
    static hashSync(password: string): string {
        return bcrypt.hashSync(password, 10);
    }

    static verifySync(password: string, encrypted: string): boolean {
        return bcrypt.compareSync(password, encrypted);
    }
}