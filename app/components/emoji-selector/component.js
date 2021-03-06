/* global _, $ */
import Ember from 'ember';
import emojiJsonMain from '../../utils/emojiJson';
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver';

const {
  computed,
  inject,
  observer,
  run
} = Ember;

export default Ember.Component.extend(FileSaverMixin, {
  classNameBindings: ['emptySearchResult'],
  classNames: ['emoji-selector'],
  application: inject.service(),

  emojiList: null,

  showPeopleList: false,
  showNatureList: false,
  showObjectsList: false,
  showPlacesList: false,
  showSymbolsList: false,
  emojiJsonToExport: null,
  textInput: null,
  textSearch: null,
  fileName: 'emoji-generated.json',
  contentType: "text/plain; charset=utf-8",
  emojiJson: null,

  startIndex: 0,
  totalEmojiCount: computed(function (){
    return emojiJsonMain.length;
  }),

  pageSize: 500,
  currentPage:1,

  actions: {
    clearSearch() {
      this.set('application.waitTimerOn', true);
      let input = this.$('.emoji-search');
      input.val('');
      this.get('actions').handlePageChange.call(this, 1);
      run.next(this, function() {
        this.set('textSearch', null);
      });
    },

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

    findEmoji(code) {
      this.performAutoSearch(code, 0);
    },

    generateJson() {
      this.generateJson();
    },

    handlePageChange(page) {
      this.set('application.waitTimerOn', true);
      run.next(this, function () {
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

      });
    }
  },

  goToPage(page, searchKey) {
      this.get('actions').handlePageChange.call(this, page);
      run.next(this, this.performAutoSearch, searchKey);
  },

  performAutoSearch(searchKey, page) {

    page = (page === undefined || page === null)? this.get('currentPage') : page;

    this.set('textSearch', searchKey);

    if (this.get('filteredSearch.length') > 0 || page >= this.get('numberOfPages.length')) {
      return;
    }

    this.goToPage(page+1, searchKey);
  },

  textInputTrigger: observer('textInput', function() {
    const searchKey = this.get('textInput');
    run.debounce(this, function () {
      this.performAutoSearch(searchKey, 0);
    }, 50);
  }),

  sourceName: computed('application.sourceName', function () {
    if (this.get('application.sourceName')) {
      return this.get('application.sourceName');
    } else {
      return 'Emoji List V5';
    }
  }),

  peopleList: computed('emojiList.@each.category','peopleListBackup.@each.category', function () {
    const fromMainList =  _.filter(this.get('emojiList'), emoji => emoji.category === 'people');
    const fromBackup =  _.filter(this.get('peopleListBackup'), emoji => emoji.category === 'people');
    return _.uniq([].concat(fromBackup, fromMainList));
  }),
  peopleListBackup: null,

  natureList: computed('emojiList.@each.category', 'natureListBackup.@each.category', function () {
    const fromMainList =  _.filter(this.get('emojiList'), emoji => emoji.category === 'nature');
    const fromBackup =  _.filter(this.get('natureListBackup'), emoji => emoji.category === 'nature');

    return _.uniq([].concat(fromBackup, fromMainList));
  }),
  natureListBackup: null,

  objectsList: computed('emojiList.@each.category', 'objectsListBackup.@each.category', function () {
    const fromMainList =  _.filter(this.get('emojiList'), emoji => emoji.category === 'objects');
    const fromBackup =  _.filter(this.get('objectsListBackup'), emoji => emoji.category === 'objects');

    return _.uniq([].concat(fromBackup, fromMainList));
  }),
  objectsListBackup: null,

  placesList: computed('emojiList.@each.category', 'placesListBackup.@each.category', function () {
    const fromMainList =  _.filter(this.get('emojiList'), emoji => emoji.category === 'places');
    const fromBackup =  _.filter(this.get('placesListBackup'), emoji => emoji.category === 'places');

    return _.uniq([].concat(fromBackup, fromMainList));
  }),
  placesListBackup: null,

  symbolsList: computed('emojiList.@each.category', 'symbolsListBackup.[]', function () {
    const fromMainList =  _.filter(this.get('emojiList'), emoji => emoji.category === 'symbols');
    const fromBackup =  _.filter(this.get('symbolsListBackup'), emoji => emoji.category === 'symbols');

    return _.uniq([].concat(fromBackup, fromMainList));
  }),
  symbolsListBackup: null,

  numberOfPages: computed('pageSize', 'emojiJson.length', function() {
    const totalCount = this.get('emojiJson.length') || 0;
    const pageSize = this.get('pageSize');
    return new Array(Math.ceil(totalCount/pageSize));
  }),

  generateJson() {
    const jsonToExport = {};
    const jsonToImport = {};

    jsonToExport.people = _.map(this.get('peopleList'), item => item.char);
    jsonToExport.nature = _.map(this.get('natureList'), item => item.char);
    jsonToExport.objects = _.map(this.get('objectsList'), item => item.char);
    jsonToExport.places = _.map(this.get('placesList'), item => item.char);
    jsonToExport.symbols = _.map(this.get('symbolsList'), item => item.char);

    jsonToImport.people = this.get('peopleList');
    jsonToImport.nature = this.get('natureList');
    jsonToImport.objects = this.get('objectsList');
    jsonToImport.places = this.get('placesList');
    jsonToImport.symbols = this.get('symbolsList');

    this.set('emojiJsonToExport', {jsonToExport, jsonToImport});

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

  setEmojiList: observer('startIndex', 'emojiJson', function () {
    const endPosition = this.get('currentPage') * this.get('pageSize');
    this.set('emojiList', _.slice(this.get('emojiJson'), this.get('startIndex') - 1, endPosition));
  }).on('init'),

  syncFromImported() {
    const imported = this.get('application.importedJsonConverted');
    _.forEach(imported, (emoji) => {
      const itemToUpdate = _.find(this.get('emojiJson'), {no: emoji.no});
      if (itemToUpdate) {
        const category = Ember.get(emoji,'category');
        Ember.set(itemToUpdate, 'category', category);
        switch (category) {
          case 'people':
              this.get('peopleListBackup').pushObject(itemToUpdate);
              return;
          case 'nature':
              this.get('natureListBackup').pushObject(itemToUpdate);
              return;
          case 'places':
              this.get('placesListBackup').pushObject(itemToUpdate);
              return;
          case 'objects':
              this.get('objectsListBackup').pushObject(itemToUpdate);
              return;
          case 'symbols':
              this.get('symbolsListBackup').pushObject(itemToUpdate);
              return;
          default:
              return;
        }
      }
    });
  },

  init() {
    this._super(...arguments);

    // this.set('application.waitTimerOn', true);

    // Ember.run.schedule('afterRender', () => {
    //   this.set('application.waitTimerOn', false);
    // });

    this.set('emojiJsonToExport', []);
    this.set('peopleListBackup', []);
    this.set('natureListBackup', []);
    this.set('objectsListBackup', []);
    this.set('placesListBackup', []);
    this.set('symbolsListBackup', []);
    this.set('emojiJson', []);
    this.set('emojiList', []);

    if (this.get('application.hasImportedJson')) {
      this.set('emojiJson', emojiJsonMain);
      this.syncFromImported();
    } else {
      this.set('emojiJson', emojiJsonMain);
    }

    this.initCategory();
    this.setStartIndex();
    console.log('JMT - Reference to component =>', this);
    console.log('JMT - Reference to emojiJson', this.get('emojiJson'));
  },

  didRender() {
    this.set('application.waitTimerOn', false);
  },

  initCategory() {
    if (this.get('emojiJson')) {
      this.get('emojiJson').forEach(emojiItem => {
        if (!Ember.get(emojiItem, 'category')) {
          Ember.set(emojiItem, 'category', 'null');
        }
      });
    }
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
