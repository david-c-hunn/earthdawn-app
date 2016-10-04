'use strict';

// Register `navbar` component, along with its associated controller and
// template
angular.module('navbar').component('navbar', {
    templateUrl: 'navbar/navbar.template.html',
    controller: [function NavbarController() {
        this.isNavCollapsed = true;
        // this.isCollapsed = false;
        // this.isCollapsedHorizontal = false;
        var self = this;

        this.toggleNavCollapsed = function() {
            console.log('nav bar button clicked!')
            self.isNavCollapsed = !self.isNavCollapsed
        }
    }]
});