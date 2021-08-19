const { assert } = require('chai')
const request = require('supertest-as-promised')

const app = require('../app')

process.env.NODE_ENV = 'development'

const credentials = {
  username: 'integrationtest',
  email: 'integrationtest@gmail.com',
  password: 'integration123',
}

const _user = `integration_test_${Math.floor(Date.now() / 1000)}@alttab.co`

describe('Users Controller', () => {
  it('should register a new user', () =>
    request(app)
      .post('/users/register')
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
      .post('/users/login')
      .send({
        email: credentials.email,
        password: credentials.password,
      })
      .expect(302)
      .expect('Location', '/'))

  it('should redirect to "/users/login" if wrong email', () =>
    request(app)
      .post('/users/login')
      .send({
        email: 'wrongemail@email.com',
        password: credentials.password,
      })
      .expect(302)
      .expect('Location', '/users/login'))

  it('should redirect to "/users/login" if wrong password', () =>
    request(app)
      .post('/users/login')
      .send({
        email: credentials.email,
        password: 'wrongpassword',
      })
      .expect(302)
      .expect('Location', '/users/login'))

  it('should redirect to "/users/register" if email is used', () =>
    request(app)
      .post('/users/register')
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
      .post('/users/register')
      .send({
        username: credentials.username,
        email: 'examplemail@email.com',
        password: 'integration',
        firstName: 'Integration Test',
      })
      .expect(302)
      .expect('Location', '/users/register'))
})
