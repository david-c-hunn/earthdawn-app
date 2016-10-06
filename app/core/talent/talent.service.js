'use strict';

var talentsURI = 'https://earthdawn-api.herokuapp.com/earthdawn/talents/:id';

// 'http://localhost:5000/earthdawn/talents/:id';

angular.module('core.talent').factory('Talent', [
    '$resource', function($resource) { return $resource(talentsURI, {}, {}); }
]);