var should = require('chai').should(), supertest = require('supertest'), api = supertest('http://localhost:3000');

describe('/autocompletes', function() {

	it('returns blog posts as JSON', function(done) {
		api.get('/blog').expect(200).expect('Content-Type', /json/).end(function(err, res) {
			if (err)
				return done(err);
			res.body.should.have.property('autocomplete').and.be. instanceof (Array);
			done();
		});
	});

}); 