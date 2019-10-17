const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user',{ username: 1, name : 1 })
	response.json(blogs.map(blog => blog.toJSON()))
  })


blogsRouter.get('/:id', async (request, response, next) => {
	try{
		const blog = await Blog.findById(request.params.id)
		if (blog) {
		  response.json(blog.toJSON())
		} else {
		  response.status(404).end()
		}
	  } catch(exception) {
		next(exception)
	  }
	})

blogsRouter.post('/', async (request, response, next) => {
	const body = request.body
	// the information about the user who created a note is 
	//sent in the userId field of the request body
	const user = await User.findById(body.userId)

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes === undefined ? 0: body.likes,
		user: user._id
	})
	if(!body.title || !body.url){
		response.status(400).send('Bad Request').end()
	}
	try
	{
		const savedBlog = await blog.save()
		user.blogs = user.blogs.concat(savedBlog._id)
		await user.save()
		response.json(savedBlog.toJSON())}
		catch(exception){
			next(exception)
	}
})

blogsRouter.delete('/:id', async (request, response, next) => {
	try {
	  await Blog.findByIdAndRemove(request.params.id)
	  response.status(204).end()
	} catch (exception) {
	  next(exception)
	}
  })

blogsRouter.put('/:id', async (request, response, next) => {
	const body = request.body

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes
	}
	if(!body.title || !body.url){
		response.status(400).send('Bad Request').end()
	}
try {
	const savedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
	response.json(savedBlog.toJSON())}
	catch(exception){
		next(exception)
	}

})

module.exports = blogsRouter