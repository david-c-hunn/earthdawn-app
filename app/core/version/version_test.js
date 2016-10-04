'use strict';

describe('earthdawnApp.version module', function() {
  beforeEach(module('earthdawnApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
