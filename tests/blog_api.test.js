
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')



describe('when there is initially some blogs saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
  
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
      const promiseArray = blogObjects.map(blog => blog.save())
      await Promise.all(promiseArray)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test('the author is in the blog', async () => {
    const response = await api.get('/api/blogs')
    const authors = response.body.map(r => r.author)
    expect(authors).toContain('Maynard James Keenan')
  })

  
  test('the id is defined', async () => {
    const blogs = await api.get('/api/blogs')
    const str = JSON.stringify(blogs.body.map(blog => blog._id))
    const id = str.replace(/\"/g, '')

    expect(id).toBeDefined()
  })

})

describe('when new blog is added to the list', () =>{
  test('a valid blog  is added', async () => {
    const newBlog = {
      title: 'How to code',
      author: 'Linus Trovalds',
      url: 'https://linux.com',
      likes: 0,
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length+1)
  
    const authors = blogsAtEnd.map(r => r.author)
  
    expect(authors).toContain('Linus Trovalds')
  })

  test('missing like value will have 0 likes', async () => {
    const newBlog = {
      title: 'Origin of life',
      author: 'Charles Darwin',
      url: 'http://originoflife.com',
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
  
    const blogsAtEnd = await helper.blogsInDb()
    const index = blogsAtEnd.length - 1
    expect(blogsAtEnd[index].likes).toBe(0)
  })

  test('throw error if title or url are missing', async () => {
    const newBlog = {
        title: 'Origin of life',
        author: 'Charles Darwin',
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

})



    test('a blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
    
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    
      const blogsAtEnd = await helper.blogsInDb()
    
      expect(blogsAtEnd.length).toBe(
        blogsAtStart.length - 1)
    
      const titles = blogsAtEnd.map(r => r.title)
    
      expect(titles).not.toContain(blogToDelete.title)
    })


    describe('when there is initially one user in the database', () => {

      beforeEach(async () => {
          await User.deleteMany({})
          const user = new User({ username: 'root', password: 'secret'})
          await user.save()
      })
  
      test('creation succeeds with new username', async () => {
          const usersAtStart = await helper.usersInDb()
  
          const newUser = {
              username: 'kecyg',
              name: 'Gaurab Kc',
              password: 'secretkey',
          }
  
          await api 
          .post('/api/users')
          .send(newUser)
          .expect(200)
          .expect('Content-Type', /application\/json/)
  
          const usersAtEnd = await helper.usersInDb()
          expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
  
          const usernames = usersAtEnd.map(u => u.username)
          expect(usernames).toContain(newUser.username)
      })

      describe('when there is initially one user at db', () => {
        // ...
      
        test('creation fails with proper statuscode and message if username already taken', async () => {
          const usersAtStart = await helper.usersInDb()
      
          const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
          }
      
          const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
      
          expect(result.body.error).toContain('`username` to be unique')
      
          const usersAtEnd = await helper.usersInDb()
          expect(usersAtEnd.length).toBe(usersAtStart.length)
        })})
  })











afterAll(() => {
  mongoose.connection.close()
})
