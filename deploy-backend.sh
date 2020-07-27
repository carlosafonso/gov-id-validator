#!/bin/bash

echo "GOV_ID_VAL_SAM_S3_BUCKET:  $GOV_ID_VAL_SAM_S3_BUCKET"
echo "GOV_ID_VAL_CFN_STACK_NAME: $GOV_ID_VAL_CFN_STACK_NAME"

sam package \
	--s3-bucket $GOV_ID_VAL_SAM_S3_BUCKET \
	--output-template-file packaged.yaml

sam deploy \
	--template-file packaged.yaml \
	--stack-name $GOV_ID_VAL_CFN_STACK_NAME \
	--capabilities CAPABILITY_IAM
