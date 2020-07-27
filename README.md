```bash
export GOV_ID_VAL_SAM_S3_BUCKET=<your S3 bucket for storing SAM artifacts>
export GOV_ID_VAL_CFN_STACK_NAME=<your CloudFormation stack name>
export GOV_ID_VAL_CUSTOM_LABELS_PROJECT_ARN=<the ARN of your Rekognition Custom Labels project>

./deploy-backend.sh

export GOV_ID_VAL_WWW_S3_BUCKET=<your S3 bucket for storing the demo website>

./deploy-www.sh
```
