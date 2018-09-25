"""Settings to override default settings."""

import logging
import os

#
# Override settings
#
DEBUG = True

HTTP_PORT = 8889
HTTP_ADDRESS = '0.0.0.0'

#
# Static Assets
#
# The web UI is a single page app. All javascripts/css files should be in STATIC_DIR_PATH
#
STATIC_DIR_PATH = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'static')
TEMPLATE_DIR_PATH = STATIC_DIR_PATH
APP_INDEX_PAGE = 'index.html'

#
# Set logging level
#
logging.getLogger().setLevel(logging.DEBUG)

JOB_CLASS_PACKAGES = ['simple_scheduler.jobs']
