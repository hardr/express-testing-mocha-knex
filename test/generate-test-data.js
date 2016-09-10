const faker = require('faker');

const userArray = [];

function createUserObject(yearOne, yearTwo) {
  return {
    id: faker.random.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    created_at: faker.date.between(yearOne, yearTwo)
  };
};

for (var i = 0; i < 500; i++) {
  userArray.push(createUserObject(2013, 2015));
}
for (var i = 0; i < 500; i++) {
  userArray.push(createUserObject(2015, 2017));
}

module.exports = {
  userArray
};
