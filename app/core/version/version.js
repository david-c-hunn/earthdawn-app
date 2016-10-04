'use strict';

angular.module('earthdawnApp.version', [
  'earthdawnApp.version.interpolate-filter',
  'earthdawnApp.version.version-directive'
])

.value('version', '0.1');
