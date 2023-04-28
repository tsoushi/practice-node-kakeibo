import { PrismaClient } from '@prisma/client';
import express from 'express';


const prisma = new PrismaClient();

const app = express();

app.use(express.json());


app.get('/user', async (req, res) => {
    const users = await prisma.user.findMany();

    res.json({users: users});
});

app.post('/user', async (req, res) => {
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

app.listen(8000, '0.0.0.0');