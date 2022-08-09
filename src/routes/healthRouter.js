import {Router} from "express";

const healthRouter = Router()

healthRouter.get('/', (request, response, next) => {
	response.status(200).end()
})

export default healthRouter
