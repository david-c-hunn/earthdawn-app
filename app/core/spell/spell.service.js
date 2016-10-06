'use strict';

var spellsURI = 'https://earthdawn-api.herokuapp.com/earthdawn/spells/:id';
    
// 'http://localhost:5000/earthdawn/spells/:id';

angular.module('core.spell').factory('Spell', [
    '$resource', function($resource) { return $resource(spellsURI, {}, {}); }
]);