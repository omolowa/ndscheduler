/**
 * edit-job view.
 *
 * @author wenbin@nextdoor.com
 */

require.config({
  paths: {
    'jquery': 'vendor/jquery',
    'underscore': 'vendor/underscore',
    'backbone': 'vendor/backbone',
    'bootstrap': 'vendor/bootstrap',
    'bootstrapswitch': 'vendor/bootstrap-switch',
    'anypicker' : 'vendor/anypicker',
    'utils': 'utils',

    'text': 'vendor/text',
    'edit-job-modal': 'templates/edit-job.html',
    'job-class-notes': 'templates/job-class-notes.html'
  },

  shim: {
    'bootstrapswitch': {
      deps: ['bootstrap']
    },

    'bootstrap': {
      deps: ['jquery']
    },

    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },

    'anypicker': {
      deps: ['jquery'],
      exports: 'AnyPicker'
    }
  }
});

define(['utils',
        'text!edit-job-modal',
        'text!job-class-notes',
        'backbone',
        'bootstrapswitch',
        'anypicker'], function(utils, EditJobModalHtml, JobClassNotesHtml) {

  'use strict';

  return Backbone.View.extend({
    initialize: function() {
      $('body').append(EditJobModalHtml);

      this.bindEditJobConfirmClickEvent();
      this.bindDeleteJobConfirmClickEvent();
      this.bindModalPopupEvent();
    },

    /**
     * Bind click event for delete-job button.
     */
    bindDeleteJobConfirmClickEvent: function() {
      var $button = $('#delete-job-confirm-button');
      $button.off('click');
      $button.on('click', _.bind(function() {
        if (confirm('Really want to delete it?')) {
          var jobId = $('#edit-input-job-id').val();
          this.collection.deleteJob(jobId);
          $('#edit-job-modal').modal('hide');
        }
      }, this));
    },

    /**
     * Bind popup event for edit-job modal.
     */
    bindModalPopupEvent: function() {
      $('#edit-job-modal').on('show.bs.modal', _.bind(function(e) {
        var $button = $(e.relatedTarget);
        var jobId = $button.data('id');
        var jobActive = $button.data('job-active');

        var hour = $button.data('job-hour');
        var minute = $button.data('job-minute');

        $('#edit-input-job-name').val($button.data('job-name'));
        $('#edit-input-job-task-class').val($button.data('job-task')).trigger('change');
        $('#edit-input-job-task-args').val($button.attr('data-job-pubargs'));
        $('#edit-input-job-month').val($button.data('job-month'));
        $('#edit-input-job-day-of-week').val($button.data('job-day-of-week'));
        $('#edit-input-job-day').val($button.data('job-day'));
        $('#edit-input-job-hour').val($button.data('job-hour'));
        $('#edit-input-job-minute').val($button.data('job-minute'));
        $('#edit-input-job-time').val(hour + ":" + minute);
        $('#edit-input-job-id').val(jobId);

//        var $button = $('#edit-input-job-time');
//        var selDate = $button.data('job-hour') + ":" + $button.data('job-minute');
  
        $('#edit-input-job-time').AnyPicker({
          mode: "datetime",
          dateTimeFormat: "HH:mm",
          selectedDate: $('#edit-input-job-time').val(),
          onChange: function(iRow, iComp, oSelectedValues)
          {
            console.log("Changed Value : " + iRow + " " + iComp + " " + oSelectedValues);
          },
          theme: "iOS" // "Default", "iOS", "Android", "Windows"
        });
  
        var $checkbox = $('<input>', {
          type: 'checkbox',
          name: 'pause-resume-checkbox',
          id: 'pause-resume-checkbox',
          checked: ''
        });
        $('#pause-resume-container').html($checkbox);
        $("[name='pause-resume-checkbox']").bootstrapSwitch({
          'onText': 'Active',
          'offText': 'Inactive',
          'state': (jobActive == 'yes'),
          'onSwitchChange': _.bind(function(event, state) {
            if (state) {
              this.collection.resumeJob(jobId);
            } else {
              this.collection.pauseJob(jobId);
            }
            $('#edit-job-modal').modal('hide');
          }, this)
        });
      }, this));
    },



    /**
     * Bind click event for edit-job modal.
     */
    bindEditJobConfirmClickEvent: function() {
      var editConfirmButton = $('#edit-job-confirm-button').off('click');
      editConfirmButton.on('click', _.bind(function(e) {
        e.preventDefault();

        var jobId = $('#edit-input-job-id').val();
        var jobName = $('#edit-input-job-name').val();
        var jobTask = "simple_scheduler.jobs.rpio_job.RPIOJob";
        var month = $('#edit-input-job-month').val();
        var day = $('#edit-input-job-day').val();
        
        var args = $('#edit-input-job-task-args').val();

        if(args.charAt() != "[") {
          args = '["' + $('#edit-input-job-task-args').val() + '"]';
        }

        //        var hour = $('#edit-input-job-hour').val();
        //        var minute = $('#edit-input-job-minute').val();
        //        var dayOfWeek = $('#edit-input-job-day-of-week').val();

        var hour=$('#edit-input-job-time').val().split(':')[0];
        var minute=$('#edit-input-job-time').val().split(':')[1];

        var builderDayOfWeek = '';
        var dayOfWeek = '';

        var weekdaysArray = ["mon","tue","wed","thu","fri","sat","sun"];

        for (var i = 0; i < weekdaysArray.length; i++) {
          if ($('#' + weekdaysArray[i]).is(":checked"))
          {
            builderDayOfWeek = builderDayOfWeek + weekdaysArray[i] + ',';
          } 
        }
          
        dayOfWeek = builderDayOfWeek.slice(0, -1);

        if (jobName.trim() === '') {
          utils.alertError('Please fill in job name');
          return;
        }

        if (jobTask.trim() === '') {
          utils.alertError('Please fill in job task class');
          return;
        }

        // In order to pass space via command line arguments, we replace space
        // with $, and replace $ back to space. So, '$' is reserved and can't
        // be used in user input.
        if (jobName.indexOf('$') != -1 ||
            jobTask.indexOf('$') != -1 ||
            args.indexOf('$') != -1) {
          utils.alertError('You cannot use "$". Please remove it.');
          return;
        }

        var taskArgs = undefined;
        try {
          taskArgs = utils.getTaskArgs(args);
        } catch (err) {
          utils.alertError('Invalid Arguments. Should be valid JSON string,' +
              ' e.g., [1, 2, "hello"].');
          return;
        }

        // TODO (wenbin): more checking for cron string
        this.collection.modifyJob(jobId, {
          job_class_string: jobTask,
          name: jobName,
          pub_args: taskArgs,
          month: month,
          day_of_week: dayOfWeek,
          day: day,
          hour: hour,
          minute: minute
        });

        $('#edit-job-modal').modal('hide');
      }, this));
    }
  });
});
