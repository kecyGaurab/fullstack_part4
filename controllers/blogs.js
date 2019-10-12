const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')

blogsRouter.get('/', async (request, response) => {
	// Blog
	// 	.find({})
	// 	.then(blogs => {
	// 		response.json(blogs)
	// 	})
	const blogs = await Blog.find({})
	response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
	const body = request.body

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: 'undefined' ? 0: body.likes,
	}
	)
	

	try
	{const savedBlog = await blog.save()
	response.json(savedBlog.toJSON())}
	catch(exception){
		next(exception)
	}
})

module.exports = blogsRouter