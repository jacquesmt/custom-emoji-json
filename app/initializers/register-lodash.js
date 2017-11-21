/* global _ */

export function initialize(application) {
  // application.inject('route', 'foo', 'service:foo');
  // application.register('lodash:main', _, {instantiate: false});
  // application.inject('service:global-services', '_', 'lodash:main');
}

export default {
  name: 'register-lodash',
  initialize
};
