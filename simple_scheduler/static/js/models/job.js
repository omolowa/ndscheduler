/**
 * Job Model
 *
 * @author wenbin@nextdoor.com
 */

require.config({
  paths: {
    'jquery': 'vendor/jquery',
    'underscore': 'vendor/underscore',
    'backbone': 'vendor/backbone',
    'moment': 'vendor/moment'
  },

  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});

define(['backbone', 'vendor/moment-timezone-with-data'], function(backbone, moment) {
  'use strict';

  return Backbone.Model.extend({

    /**
     * Returns schedule string for this job.
     *
     * @return {string} schedule string for this job.
     */
    getScheduleString: function() {

      var altresponse = '';
	    
      var iconstyle = (this.get('pub_args')[0] == 'off' ) ? 'fas':'far';

      return '<i class="' + iconstyle + ' fa-lightbulb fa-5x"></i>' + this.get('hour') + ':' + this.get('minute') + ', on ' + this.get('day_of_week');
    },

    getIcon: function () {

      var state = (this.get('pub_args')[0] == 'off' ) ? 'fas':'far';
      var icon = '<center><i class="' + state + ' fa-lightbulb fa-5x"></i></center>';

      return icon;
    },

     /**
     * Returns display string for this job.
     *
     * @return {string} display string for this job.
     */
    getDisplayString: function(oname) {

      var altresponse = '';
      
      var intro = '<div style="display:table-cell; vertical-align:bottom">';

      var name = '<h2>' + oname + '</h2>';
      var time = '<h5>' + ("0" + this.get('hour')).slice(-2) 
        + ':' 
        +  ("0" + this.get('minute')).slice(-2) 
        + ' on '
        + this.get('day_of_week')
        + '</h5>';
 
      var outro = '</div>';

      var theString =  intro + name + time + outro;

      return theString;

    },

    /**
     * Returns json string for arguments to run the job.
     *
     * @return {string} a json string for arguments to run this job.
     */
    getPubArgsString: function() {
      return JSON.stringify(this.get('pub_args'));
    },

    /**
     * Returns html string for next run time of this job.
     *
     * @return {string} html string for next run time of this job.
     */
    getNextRunTimeHTMLString: function() {
      var nextRunTime = this.get('next_run_time');
      var returnString = '';
      if (!nextRunTime) {
        returnString = '<span class="failed-color">Inactive</span>';
      } else {
        var tz = $('#display-tz').val();
        returnString = '<span class="success-color">' + moment().format('Z') + ': ' +
            moment(nextRunTime).format('MM/DD/YYYY HH:mm:ss') +
            '</span><br><span class="scheduled-color">UTC: ' +
            moment(nextRunTime).utc().format('MM/DD/YYYY HH:mm:ss') +
            '</span>';
      }
      return returnString;
    },

    /**
     * Returns string to indicate whether or not this job is active.
     *
     * @return {string} "yes" or "no".
     */
    getActiveString: function() {
      var nextRunTime = this.get('next_run_time');
      return nextRunTime ? 'yes' : 'no';
    }
  });
});
