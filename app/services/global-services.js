/* global _, $ */
import Ember from 'ember';

export default Ember.Service.extend({
  importedJson: null,
  importedJsonConverted: null,
  setImportedJsonConverted: Ember.observer('importedJson.jsonToImport', function () {
    const result =  [].concat(this.get('importedJson.jsonToImport.people')|| [],
                     this.get('importedJson.jsonToImport.nature')|| [],
                     this.get('importedJson.jsonToImport.objects')|| [],
                     this.get('importedJson.jsonToImport.places')|| [],
                     this.get('importedJson.jsonToImport.symbols')|| []);
    this.set('importedJsonConverted', result);
    console.log('Reference from Service - setting importedJsonConverted', result);
  }).on('init'),
  hasImportedJson: Ember.computed.bool('importedJson'),
  init: function () {
    console.log("Reference to Global Service", this);
  }
});
