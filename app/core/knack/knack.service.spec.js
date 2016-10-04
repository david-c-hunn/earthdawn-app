'use strict';

describe('Knack', function() {
    var $httpBackend, Knack;
    var knacksData = [
        {name: 'Knack X'},
        {name: 'Knack Y'},
        {name: 'Knack Z'}
    ];

    // Add a custom equality tester before each test
    beforeEach(function() {
        jasmine.addCustomEqualityTester(angular.equals);
    });

    // Load the module that contains the `Knack` serice before each test
    beforeEach(module('core.knack'));

    // Instantiate the serice and "train" `$httpBackend` before each test
    beforeEach(inject(function(_$httpBackend_, _Knack_) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('http://localhost:8080/earthdawn/knacks').respond(knacksData);

        Knack = _Knack_;
    }));

    // Verify that there are no outstanding expectations or requests after each test
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch the knack data from `http://localhost:8080/earthdawn/knacks`', function() {
        var knack = Knack.query();

        expect(knack).toEqual([]);

        $httpBackend.flush();
        expect(knack).toEqual(knacksData);
    });
});