import boto3
import json
import os

PROJECT_VERSION_ARN = os.environ['CUSTOM_LABELS_PROJECT_VERSION_ARN']

rekognition = boto3.client('rekognition')


def lambda_handler(event, context):
    bucket = event['Bucket']
    key = event['Key']

    response = rekognition.detect_custom_labels(
        ProjectVersionArn=PROJECT_VERSION_ARN,
        Image={
            'S3Object': {
                'Bucket': bucket,
                'Name': key
            }
        },
        MinConfidence=0
    )

    labels = response['CustomLabels']
    #labels = [l for l in response['CustomLabels'] if l['Name'] == 'DNI01']

    if len(labels):
        print("Got {} custom labels".format(len(labels)))
        print(labels)
        return True
    else:
        return False
