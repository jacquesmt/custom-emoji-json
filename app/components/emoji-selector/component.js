import Ember from 'ember';
import emojiJson from '../../utils/emojiJson';

export default Ember.Component.extend({
  classNames: ['emoji-selector'],
  emojiList: [],
  showPeopleList: false,
  showNatureList: false,
  showObjectsList: false,
  showPlacesList: false,
  showSymbolsList: false,

  actions: {
    toggleList(list) {
      switch (list) {
        case 'people':
          this.toggleProperty('showPeopleList');
          return;
        case 'nature':
          this.toggleProperty('showNatureList');
          return;
        case 'objects':
          this.toggleProperty('showObjectsList');
          return;
        case 'places':
          this.toggleProperty('showPlacesList');
          return;
        case 'symbols':
          this.toggleProperty('showSymbolsList');
          return;
      }
    }
  },

  init() {
    this._super(...arguments);
    this.set('emojiList', emojiJson);
  }
});
