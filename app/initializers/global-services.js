import EmojiService from '../services/global-services';

export function initialize(application) {
  application.register('service:application', EmojiService, {singleton: true, initialize: true});
  application.inject('controller', 'applicationService', 'service:application');
  application.inject('route', 'applicationService', 'service:application');
  application.inject('component', 'applicationService', 'service:application');
  application.inject('model', 'applicationService', 'service:application');
}

export default {
  name: 'application',
  initialize
};
