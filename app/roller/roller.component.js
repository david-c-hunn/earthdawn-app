'use strict';

// Register `dieRoller` component, along with its associated controller and
// template
angular.module('roller').component('roller', {
    templateUrl: 'roller/roller.template.html',
    controller: ['$scope', function RollerController($scope) {
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
            'Step 21': [12, 12, 12],
            'Step 22': [12, 12, 6, 6],
            'Step 23': [12, 12, 8, 6],
            'Step 24': [12, 12, 8, 8],
            'Step 25': [12, 12, 10, 8],
            'Step 26': [12, 12, 10, 10],
            'Step 27': [12, 12, 12, 10],
            'Step 28': [12, 12, 12, 12],
            'Step 29': [12, 12, 12, 6, 6],
            'Step 30': [12, 12, 12, 8, 6],
            'Step 31': [12, 12, 12, 8, 8],
            'Step 32': [12, 12, 12, 10, 8],
            'Step 33': [12, 12, 12, 10, 10],
            'Step 34': [12, 12, 12, 12, 10],
            'Step 35': [12, 12, 12, 12, 12],
            'Step 36': [12, 12, 12, 12, 6, 6],
            'Step 37': [12, 12, 12, 12, 8, 6],
            'Step 38': [12, 12, 12, 12, 8, 8],
            'Step 39': [12, 12, 12, 12, 10, 8],
            'Step 40': [12, 12, 12, 12, 10, 10]
        };
        this.stepOptions = [
            'Step 4',  'Step 5',  'Step 6',  'Step 7',  'Step 8',  'Step 9',
            'Step 10', 'Step 11', 'Step 12', 'Step 13', 'Step 14', 'Step 15',
            'Step 16', 'Step 17', 'Step 18', 'Step 19', 'Step 20', 'Step 21',
            'Step 22', 'Step 23', 'Step 24', 'Step 25', 'Step 26', 'Step 27',
            'Step 28', 'Step 29', 'Step 30', 'Step 31', 'Step 32', 'Step 33',
            'Step 34', 'Step 35', 'Step 36', 'Step 37', 'Step 38', 'Step 39',
            'Step 40'
        ];
        this.step = 'Step 13';
        var self = this;
        this.result = [];

        self.setResult = function(val) {
            self.result.unshift(val);
            $scope.$apply();
        }

        var viewContainer =
            document.getElementsByClassName('view-container')[0];
        viewContainer.style.padding = 0;

        var form = document.getElementById('step-form');
        form.style.paddingLeft = '1em';
        form.style.paddingRight = '1em';

        var rollerDiv = document.getElementById('roller');
        rollerDiv.style.height = Math.floor(window.innerHeight * 0.80) + 'px';

        var r = new Roller(rollerDiv);

        steps[this.step].forEach(function(sides, index, array) {
            r.addDie(sides);
        });
        r.throwDice({x: 1, y: 1});

        self.stringifyResult = function(index) {
            var str = '';
            var total = 0;

            self.result[index].forEach(function (die, index, array) {
                if (index > 0) {
                    str += ' + ';
                }
                str += 'D' + die.sides + ': ' + die.result;
                total += die.result;
            });
            str += ' = ' + total;

            return str;
        }


        var x, y;

        // disable scrolling when touching the rolling canvas
        rollerDiv.addEventListener(
            'touchmove', function(e) { e.preventDefault() }, false);

        rollerDiv.addEventListener('mousedown', function(e) {
            e.preventDefault();
            x = e.clientX;
            y = e.clientY;
        }, false);

        rollerDiv.addEventListener('mouseup', function(e) {
            e.preventDefault();

            var direction = {};

            direction.y = e.clientX - x;
            direction.x = e.clientY - y;

            console.log(direction);

            r.throwDice(direction).then(function() {
                if (!r.rolling) {
                    console.log(r.result);
                    self.setResult(r.result);
                }
            });
        }, false);

        rollerDiv.addEventListener('touchstart', function(e) {
            e.preventDefault();
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }, false);

        rollerDiv.addEventListener('touchend', function(e) {
            e.preventDefault();

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
            r.throwDice({x: 1, y: 1});
        }
    }]
});