'use strict';

angular
    .module('core.knack')
    .factory('Knack', ['$resource',
        function($resource) {
            return $resource('http://localhost:8080/earthdawn/knacks', {}, {
                query: {
                    method: 'GET',
                    params: {talent_id: '@id'},
                    isArray: true
                }
            });
        }]);