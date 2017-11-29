import Ember from 'ember';

export default Ember.Controller.extend({
    application: Ember.inject.service(),

    actions: {
        loadEmojiList() {
          this.set('application.waitTimerOn', true);
          Ember.run.next(this, function () {
            this.get('router').transitionTo('main');
          });
        }
    }
});
