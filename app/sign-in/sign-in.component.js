'use strict';

// Register `signin` component, along with its associated controller
// and template
angular.module('signIn').component('signIn', {
    templateUrl: 'sign-in/sign-in.template.html',
    controller: [
        'User',
        function SignInController(User) {
            var self = this;
            self.name = User.name;

            function onSuccess(googleUser) {
                console.log(
                    'Logged in as: ' + googleUser.getBasicProfile().getName());
                User.name = googleUser.getBasicProfile().getName();
                self.name = googleUser.getBasicProfile().getName();
            }
            function onFailure(error) { console.log(error); }

            gapi.signin2.render('my-signin2', {
                'scope': 'profile email',
                'width': 240,
                'height': 50,
                'longtitle': true,
                'theme': 'dark',
                'onsuccess': onSuccess,
                'onfailure': onFailure
            });
        }
    ]
});