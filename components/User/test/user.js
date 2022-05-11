const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

const User = require('../model/user')
const refreshToken = require('../model/refresh_token')
const databaseConnection = require('../../../db')
const app = require('../../../app')

const should = chai.should()

chai.use(chaiHttp)

describe('User', () => {
  before(async () => {
    await databaseConnection()
  })

  it('Manual super admin entry found in the database', async () => {
    const superAdmin = await User.findOne({
      firstname: 'Admin',
      lastname: 'Admin',
      role: 'Admin',
    })
    should.exist(superAdmin)
  })
})

describe('/POST /user/login', () => {
  it('Should not accept invalid JSON payload', (done) => {
    const invalidJSON = '{"invalidJSON",}'

    chai
      .request(app)
      .post('/user/login')
      .type('json')
      .send(invalidJSON)
      .end((err, response) => {
        expect(err).to.be.null
        response.should.have.status(400)
        response.body.should.be.a('object')
        response.body.should.have.property('error')
        done()
      })
  })

  it('Should validate incoming JSON payload for required properties', (done) => {
    const invalidUserPayload = {}
    const userWihoutEmail = {
      password: '12345',
    }
    const userWithInvalidEmailFormat = {
      email: 'lol',
      password: '123456',
    }
    const userWihoutPassword = {
      email: 'sample@gmail.com',
    }

    const requester = chai.request(app).keepOpen()

    Promise.all([
      requester.post('/user/login').type('json').send(invalidUserPayload),
      requester.post('/user/login').type('json').send(userWihoutEmail),
      requester.post('/user/login').type('json').send(userWihoutPassword),
      requester
        .post('/user/login')
        .type('json')
        .send(userWithInvalidEmailFormat),
    ]).then((response) => {
      response.forEach((individualResponse) => {
        individualResponse.should.have.status(400)
        individualResponse.body.should.be.a('object')
        individualResponse.body.should.have.property('error')
      })
      requester.close()
      done()
    })
  })

  it('Should not allow access with wrong email and password', (done) => {
    const user = {
      email: 'lol@gmail.com',
      password: '000000',
    }

    chai
      .request(app)
      .post('/user/login')
      .type('json')
      .send(user)
      .end((err, response) => {
        expect(err).to.be.null
        response.should.have.status(401)
        response.body.should.be.a('object')
        response.body.should.not.have.property('access_token')
        response.body.should.not.have.property('refresh_token')
        done()
      })
  })

  it('Should return access_token and refresh_token with correct credentials', (done) => {
    const user = {
      email: 'admin@gmail.com',
      password: '159357',
    }

    chai
      .request(app)
      .post('/user/login')
      .type('json')
      .send(user)
      .end((err, response) => {
        expect(err).to.be.null
        response.should.have.status(200)
        response.body.should.be.a('object')
        response.body.should.have.property('access_token')
        response.body.should.have.property('refresh_token')
        done()
      })
  })

  after(async () => {
    await refreshToken.deleteMany({})
  })
})

describe('/POST /user/refresh-token', () => {
  let userTokens = {}
  const user = {
    email: 'admin@gmail.com',
    password: '159357',
  }

  before(async () => {
    const response = await chai
      .request(app)
      .post('/user/login')
      .type('json')
      .send(user)
    userTokens = response.body
  })

  it('Should check for authorization header existance', async () => {
    chai
      .request(app)
      .post('/user/refresh-token')
      .send()
      .end((err, response) => {
        expect(err).to.be.null
        response.should.have.status(400)
        response.body.should.be.a('object')
        response.body.should.have.property('error')
      })
  })

  it('Should check for invalid refresh token in authorization header', async () => {
    chai
      .request(app)
      .post('/user/refresh-token')
      .set('authorization', 'invalid_refresh_token')
      .send()
      .end((err, response) => {
        expect(err).to.be.null
        response.should.have.status(401)
        response.body.should.be.a('object')
        response.body.should.have.property('error')
      })
  })

  it('Should return new pair of access & refresh tokens incase of valid refresh-token', async () => {
    chai
      .request(app)
      .post('/user/refresh-token')
      .set('authorization', userTokens.refresh_token)
      .send()
      .end((err, response) => {
        expect(err).to.be.null
        response.should.have.status(200)
        response.body.should.be.a('object')
        response.body.should.have.property('access_token')
        response.body.should.have.property('refresh_token')
      })
  })

  it('Should restrict the use of same refresh-token again to get new token pair', async () => {
    const newTokenPairResponse = await chai
      .request(app)
      .post('/user/refresh-token')
      .set('authorization', userTokens.refresh_token)
      .send()

    const responseWithOldRefreshToken = await chai
      .request(app)
      .post('/user/refresh-token')
      .set('authorization', userTokens.refresh_token)
      .send()

    responseWithOldRefreshToken.should.have.status(401)
    responseWithOldRefreshToken.body.should.be.a('object')
    responseWithOldRefreshToken.body.should.have.property('error')
  })

  after(async () => {
    await refreshToken.deleteMany({})
  })
})

describe('/POST /user', () => {
  let adminUserTokens = {}
  const adminUser = {
    email: 'admin@gmail.com',
    password: '159357',
  }
  let temporarilyCreatedNormalUser = {}

  before(async () => {
    chai
      .request(app)
      .post('/user/login')
      .type('json')
      .send(adminUser)
      .end((err, response) => {
        adminUserTokens = response.body
      })
  })

  it('Should check for authorization header existance', async () => {
    chai
      .request(app)
      .post('/user')
      .send()
      .end((err, response) => {
        expect(err).to.be.null
        response.should.have.status(400)
        response.body.should.be.a('object')
        response.body.should.have.property('error')
      })
  })

  it('Should check for invalid refresh token in authorization header', async () => {
    chai
      .request(app)
      .post('/user')
      .set('authorization', 'invalid_refresh_token')
      .send()
      .end((err, response) => {
        expect(err).to.be.null
        response.should.have.status(401)
        response.body.should.be.a('object')
        response.body.should.have.property('error')
      })
  })

  it('Should check for all required properties of incoming JSON payload', (done) => {
    const invalidUserPayload = {
      email: 'lol@gmail.com',
    }

    chai
      .request(app)
      .post('/user')
      .type('json')
      .send(invalidUserPayload)
      .end((err, response) => {
        expect(err).to.be.null
        response.should.have.status(400)
        response.body.should.be.a('object')
        response.body.should.have.property('error')
        done()
      })
  })

  it('Should check for invalid user role', (done) => {
    const invalidUserPayload = {
      firstname: 'Sample',
      lastname: 'User',
      email: 'sample.user@gmail.com',
      password: 'letmein@123',
      role: 'Invalid_role',
    }

    chai
      .request(app)
      .post('/user')
      .type('json')
      .send(invalidUserPayload)
      .end((err, response) => {
        expect(err).to.be.null
        response.should.have.status(400)
        response.body.should.be.a('object')
        response.body.should.have.property('error')
        done()
      })
  })

  it('Should allow new user creation by "Admin" user role', (done) => {
    const sampleUser = {
      firstname: 'Sample',
      lastname: 'User',
      email: 'sample.user@gmail.com',
      password: 'letmein@123',
      role: 'User',
    }

    chai
      .request(app)
      .post('/user')
      .set('authorization', adminUserTokens.access_token)
      .type('json')
      .send(sampleUser)
      .end((err, response) => {
        expect(err).to.be.null
        response.should.have.status(201)
        response.body.should.be.a('object')
        response.body.should.have.property('data')
        response.body.should.have.property('msg')
        expect(response).to.have.nested.property('body.data.User._id')
        expect(response).to.have.nested.property('body.data.User.firstname')
        expect(response).to.have.nested.property('body.data.User.lastname')
        expect(response).to.have.nested.property('body.data.User.email')
        expect(response).to.have.nested.property('body.data.User.role')
        temporarilyCreatedNormalUser = response.body.data.User
        done()
      })
  })

  it('Should check for existing user with same email address', (done) => {
    const sampleUser = {
      firstname: 'Sample',
      lastname: 'User',
      email: 'sample.user@gmail.com',
      password: 'letmein@123',
      role: 'User',
    }

    chai
      .request(app)
      .post('/user')
      .set('authorization', adminUserTokens.access_token)
      .type('json')
      .send(sampleUser)
      .end((err, response) => {
        expect(err).to.be.null
        response.should.have.status(409)
        response.body.should.be.a('object')
        response.body.should.have.property('error')
        done()
      })
  })

  it('Should restrict access to user with role "User"', (done) => {
    const user = {
      email: 'sample.user@gmail.com',
      password: 'letmein@123',
    }
    let tokenPair = {}

    chai
      .request(app)
      .post('/user/login')
      .type('json')
      .send(user)
      .end((err, response) => {
        tokenPair = response.body

        chai
          .request(app)
          .post('/user')
          .set('authorization', tokenPair.access_token)
          .type('json')
          .send('{}')
          .end((err, response) => {
            expect(err).to.be.null
            response.should.have.status(403)
            response.body.should.be.a('object')
            response.body.should.have.property('error')
            done()
          })
      })
  })

  after(async () => {
    await refreshToken.deleteMany({})
    await User.deleteOne({ _id: temporarilyCreatedNormalUser._id })
  })
})
