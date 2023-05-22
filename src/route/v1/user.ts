import express from 'express';
import { PrismaClient, User } from '@prisma/client';

import { APIResponseTemplate } from '../../core/response';
import { Auth, UserClaim } from '../../core/auth';

const router = express.Router();
const prisma = new PrismaClient();

// JWTによるユーザー認証ミドルウェア
router.use('/', async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // ヘッダーの形式検証
    if (authHeader === undefined ||
        authHeader.split(' ')[0] !== 'Bearer' ||
        authHeader.split(' ').length !== 2
    ) {
        res.json(APIResponseTemplate.failed('not authorized'));
        return;
    }

    // JWT
    const token = authHeader.split(' ')[1];

    try {
        const claim: UserClaim = Auth.verifyJWT(token);
        const user = await prisma.user.findFirst({
            where: {
                id: claim.user.id
            }
        });
        if (user !== null) {
            // 認証に成功、次に処理を渡す
            req.user = user;
            next();
        } else res.json(APIResponseTemplate.failed('Auth Rrror: user not found'));
    } catch {
        res.json(APIResponseTemplate.failed('Invalid token'));
    }
});

router.get('/', async (req, res) => {
    if (req.user === undefined) {
        res.json(APIResponseTemplate.failed('not authenticated'));
        return;
    }

    res.send({user: req.user});
});




export default router;