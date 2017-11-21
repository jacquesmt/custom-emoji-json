/* global _, $ */
import Ember from 'ember';

const {
  computed,
  inject,
  observer
} = Ember;

export default Ember.Component.extend({
  classNames: ['emoji-json-upload'],
  fileContent: null,
  globalServices: inject.service('global-services'),

  actions: {
    fileLoaded: function(file) {
        // readAs="readAsFile"
        console.log(file.name, file.type, file.size);
        // readAs="readAsArrayBuffer|readAsBinaryString|readAsDataURL|readAsText"
        console.log(file.name, file.type, file.data, file.size);
        // There is also file.filename for backward compatibility
        this.set('fileContent', file.data);
        this.set('globalServices.importedJson', JSON.parse(file.data));
    },
    editEmojy: function () {
      console.log('JMT editing emoji.');
      this.get('router').transitionTo('main');
      // window.location.pathname ="/main";
    }
  },

  init: function () {
    this._super(...arguments);
    console.log('JMT Here is json upload component', this);
  }

});
