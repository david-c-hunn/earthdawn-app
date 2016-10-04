'use strict';

angular.module('core.spell').factory('Spell', [
    '$resource',
    function($resource) {
        return $resource('http://localhost:8080/earthdawn/spells/:id', {}, {});
    }
]);