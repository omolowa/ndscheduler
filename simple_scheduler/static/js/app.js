require.config({
  urlArgs: 'bust=' + cacheBuster,
  baseUrl: '/static/js',
  paths: {
    'jquery': 'vendor/jquery',
    'backbone': 'vendor/backbone',
    'underscore': 'vendor/underscore',
    'anypicker' : 'vendor/anypicker',
    'picker' : 'vendor/picker',
    'jobs-view': 'views/jobs/jobs-view',
    'mobileselect' : 'vendor/mobileselect',
    'jobs-collection': 'models/jobs'
  },

  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
    ,
    'mobileselect': {
      deps: ['jquery'],
      exports: 'MobileSelect'
    }

  }
});

require(['jobs-view',
  'jobs-collection',
  'backbone'], function(JobsView,
                        JobsCollection) {
  'use strict';

  var jobsCollection = new JobsCollection();

  new JobsView({
    collection: jobsCollection
  });

  //
  // Initialize URL router
  //
  var AppRouter = Backbone.Router.extend({
    routes: {
      'jobs': 'jobsRoute',
      'jobs/:jid': 'jobsRoute',
      '*actions': 'defaultRoute'
    }
  });

  var switchTab = function(switchTo) {
    var pages = ['jobs', 'executions', 'logs'];
    _.each(pages, function(page) {
      $('#' + page + '-page-sidebar').hide();
      $('#' + page + '-page-content').hide();
      $('#' + page + '-tab').removeClass();
    });
    $('#' + switchTo + '-page-sidebar').show();
    $('#' + switchTo + '-page-content').show();
    $('#' + switchTo + '-tab').addClass('active');
  };

  var appRouter = new AppRouter;
  appRouter.on('route:jobsRoute', function(jobId) {
    switchTab('jobs');
    if (jobId) {
      jobsCollection.getJob(jobId);
    } else {
      jobsCollection.getJobs();
    }
  });

  appRouter.on('route:defaultRoute', function(actions) {
    // Anything else defaults to jobs view
    switchTab('jobs');
    jobsCollection.getJobs();
  });

  Backbone.history.start();
});
