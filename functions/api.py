import boto3
import json
import os
import time
import uuid

BUCKET = os.environ['UPLOADS_BUCKET_NAME']
STATE_MACHINE_ARN = os.environ['STATE_MACHINE_ARN']

s3 = boto3.client('s3')
sfn = boto3.client('stepfunctions')


class DatetimeEncoder(json.JSONEncoder):
    def default(self, obj):
        try:
            return super(DatetimeEncoder, obj).default(obj)
        except TypeError:
            return str(obj)


def lambda_handler(event, context):
    print(json.dumps(event))

    response_body = None

    if event['requestContext']['http']['path'] == '/validation_jobs':
        if event['requestContext']['http']['method'] == 'GET':
            sfn_response = sfn.describe_execution(executionArn=event['queryStringParameters']['executionArn'])
            response_body = sfn_response
        elif event['requestContext']['http']['method'] == 'POST':
            body = json.loads(event['body'])
            sfn_response = sfn.start_execution(
                stateMachineArn=STATE_MACHINE_ARN,
                name="GovId-Api-{}".format(time.time_ns()),
                input=json.dumps(body)
            )
            response_body = sfn_response
    elif event['requestContext']['http']['path'] == '/upload_urls':
        if event['requestContext']['http']['method'] == 'GET':
            urls = []
            for i in range(2):
                s3_response = s3.generate_presigned_post(
                    Bucket=BUCKET,
                    Key="uploads/{}".format(str(uuid.uuid4())),
                    ExpiresIn=60
                )
                urls.append(s3_response)

            response_body = {'bucket': BUCKET, 'urls': urls}

    return {
        'statusCode': 200,
        'body': json.dumps(response_body, cls=DatetimeEncoder),
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        }
    }
