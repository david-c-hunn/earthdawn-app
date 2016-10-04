'use strict';

describe('Talent', function() {
    var $httpBackend, Talent;
    var talentsData = [
        {name: 'Talent X'},
        {name: 'Talent Y'},
        {name: 'Talent Z'}
    ];

    // Add a custom equality tester before each test
    beforeEach(function() {
        jasmine.addCustomEqualityTester(angular.equals);
    });

    // Load the module that contains the `Talent` serice before each test
    beforeEach(module('core.talent'));

    // Instantiate the serice and "train" `$httpBackend` before each test
    beforeEach(inject(function(_$httpBackend_, _Talent_) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('http://localhost:8080/earthdawn/talents').respond(talentsData);

        Talent = _Talent_;
    }));

    // Verify that there are no outstanding expectations or requests after each test
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch the talents data from `/http://localhost:8080/earthdawn/talents`', function() {
        var talents = Talent.query();

        expect(talents).toEqual([]);

        $httpBackend.flush();
        expect(talents).toEqual(talentsData);
    })
});