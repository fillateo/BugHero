// const { assert } = require('chai')
const request = require('supertest-as-promised')

const app = require('../../app')

const User = require('../../models/User')

process.env.NODE_ENV = 'development'

const credentials = {
  username: 'integrationtest',
  email: 'integrationtest@gmail.com',
  password: 'integration123',
}

describe('Users Controller', () => {
  after(async () => {
    await User.findOneAndDelete({ username: credentials.username })
  })

  it('should register a new user', () =>
    request(app)
      .post('/auth/register')
      .send({
        displayName: 'Integ Display Name',
        firstName: 'Integration',
        lastName: 'Testing',
        email: credentials.email,
        username: credentials.username,
        password: credentials.password,
      })
      .expect(302)
      .expect('Location', '/users/login'))

  it('should login existing User', () =>
    request(app)
      .post('/auth/login')
      .send({
        email: credentials.email,
        password: credentials.password,
      })
      .expect(302)
      .expect('Location', '/'))

  it('should redirect to "/users/login" if wrong email', () =>
    request(app)
      .post('/auth/login')
      .send({
        email: 'wrongemail@email.com',
        password: credentials.password,
      })
      .expect(302)
      .expect('Location', '/users/login'))

  it('should redirect to "/users/login" if wrong password', () =>
    request(app)
      .post('/auth/login')
      .send({
        email: credentials.email,
        password: 'wrongpassword',
      })
      .expect(302)
      .expect('Location', '/users/login'))

  it('should redirect to "/users/register" if email is used', () =>
    request(app)
      .post('/auth/register')
      .send({
        displayName: 'Integ Display Name',
        firstName: 'Integration',
        lastName: 'Testing',
        email: credentials.email,
        username: 'integrationtest',
        password: 'integration123',
      })
      .expect(302)
      .expect('Location', '/users/register'))

  it('should return to "/users/register" if username is used', () =>
    request(app)
      .post('/auth/register')
      .send({
        username: credentials.username,
        email: 'examplemail@email.com',
        password: 'integration',
        firstName: 'Integration Test',
      })
      .expect(302)
      .expect('Location', '/users/register'))
})
