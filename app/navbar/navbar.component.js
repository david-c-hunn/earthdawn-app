'use strict';

// Register `navbar` component, along with its associated controller and
// template
angular.module('navbar').component('navbar', {
    templateUrl: 'navbar/navbar.template.html',
    controller: [function NavbarController() {
        this.isNavCollapsed = true;
        var self = this;

        this.toggleNavCollapsed = function() {
            self.isNavCollapsed = !self.isNavCollapsed
        }
    }]
});