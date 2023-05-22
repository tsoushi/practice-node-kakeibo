// 認証系の処理

import jwt from 'jsonwebtoken';

// JWTに組み込まれるユーザー情報型
export type UserClaim = {
    user: {
        id: number
    }
};
const isUserClaim = (value: unknown): value is UserClaim => {
    const userClaim = value as UserClaim;

    return (
        typeof userClaim?.user?.id === 'number'
    );
};

export class Auth {
    static signJWT(claim: UserClaim): string {
        if (typeof process.env.JWT_SECRET !== 'string') throw Error('JWT_SECRET is undefined');
        return jwt.sign(claim, process.env.JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: '1h'
        });
    }

    static verifyJWT(token: string): UserClaim {
        if (typeof process.env.JWT_SECRET !== 'string') throw Error('JWT_SECRET is undefined');
        let decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256']
        });
        
        if (isUserClaim(decoded)) return decoded;
        else throw Error('Invalid token');
    }
}