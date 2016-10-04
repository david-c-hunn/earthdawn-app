'use strict';

// Register `talentList` component, along with its associated controller and
// template
angular.module('talentList').component('talentList', {
  templateUrl: 'talent-list/talent-list.template.html',
  controller: [
    'Talent', 'Knack',
    function TalentListController(Talent, Knack) {
      var self = this;
      self.talents = Talent.query();
      self.talentOrder = 'name';
      self.knackOrder = 'rank';
      self.talents.forEach(function(talent, index, array) {
        talent.expanded = false;
      });

      self.toggleExpanded = function(talent) {
        talent.expanded = !talent.expanded;
        if (!talent.knacks) {
          self.queryKnacks(talent);
        }
      };

      self.queryKnacks = function(talent) {
        talent.knacks = Knack.query({talent_id: talent._id});
      };
    }
  ]
});