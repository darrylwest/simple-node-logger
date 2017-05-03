#!/bin/sh
# dpw@seattle.local
# 2017.05.03
#

pwd=`pwd`
examples="category-logger.js custom-timestamp.js domain-logger.js dynamic-rolling-logger.js hourly-logger.js json-appender.js json-file-logger.js log-manager.js rolling-logger.js simple-file-logger.js simple-logger.js"

for ex in $examples
do
    fn="${pwd}/examples/${ex}"
    ls $fn
    $fn
done

