import { PrismaClient } from '@prisma/client';
import express from 'express';

import apiV1 from './route/v1/index';

const app = express();
const prisma = new PrismaClient();


app.use('/api/v1', apiV1);


app.listen(8000, '0.0.0.0');