import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	completed: {
		type: Boolean,
		defaultValue: false
	},
	date: {
		type: mongoose.Schema.Types.Date,
		required: true
	}
})

todoSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Todo = mongoose.model("Todo", todoSchema)

export default Todo
