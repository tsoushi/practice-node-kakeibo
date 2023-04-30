import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();


router.get('/', async (req, res) => {
    const users = await prisma.user.findMany();

    res.json({users: users});
});

router.post('/', async (req, res) => {
    if (typeof req.body.email === 'string') {
        prisma.user.create({
            data: {
                email: req.body.email,
                password: 'test'
            }
        })
            .then((user) => {
                res.json({status: 'ok', user: user});
            })
            .catch((e) => {
                res.json({status: 'failed', message: 'Error: failed to create user'});
            })

    } else {
        res.json({status: 'failed', message: 'Error: `email` property is required'});
    }
});


export default router;