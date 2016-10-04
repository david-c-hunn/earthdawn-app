'use strict';

angular.module('core.talent').factory('Talent', [
    '$resource',
    function($resource) {
        return $resource(
            'http://localhost:8080/earthdawn/talents/:id', {}, {});
    }
]);