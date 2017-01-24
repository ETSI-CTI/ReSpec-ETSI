node tools/build-etsi-debug.js
copy /Y builds\respec-etsi-debug* ..\NWM\TS102687
REM pscp -pw denis2016. builds/respec-etsi-debug* filatov@ctilab.etsiqa.org:/var/opt/gitlab/gitlab-rails/js
