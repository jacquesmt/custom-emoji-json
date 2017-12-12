import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['emoji-listing'],
  emojiList: null,
  showList: null,
  actions: {
    toggleList() {
      this.toggleProperty('showList');
    },
    findEmoji(code) {
      this.sendAction('action', code);
    }
  },

  init() {
    this._super(...arguments);
    this.set('emojiList', []);
  }
});
