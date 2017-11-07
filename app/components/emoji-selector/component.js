import Ember from 'ember';
import emojiJson from '../../utils/emojiJson';

const {
  computed,
} = Ember;

export default Ember.Component.extend({
  classNames: ['emoji-selector'],
  emojiList: null,

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

  peopleList: computed.filterBy('emojiList', 'category', 'people'),
  natureList: computed.filterBy('emojiList', 'category', 'nature'),
  objectsList: computed.filterBy('emojiList', 'category', 'objects'),
  placesList: computed.filterBy('emojiList', 'category', 'places'),
  symbolsList: computed.filterBy('emojiList', 'category', 'symbols'),

  totalCount: computed('peopleList.length', 'natureList.length', 'objectsList.length', 'placesList.length', 'symbolsList.length', function () {
    return this.get('peopleList.length') + this.get('natureList.length') + this.get('objectsList.length') + this.get('placesList.length') + this.get('symbolsList.length');
  }),

  init() {
    this._super(...arguments);
    this.set('emojiList', emojiJson);
    this.initCategory();
    console.log('JMT REference to component =>', this);
  },

  initCategory() {
    this.get('emojiList').forEach(emojiItem => {
      if (!Ember.get(emojiItem, 'category')) {
        Ember.set(emojiItem, 'category', 'null');
      }
    });
  },

});
