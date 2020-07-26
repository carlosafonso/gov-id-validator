import boto3
import json

rekognition = boto3.client('rekognition')


def lambda_handler(event, context):
    bucket = event['Bucket']
    gov_id_card_picture_key = event['GovIdCardPictureKey']
    data = event['GovIdCardData']

    response = rekognition.detect_text(
        Image={
            'S3Object': {
                'Bucket': bucket,
                'Name': gov_id_card_picture_key
            }
        }
    )

    text_entities = [d['DetectedText'].lower() for d in response['TextDetections'] if d['Type'] == 'WORD']

    print(json.dumps(text_entities))

    if data['FirstName'].lower() not in text_entities:
        print("Unable to find reported first name {} in detected text".format(data['FirstName']))
        # return {"TextMatches": False}
        return False
    elif data['LastName'].lower() not in text_entities:
        print("Unable to find reported last name {} in detected text".format(data['LastName']))
        # return {"TextMatches": False}
        return False
    elif data['Id'].lower() not in text_entities:
        print("Unable to find reported document ID {} in detected text".format(data['Id']))
        # return {"TextMatches": False}
        return False
    else:
        print("All fields were found in detected text")
        # return {"TextMatches": True}
        return True
