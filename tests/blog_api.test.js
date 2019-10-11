const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test ('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are 3 blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(3)
})

test('the author of first blog', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].author).toBe('Maynard James Keenan')
})

test('the id is defined', async () => {
    const blogs = await api.get('/api/blogs')
    const str = JSON.stringify(blogs.body.map(blog => blog._id))
    const id = str.replace(/\"/g,'' )
  
    expect(id).toBeDefined()
})


afterAll(() => {
    mongoose.connection.close()
})