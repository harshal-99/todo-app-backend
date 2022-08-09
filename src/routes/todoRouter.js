import Todo from "../models/todo.js";
import {Router} from "express";
import {body, param} from "express-validator";
import {validateErrors, validateToken} from "../utils/middleware.js";

const todoRouter = Router()

todoRouter.get('/', async (request, response, next) => {
	const decodedToken = validateToken(request, response, next)

	const todos = await Todo
		.find({userId: decodedToken.id})
	response.json(todos)
})

todoRouter.post('/',
	body('title').escape().isString().trim(),
	async (request, response, next) => {
		validateErrors(request, response, next)
		const decodedToken = validateToken(request, response, next)

		const todo = new Todo({
			title: request.body.title,
			completed: false,
			userId: decodedToken.id,
			date: new Date().getTime()
		})

		const savedTodo = await todo.save()
		response.json(savedTodo)
	})

todoRouter.put('/:id',
	param('id').isMongoId(),
	body('title').escape().isString().trim(),
	body('completed').escape().isBoolean(),
	async (request, response, next) => {
		validateErrors(request, response, next)
		const decodedToken = validateToken(request, response, next)

		const todo = await Todo.findById(request.params.id)

		if (!todo) {
			return response.status(404).json({error: 'todo not found'})
		}

		if (todo.userId.toString() !== decodedToken.id.toString()) {
			return response.status(401).json({error: 'not authorized'})
		}

		todo.title = request.body.title
		todo.completed = request.body.completed
		todo.date = new Date().getTime()
		const savedTodo = await todo.save()
		response.json(savedTodo)
	}
)


todoRouter.get('/:id',
	param('id').escape().isMongoId(),
	async (request, response, next) => {
		validateErrors(request, response, next)
		validateToken(request, response, next)

		const todo = await Todo.findById(request.params.id)
		if (!todo) {
			return response.status(404).json({error: 'todo not found'})
		}
		response.json(todo)
	}
)


todoRouter.delete('/:id',
	param('id').escape().isMongoId(),
	async (request, response, next) => {
		validateErrors(request, response, next)

		const decodedToken = validateToken(request, response, next)

		const todo = await Todo.findById(request.params.id)

		if (!todo) {
			return response.status(404).json({error: 'todo not found'})
		}

		if (todo.userId.toString() !== decodedToken.id.toString()) {
			return response.status(401).json({error: 'not authorized'})
		}
		await todo.remove()
		response.status(200).end()
	})

export default todoRouter
