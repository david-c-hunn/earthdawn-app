'use strict';

describe('talentList', function() {

  // Load the module that contains the `talentList` component before each test
  beforeEach(module('talentList'));

  // Test the controller
  describe('TalentListController', function() {
    var $httpBackend, ctrl;
    var talentsData = [{name: 'Melee Weapons'}, {name: 'Spellcasting'}];

    beforeEach(inject(function($componentController, _$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('http://localhost:8080/earthdawn/talents')
          .respond(talentsData);

      ctrl = $componentController('talentList');
    }));

    it('should create a `talents` property with 2 talents fetched with `$http`',
      function() {
        jasmine.addCustomEqualityTester(angular.equals);

        expect(ctrl.talents).toEqual([]);

        $httpBackend.flush();
        expect(ctrl.talents).toEqual(talentsData);
      });

    it('should set a default value for the `orderProp` property',
      function() { expect(ctrl.orderProp).toBe('name'); });
  });
});