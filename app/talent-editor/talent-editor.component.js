'use strict';

// Register `talentEditor` component, along with its associated controller and
// template
angular.module('talentEditor').component('talentEditor', {
  templateUrl: 'talent-editor/talent-editor.template.html',
  controller: [
    'Talent', 'Knack', '$scope', '$routeParams',
    function TalentEditorController(Talent, Knack, $scope, $routeParams) {
      var self = this;
      self.talent = Talent.get({ id: $routeParams.talentId }, function () {
        console.log(self.talent.strain);
      });

      self.step = 'Rank';

      self.stepOptions = [
        'Rank', 
        'Rank + DEX', 
        'Rank + STR',
        'Rank + TOU',
        'Rank + PER',
        'Rank + WIL',
        'Rank + CHA'
      ];
      
      self.actionOptions = [
        'NA', 
        'Free', 
        'Simple',
        'Standard',
        'Sustained'
      ];
      
      self.karmaOptions = [true, false];

      self.strainOptions = ['0', '1', '2', '3', '4', '5'];

    }
  ]
});