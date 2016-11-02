'use strict';

// Register `dieRoller` component, along with its associated controller and
// template
angular.module('roller').component('roller', {
    templateUrl: 'roller/roller.template.html',
    controller: [function RollerController(Random) {
        var steps = {
            'Step 4': [6],
            'Step 5': [8],
            'Step 6': [10],
            'Step 7': [12],
            'Step 8': [6, 6],
            'Step 9': [6, 8],
            'Step 10': [8, 8],
            'Step 11': [8, 10],
            'Step 12': [10, 10],
            'Step 13': [10, 12],
            'Step 14': [12, 12],
            'Step 15': [12, 6, 6],
            'Step 16': [12, 8, 6],
            'Step 17': [12, 8, 8],
            'Step 18': [12, 10, 8],
            'Step 19': [12, 10, 10],
            'Step 20': [12, 12, 10],
            'Step 21': [12, 12, 12]
        };
        this.stepOptions = [
            'Step 4', 'Step 5', 'Step 6', 'Step 7', 'Step 8', 'Step 9',
            'Step 10', 'Step 11', 'Step 12', 'Step 13', 'Step 14', 'Step 15',
            'Step 16', 'Step 17', 'Step 18', 'Step 19', 'Step 20', 'Step 21'
        ];
        this.step = 'Step 13';
        var self = this;

        var viewContainer =
            document.getElementsByClassName('view-container')[0];
        viewContainer.style.padding = 0;

        var form = document.getElementById('stepForm');
        form.style.paddingLeft = '1em';
        form.style.paddingRight = '1em';

        var rollerDiv = document.getElementById('roller');
        rollerDiv.style.height = Math.floor(window.innerHeight * 0.8) + 'px';
        var r = new Roller(rollerDiv);

        steps[this.step].forEach(function(sides, index, array) {
            r.addDie(sides);
        });

        var x, y;
        // disable scrolling when touching the rolling canvas
        rollerDiv.addEventListener(
            'ontouchstart', function(e) { e.preventDefault() }, false);
        rollerDiv.addEventListener(
            'ontouchmove', function(e) { e.preventDefault() }, false);

        rollerDiv.addEventListener('mousedown', function(e) {
            x = e.clientX;
            y = e.clientY;
        }, false);

        rollerDiv.addEventListener('mouseup', function(e) {
            var direction = {};
            direction.y = e.clientX - x;
            direction.x = e.clientY - y;

            r.throwDice(direction).then(function() { console.log(r.result); });
        }, false);

        rollerDiv.addEventListener('touchstart', function(e) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }, false);

        rollerDiv.addEventListener('touchend', function(e) {
            var direction = {};
            direction.y = e.changedTouches[0].clientX - x;
            direction.x = e.changedTouches[0].clientY - y;

            r.throwDice(direction).then(function() { console.log(r.result); });
        }, false);

        this.onStepChanged = function() {
            r.clearDice();
            steps[self.step].forEach(function(sides, index, array) {
                r.addDie(sides);
            });
        }
    }]
});