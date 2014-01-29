
var request = require('supertest')
  , express = require('express');

var app = require('../app.js');

describe('GET /', function(){
  it('respond with plain text', function(done){
    request(app)
      .get('/')
      .expect(200, done);
  })
})

describe('GET', function(){
  it('respond with json', function(done){
    request(app)
    .get('/insecticons.json')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  })
})