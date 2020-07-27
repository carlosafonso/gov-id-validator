#!/bin/bash

echo "GOV_ID_VAL_WWW_S3_BUCKET: $GOV_ID_VAL_WWW_S3_BUCKET"

aws s3 sync \
	--delete \
	--acl public-read \
	www s3://$GOV_ID_VAL_WWW_S3_BUCKET
