import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 新規アカウント作成時のjsonパラメータ
type RegisterArgs = {
    email: string,
    password: string
};
const isRegisterArgs = (value: unknown): value is RegisterArgs => {
    const registerArgs = value as RegisterArgs;
    return (
        typeof registerArgs?.email === 'string' &&
        typeof registerArgs?.password === 'string'
    );
};


router.get('/', async (req, res) => {
    const users = await prisma.user.findMany();

    res.json({users: users});
});

// アカウント作成
router.post('/', async (req, res) => {
    if (isRegisterArgs(req.body)) {
        prisma.user.create({
            data: {
                email: req.body.email,
                password: req.body.password
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