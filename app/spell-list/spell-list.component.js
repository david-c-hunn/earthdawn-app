'use strict';

// Register `spellList` component along with its associated controller and
// template
angular.module('spellList').component('spellList', {
    templateUrl: 'spell-list/spell-list.template.html',
    controller: [
        'Spell',
        function SpellListController(Spell) {
            var viewContainer = document.getElementsByClassName('view-container')[0];
            viewContainer.style.paddingLeft = '1em';
            viewContainer.style.paddingRight = '1em';

            var self = this;
            self.showSpinner = true;
            self.spells = Spell.query(function() { self.showSpinner = false; });
            self.spellOrder = ['discipline', 'circle', 'name'];

            self.spells.forEach(function(spell, index, array) {
                spell.expanded = false;
            });

            self.toggleExpanded = function(spell) {
                spell.expanded = !spell.expanded;
            }
        }
    ]
});