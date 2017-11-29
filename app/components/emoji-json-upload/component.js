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
  application: inject.service(),

  actions: {
    fileLoaded: function(file) {
        // readAs="readAsFile"
        console.log(file.name, file.type, file.size);
        // readAs="readAsArrayBuffer|readAsBinaryString|readAsDataURL|readAsText"
        console.log(file.name, file.type, file.data, file.size);
        // There is also file.filename for backward compatibility
        this.set('fileContent', file.data);
        this.set('application.sourceName', file.name);
        this.set('application.importedJson', JSON.parse(file.data));
    },
    editEmojy: function () {
      this.set('application.waitTimerOn', true);
      Ember.run.next(this, function () {
        this.get('router').transitionTo('main');
      });
    }
  },

  init: function () {
    this._super(...arguments);
    console.log('JMT Here is json upload component', this);
  }

});
