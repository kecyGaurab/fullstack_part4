const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);
const Blog = require('../models/blog');

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
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are 3 blogs', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body.length).toBe(initialBlogs.length);
});

test('the author is in the blog', async () => {
  const response = await api.get('/api/blogs');
  const authors = response.body.map(r => r.author);
  expect(authors).toContain('Maynard James Keenan');
});

test('the id is defined', async () => {
  const blogs = await api.get('/api/blogs');
  const str = JSON.stringify(blogs.body.map(blog => blog._id));
  const id = str.replace(/\"/g, '');

  expect(id).toBeDefined();
});

test('a new blog list is added', async () => {
  const newBlog = {
    title: 'How to code',
    author: 'Linus Trovalds',
    url: 'https://linux.com',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');

  const authors = response.body.map(r => r.author);

  expect(response.body.length).toBe(initialBlogs.length + 1);
  expect(authors).toContain('Linus Trovalds');
});

test('missing like value will have 0 likes', async () => {
  const newBlog = {
    title: 'Origin of life',
    author: 'Charles Darwin',
    url: 'http://originoflife.com',
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200);

  const response = await api.get('/api/blogs');
  const index = response.body.length - 1;
  expect(response.body[index].likes).toBe(0);
});

afterAll(() => {
  mongoose.connection.close();
});
