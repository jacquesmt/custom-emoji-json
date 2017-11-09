import Ember from 'ember';
import emojiJson from '../../utils/emojiJson';
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver';

const {
  computed,
} = Ember;

export default Ember.Component.extend(FileSaverMixin, {
  classNameBindings: ['emptySearchResult'],
  classNames: ['emoji-selector'],
  emojiList: null,

  showPeopleList: false,
  showNatureList: false,
  showObjectsList: false,
  showPlacesList: false,
  showSymbolsList: false,
  emojiJsonToExport: null,
  textSearch: null,

  startIndex: 0,
  endIndex: emojiJson.length,

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
    },
    generateJson() {
      this.generateJson();
    }
  },

  peopleList: computed.filterBy('emojiList', 'category', 'people'),
  natureList: computed.filterBy('emojiList', 'category', 'nature'),
  objectsList: computed.filterBy('emojiList', 'category', 'objects'),
  placesList: computed.filterBy('emojiList', 'category', 'places'),
  symbolsList: computed.filterBy('emojiList', 'category', 'symbols'),
  fileName: 'emoji-generated.json',
  contentType: "text/plain; charset=utf-8",

  generateJson() {
    const jsonToExport = {};

    jsonToExport.people = _.map(this.get('emojiList').filter((item) => {
      if (Ember.get(item, 'category') === 'people') {
        return Ember.get(item, 'char');
      }
    }), 'char');

    jsonToExport.nature = _.map(this.get('emojiList').filter((item) => {
      if (Ember.get(item, 'category') === 'nature') {
        return Ember.get(item, 'char');
      }
    }), 'char');

    jsonToExport.objects = _.map(this.get('emojiList').filter((item) => {
      if (Ember.get(item, 'category') === 'objects') {
        return Ember.get(item, 'char');
      }
    }), 'char');

    jsonToExport.places = _.map(this.get('emojiList').filter((item) => {
      if (Ember.get(item, 'category') === 'places') {
        return Ember.get(item, 'char');
      }
    }), 'char');

    jsonToExport.symbols = _.map(this.get('emojiList').filter((item) => {
      if (Ember.get(item, 'category') === 'symbols') {
        return Ember.get(item, 'char');
      }
    }), 'char');

    this.set('emojiJsonToExport', jsonToExport);

    console.log('Exporting emoji JSON', this.get('emojiJsonToExport'));

    const content = JSON.stringify(this.get('emojiJsonToExport'));
    this.saveFileAs(this.get('fileName'), content, this.get('contentType'));
  },

  totalCount: computed('peopleList.length', 'natureList.length', 'objectsList.length', 'placesList.length', 'symbolsList.length', function () {
    return this.get('peopleList.length') + this.get('natureList.length') + this.get('objectsList.length') + this.get('placesList.length') + this.get('symbolsList.length');
  }),

  filteredSearch: computed('emojiList', 'textSearch', function () {
    if (_.isEmpty(this.get('textSearch'))) {
      return this.get('emojiList');
    }
    const searchText = this.get('textSearch');
    return _.filter(this.get('emojiList'), (emoji) => {
      return  emoji.name.indexOf(searchText) >= 0;
    });
  }),

  emptySearchResult: computed.equal('filteredSearch.length', 0),

  init() {
    this._super(...arguments);
    this.set('emojiList', _.slice(emojiJson, 1, 500));
    // this.set('emojiList', emojiJson);
    this.set('emojiJsonToExport', []);
    this.initCategory();
    console.log('JMT Reference to component =>', this);
    console.log('JMT Reference to emojiJson', emojiJson);
  },

  initCategory() {
    this.get('emojiList').forEach(emojiItem => {
      if (!Ember.get(emojiItem, 'category')) {
        Ember.set(emojiItem, 'category', 'null');
      }
    });
  },

});
