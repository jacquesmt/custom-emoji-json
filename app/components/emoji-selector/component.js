/* global _, $ */
import Ember from 'ember';
import emojiJson from '../../utils/emojiJson';
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver';

const {
  computed,
  inject,
  observer
} = Ember;

export default Ember.Component.extend(FileSaverMixin, {
  classNameBindings: ['emptySearchResult'],
  classNames: ['emoji-selector'],
  globalServices: inject.service(),

  emojiList: null,

  showPeopleList: false,
  showNatureList: false,
  showObjectsList: false,
  showPlacesList: false,
  showSymbolsList: false,
  emojiJsonToExport: null,
  textSearch: null,
  fileName: 'emoji-generated.json',
  contentType: "text/plain; charset=utf-8",

  startIndex: 0,
  totalEmojiCount: emojiJson.length,

  pageSize: 500,
  currentPage:1,

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
    },

    handlePageChange(page) {
      this.performCategoryListBackup();
      let newPage;
      if (page === 'prev') {
        newPage = this.get('currentPage') - 1;
        if (newPage > 0) {
          this.set('currentPage', newPage);
        } else {
          this.set('currentPage', 1);
        }
      } else if (page === 'next') {
        newPage = this.get('currentPage') + 1;
        if (newPage < this.get('numberOfPages.length')) {
          this.set('currentPage', newPage);
        } else {
          this.set('currentPage', this.get('numberOfPages.length'));
        }
      } else {
        this.set('currentPage', page);
      }

      this.setStartIndex();
      $('.emoji-list').scrollTop(0);

      console.log('Current page is', page);
      console.log('Start index is ', this.get('startIndex'));
    }
  },

  peopleList: computed('emojiList.@each.category', function () {
    const fromMainList =  _.filter(this.get('emojiList'), emoji => emoji.category === 'people');
    const fromBackup = this.get('peopleListBackup');

    return _.uniq([].concat(fromBackup, fromMainList));
  }),
  peopleListBackup: null,

  natureList: computed('emojiList.@each.category', function () {
    const fromMainList =  _.filter(this.get('emojiList'), emoji => emoji.category === 'nature');
    const fromBackup = this.get('natureListBackup');

    return _.uniq([].concat(fromBackup, fromMainList));
  }),
  natureListBackup: null,

  objectsList: computed('emojiList.@each.category', function () {
    const fromMainList =  _.filter(this.get('emojiList'), emoji => emoji.category === 'objects');
    const fromBackup = this.get('objectsListBackup');

    return _.uniq([].concat(fromBackup, fromMainList));
  }),
  objectsListBackup: null,

  placesList: computed('emojiList.@each.category', function () {
    const fromMainList =  _.filter(this.get('emojiList'), emoji => emoji.category === 'places');
    const fromBackup = this.get('placesListBackup');

    return _.uniq([].concat(fromBackup, fromMainList));
  }),
  placesListBackup: null,

  symbolsList: computed('emojiList.@each.category', function () {
    const fromMainList =  _.filter(this.get('emojiList'), emoji => emoji.category === 'symbols');
    const fromBackup = this.get('symbolsListBackup');

    return _.uniq([].concat(fromBackup, fromMainList));
  }),
  symbolsListBackup: null,

  numberOfPages: computed('pageSize', function() {
    const totalCount = emojiJson.length;
    const pageSize = this.get('pageSize');
    return new Array(Math.ceil(totalCount/pageSize));
  }),

  generateJson() {
    const jsonToExport = {};

    jsonToExport.people = _.map(this.get('peopleList'), item => item.char);
    jsonToExport.nature = _.map(this.get('natureList'), item => item.char);
    jsonToExport.objects = _.map(this.get('objectsList'), item => item.char);
    jsonToExport.places = _.map(this.get('placesList'), item => item.char);
    jsonToExport.symbols = _.map(this.get('symbolsList'), item => item.char);

    this.set('emojiJsonToExport', jsonToExport);

    console.log('Exporting emoji JSON', this.get('emojiJsonToExport'));

    const content = JSON.stringify(this.get('emojiJsonToExport'));
    this.saveFileAs(this.get('fileName'), content, this.get('contentType'));
  },

  totalSelectedCount: computed('peopleList.length', 'natureList.length', 'objectsList.length', 'placesList.length', 'symbolsList.length', function () {
    return this.get('peopleList.length') + this.get('natureList.length') + this.get('objectsList.length') + this.get('placesList.length') + this.get('symbolsList.length');
  }),

  filteredSearch: computed('emojiList', 'textSearch', function () {
    if (_.isEmpty(this.get('textSearch'))) {
      return this.get('emojiList');
    }
    const searchText = this.get('textSearch');
    return _.filter(this.get('emojiList'), (emoji) => {
      const evaluate = (emoji.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0 ||
        (emoji.no+"").toLowerCase().indexOf(searchText.toLowerCase()) >= 0 ||
        emoji.char.toLowerCase().indexOf(searchText.toLowerCase()) >= 0 ||
        emoji.code.toLowerCase().indexOf(searchText.toLowerCase()) >= 0);
      return evaluate;
    });
  }),

  emptySearchResult: computed.equal('filteredSearch.length', 0),

  setEmojiList: observer('startIndex', function () {
    const endPosition = this.get('currentPage') * this.get('pageSize');
    this.set('emojiList', _.slice(emojiJson, this.get('startIndex') - 1, endPosition));
  }).on('init'),

  init() {
    this._super(...arguments);
    this.set('emojiJsonToExport', []);
    this.set('peopleListBackup', []);
    this.set('natureListBackup', []);
    this.set('objectsListBackup', []);
    this.set('placesListBackup', []);
    this.set('symbolsListBackup', []);

    this.initCategory();
    this.setStartIndex();
    console.log('JMT Reference to component =>', this);
    console.log('JMT Reference to emojiJson', emojiJson);
  },

  initCategory() {
    emojiJson.forEach(emojiItem => {
      if (!Ember.get(emojiItem, 'category')) {
        Ember.set(emojiItem, 'category', 'null');
      }
    });
  },

  setStartIndex() {
    const currentPage = this.get('currentPage');
    const pageSize = this.get('pageSize');
    this.set('startIndex', 1 + (pageSize * (currentPage-1)));
  },

  performCategoryListBackup() {
    this.set('peopleListBackup', this.get('peopleList'));
    this.set('natureListBackup', this.get('natureList'));
    this.set('objectsListBackup', this.get('objectsList'));
    this.set('placesListBackup', this.get('placesList'));
    this.set('symbolsListBackup', this.get('symbolsList'));
  }

});
