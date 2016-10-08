'use strict';

// Register `spellList` component along with its associated controller and 
// template
angular.module('spellList').component('spellList', {
  templateUrl: 'spell-list/spell-list.template.html',
  controller: [
    'Spell',
    function SpellListController(Spell) {
      var self = this;
      self.showSpinner = true;
      self.spells = Spell.query(function () {
        self.showSpinner = false;
      });
      self.spellOrder = ['discipline', 'circle', 'name'];
      
      self.spells.forEach(function (spell, index, array) {
        spell.expanded = false;
      });

      self.toggleExpanded = function (spell) {
        spell.expanded = !spell.expanded;
      }
    }
  ]
});