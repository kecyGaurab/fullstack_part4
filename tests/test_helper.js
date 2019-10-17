const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
      title: 'Music',
      author: 'Maynard James Keenan',
      url: 'tool.com',
      likes: 600000,
    
    },
    {
      title: 'Food',
      author: 'Gordon Ramsey',
      url: 'foodthatdontsuck.com',
      likes: 0,
     
    }
  ]

  const nonExistingId = async () => {
    const blog = new Blog(
        { title: 'willremovethissoon',
        author:'Stephen King'
        })
    await blog.save()
    await blog.remove()
  
    return blog._id.toString()

  }

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }


const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
    usersInDb
}
