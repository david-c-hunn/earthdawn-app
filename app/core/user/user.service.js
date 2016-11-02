'use strict';

angular
  .module('core.user').factory('User', function() {
    var user = {
      name: 'Stranger'
    };
    return user;
});