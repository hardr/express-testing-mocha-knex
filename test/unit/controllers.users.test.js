process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();

var usersController = require('../../src/server/controllers/users');

const generateDate = require('../generate-test-data').userArray;

describe('controllers : users', function() {

  describe('filterByYear()', function() {
    const userArray = [
      {
        id: 1,
        username: 'michael',
        email: 'michael@mherman.org',
        created_at: '2016-09-10T16:44:28.015Z'
      },
      {
        id: 2,
        username: 'mike',
        email: 'mike@mherman.org',
        created_at: '2015-09-10T16:44:28.015Z'
      },
      {
        id: 3,
        username: 'john',
        email: 'john@mherman.org',
        created_at: '2014-09-10T16:44:28.015Z'
      }
    ];
    it('should return all users created on or after a specified year', function(done) {
      usersController.filterByYear(userArray, 2015, (err,total) => {
        should.not.exist(err);
        total.length.should.eql(2);
        done();
      });
    });
    // it('should return an error', function(done) {
    //   usersController.filterByYear(1, 'test', (err, total) => {
    //     should.not.exist(total);
    //     err.should.eql('Something went wrong!');
    //     done();
    //   });
    // });
  });

  describe('filterByYear() with helper', function() {
    it('should return all users created on or after a specified year', function(done) {
      usersController.filterByYear(generateDate, 2015, (err,total) => {
        should.not.exist(err);
        total.length.should.eql(500);
        done();
      });
    });
  });

});
