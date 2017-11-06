import Ember from 'ember';
import emojiJson from '../../utils/emojiJson';

export default Ember.Component.extend({
  classNames: ['emoji-selector'],
  emojiList: [],
  init() {
    this._super(...arguments);
    this.set('emojiList', emojiJson);
  }
});
