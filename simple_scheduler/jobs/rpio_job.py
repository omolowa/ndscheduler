"""A sample job that prints string."""

from ndscheduler import job
import RPi.GPIO as GPIO


class RPIOJob(job.JobBase):

    @classmethod
    def meta_info(cls):
        return {
            'job_class_string': '%s.%s' % (cls.__module__, cls.__name__),
            'notes': 'This will toggle an RPIO input/ouput!',
            'arguments': [
                {'type': 'string', 'description': 'New state (on / off)'}
            ],
            'example_arguments': '["off"]'
        }

    def run(self, action, *args, **kwargs):
        GPIO.setmode(GPIO.BCM)
        switchPin = 23
        GPIO.setwarnings(False)
        GPIO.setup(switchPin, GPIO.OUT)
        print('--RPIOJob argument: %s' % (action))
        if action == "on":
            GPIO.output(switchPin, GPIO.HIGH)
        if action == "off":
            GPIO.output(switchPin, GPIO.LOW)
        return action


if __name__ == "__main__":
    # You can easily test this job here
    job = RPIOJob.create_test_instance()
    job.run("on")
