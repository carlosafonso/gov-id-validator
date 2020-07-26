import boto3
import json

rekognition = boto3.client('rekognition')


def lambda_handler(event, context):
    bucket = event['Bucket']
    face_picture_key = event['FacePictureKey']
    gov_id_card_picture_key = event['GovIdCardPictureKey']

    response = rekognition.compare_faces(
        SourceImage={
            'S3Object': {
                'Bucket': bucket,
                'Name': face_picture_key
            }
        },
        TargetImage={
            'S3Object': {
                'Bucket': bucket,
                'Name': gov_id_card_picture_key
            }
        }
    )

    print(json.dumps(response))

    if len(response['FaceMatches']):
        print("Face matches")
        # return {'FaceMatches': True}
        return True
    else:
        print("Face does NOT match")
        # return {'FaceMatches': False}
        return False
