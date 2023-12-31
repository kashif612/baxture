var chai = require('chai');  
const chaiHttp = require('chai-http');
const server = require('./server'); 

chai.use(chaiHttp);

describe('GET /api/users', () => {
  it('should return an empty array when no users exist', async () => {
    await chai.request(server)
      .get('/api/users')
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          message: 'Successfully fetch',
          user: [] 
        });
      });
  });
});


describe('POST /api/users', () => {
  it('should create a new user', async () => {
    const userData = {
      username: 'testuser',
      age: 25,
      hobbies: ['reading'],
    };

    const res = await chai.request(app)
      .post('/api/users')
      .send(userData);

    expect(res).to.have.status(201);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message').to.equal('User saved successfully');
    expect(res.body).to.have.property('savedUser');
    expect(res.body.savedUser).to.have.property('username').to.equal(userData.username);
    expect(res.body.savedUser).to.have.property('age').to.equal(userData.age);
    expect(res.body.savedUser).to.have.property('hobbies').to.deep.equal(userData.hobbies);
  });

  it('should handle missing username', async () => {
    const userData = {
      age: 25,
      hobbies: ['reading'],
    };

    const res = await chai.request(app)
      .post('/api/users')
      .send(userData);

    expect(res).to.have.status(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message').to.equal('Please add username');
  });

  it('should handle missing age', async () => {
    const userData = {
      username: 'testuser',
      hobbies: ['reading'],
    };

    const res = await chai.request(app)
      .post('/api/users')
      .send(userData);

    expect(res).to.have.status(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message').to.equal('Please add age');
  });

  it('should handle missing hobbies', async () => {
    const userData = {
      username: 'testuser',
      age: 25,
    };

    const res = await chai.request(app)
      .post('/api/users')
      .send(userData);

    expect(res).to.have.status(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message').to.equal('Please add hobbies');
  });
});


describe('GET /api/user/{userId}', () => {
  let userId;

  before(async () => {
    // Create a user for testing
    const userData = {
      username: 'testuser',
      age: 25,
      hobbies: ['reading'],
    };

    const newUser = await User.create(userData);
    userId = newUser._id;
  });

  it('should get a user by its ID', async () => {
    const res = await chai.request(app)
      .get(`/api/user/${userId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('username').to.equal('testuser');
    expect(res.body).to.have.property('age').to.equal(25);
    expect(res.body).to.have.property('hobbies').to.deep.equal(['reading']);
  });

  it('should handle non-existing user ID', async () => {
    const nonExistingUserId = 'nonexistentid';

    const res = await chai.request(app)
      .get(`/api/user/${nonExistingUserId}`);

    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message').to.equal('User not found');
  });
});

describe('PUT /api/users/{userId}', () => {
  let userId;

  before(async () => {
    // Create a user for testing
    const userData = {
      username: 'testuser',
      age: 25,
      hobbies: ['reading'],
    };

    const newUser = await User.create(userData);
    userId = newUser._id;
  });

  it('should update a user by its ID', async () => {
    const updatedData = {
      username: 'updateduser',
      age: 30,
      hobbies: ['swimming'],
    };

    const res = await chai.request(app)
      .put(`/api/users/${userId}`)
      .send(updatedData);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('_id').to.equal(String(userId));
    expect(res.body).to.have.property('username').to.equal('updateduser');
    expect(res.body).to.have.property('age').to.equal(30);
    expect(res.body).to.have.property('hobbies').to.deep.equal(['swimming']);
  });

  it('should handle updating a non-existing user', async () => {
    const nonExistingUserId = 'nonexistentid';
    const updatedData = {
      username: 'updateduser',
      age: 30,
      hobbies: ['swimming'],
    };

    const res = await chai.request(app)
      .put(`/api/users/${nonExistingUserId}`)
      .send(updatedData);

    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message').to.equal('User not found');
  });
});
describe('DELETE /api/users/{userId}', () => {
  let userId;

  before(async () => {
    // Create a user for testing
    const userData = {
      username: 'testuser',
      age: 25,
      hobbies: ['reading'],
    };

    const newUser = await User.create(userData);
    userId = newUser._id;
  });

  it('should delete a user by its ID', async () => {
    const res = await chai.request(app)
      .delete(`/api/users/${userId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message').to.equal('User deleted successfully');
  });

  it('should handle deleting a non-existing user', async () => {
    const nonExistingUserId = 'nonexistentid';

    const res = await chai.request(app)
      .delete(`/api/users/${nonExistingUserId}`);

    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message').to.equal('User not found');
  });

  it('should handle getting a deleted user by its ID', async () => {
    const res = await chai.request(app)
      .get(`/api/users/${userId}`);

    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message').to.equal('User not found');
  });
});