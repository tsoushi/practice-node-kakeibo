import express from 'express';
import { PrismaClient } from '@prisma/client';

import { Password } from '../../core/password';

const router = express.Router();
const prisma = new PrismaClient();


type LoginArgs = {
    userName: string,
    password: string
};
const isLoginArgs = (value: unknown): value is LoginArgs => {
    const loginArgs = value as LoginArgs;
    return (
        typeof loginArgs?.userName === 'string' &&
        typeof loginArgs?.password === 'string'
    );
};

router.post('/login', async (req, res) => {
    if (isLoginArgs(req.body)) {
        const user = await prisma.user.findUnique({
            where: {
                userName: req.body.userName
            }
        });

        if (user !== null) {
            if (Password.verifySync(req.body.password, user.password)) {
                res.json({status: 'ok'});
            } else {
                res.json({status: 'failed', message: 'password is incorrect'});
            }
        } else {
            res.json({status: 'failed', message: 'user not found'});
        }
    } else {
        res.json({status: 'failed', message: 'wrong parameters'});
    }
});


// アカウント作成
// 新規アカウント作成時のjsonパラメータ
type RegisterArgs = {
    userName: string,
    email?: string,
    password: string
};
const isRegisterArgs = (value: unknown): value is RegisterArgs => {
    const registerArgs = value as RegisterArgs;
    return (
        typeof registerArgs?.userName === 'string' &&
        typeof registerArgs?.password === 'string' &&
        (typeof registerArgs?.email === 'string' || registerArgs?.email === undefined)
    );
};
router.post('/register', async (req, res) => {
    if (isRegisterArgs(req.body)) {
        prisma.user.create({
            data: {
                userName: req.body.userName,
                email: req.body.email,
                password: Password.hashSync(req.body.password)
            }
        })
            .then((user) => {
                res.json({status: 'ok', user: user});
            })
            .catch((e) => {
                res.json({status: 'failed', message: 'Error: failed to create user'});
            });

    } else {
        res.status(400).json({status: 'failed', message: 'Error: `email` and `password` properties are required'});
    }
});

export default router;