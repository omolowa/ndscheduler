/**
 * Configurations / constants
 *
 */

define([], function() {

  'use strict';

  var urlPrefix = '/api/v1';

  return {
    'jobs_url': urlPrefix + '/jobs',
    'scheduler_url': urlPrefix + '/scheduler'
  };
});
