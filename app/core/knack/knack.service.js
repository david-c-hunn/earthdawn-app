'use strict';

var knacksURI = 'https://earthdawn-api.herokuapp.com/earthdawn/knacks';
    
// 'http://localhost:5000/earthdawn/knacks';

angular.module('core.knack').factory('Knack', [
    '$resource',
    function($resource) {
        return $resource(knacksURI, {}, {
            query: {method: 'GET', params: {talent_id: '@id'}, isArray: true}
        });
    }
]);