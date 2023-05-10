import express from 'express';
import { PrismaClient, User } from '@prisma/client';

import { APIResponseTemplate } from '../../core/response';
import { Auth, UserClaim } from '../../core/auth';

const router = express.Router();
const prisma = new PrismaClient();

type AuthRequiredArgs = {
    token: string
};
const isAuthRequiredArgs = (value: unknown): value is AuthRequiredArgs => {
    const authRequiredArgs = value as AuthRequiredArgs;

    return (
        typeof authRequiredArgs?.token === 'string'
    );
}

router.use('/', async (req, res, next) => {
    if (!isAuthRequiredArgs(req.body)) {
        res.json(APIResponseTemplate.failed('token field is required'));
        return;
    }

    try {
        const claim: UserClaim = Auth.verifyJWT(req.body.token);
        const user = await prisma.user.findFirst({
            where: {
                id: claim.user.id
            }
        });
        if (user !== null) {
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