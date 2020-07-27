```bash
export GOV_ID_VAL_SAM_S3_BUCKET=<your S3 bucket for storing SAM artifacts>
export GOV_ID_VAL_CFN_STACK_NAME=<your CloudFormation stack name>

./deploy-backend.sh

export GOV_ID_VAL_WWW_S3_BUCKET=<your S3 bucket for storing the demo website>

./deploy-www.sh
```
