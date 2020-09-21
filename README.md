# gov-id-validator

This sample project demonstrates the functionality of Rekognition Custom Labels.

You will need to train a Custom Labels model on a dataset of Spanish DNIs or other kind of government-issued ID cards. This demo is currently not able to deploy this out of the box.

## How to deploy

First, define the following environment variables in your shell:

```bash
export GOV_ID_VAL_SAM_S3_BUCKET=<your S3 bucket for storing SAM artifacts>
export GOV_ID_VAL_CFN_STACK_NAME=<your CloudFormation stack name>
export GOV_ID_VAL_CUSTOM_LABELS_PROJECT_ARN=<the ARN of your Rekognition Custom Labels project>
```

Now deploy the backend component. (You can inspect the script if you'd like, it's just issuing AWS SAM commands to deploy an AWS CloudFormation template.)

```bash
./deploy-backend.sh
```

Now edit the `www/index.js` file and set the correct value for the ENDPOINT_URL constant.

Finally, to deploy the frontend first set the following environment variable (you can get the value from the previous CloudFormation stack's output):

```bash
export GOV_ID_VAL_WWW_S3_BUCKET=<your S3 bucket for storing the demo website>
```

Now upload the client. This script just uploads the client webpage to the previously created S3 bucket:

```bash
./deploy-www.sh
```
