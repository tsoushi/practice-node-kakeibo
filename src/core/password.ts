// 暗号化等アルゴリズム

import bcrypt from 'bcrypt';


export class Password {
    // パスワードをハッシュ化する（同期）
    static hashSync(password: string): string {
        return bcrypt.hashSync(password, 10);
    }

    // パスワードのハッシュを比較する
    static verifySync(password: string, encrypted: string): boolean {
        return bcrypt.compareSync(password, encrypted);
    }
}