import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import "express-async-errors";
import {configureDB} from "./utils/config.js";
import {errorHandler, tokenExtractor, tokenValidator, unknownEndpoint} from "./utils/middleware.js";
import userRouter from "./routes/userRouter.js";
import todoRouter from "./routes/todoRouter.js";
import healthRouter from "./routes/healthRouter.js";


const app = express()

await configureDB()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(morgan('dev'))

app.use('/health', healthRouter)
app.use('/api/auth', userRouter)

app.use(tokenExtractor)
app.use(tokenValidator)

app.use('/api/todo', todoRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app
