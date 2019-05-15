const aws = require('aws-sdk');
const sqs = new aws.SQS();
const sns = new aws.SNS();
const kinesis = new aws.Kinesis();
exports.handler = async (event, context) => {
  // Log the event argument for debugging and for use in local development.
  console.log(JSON.stringify(event, undefined, 2));
  const message = JSON.stringify(event);

  const sqsResponse = await sqs.sendMessage({
    QueueUrl: process.env.QUEUE_URL,
    MessageBody: message
  }).promise();

  console.log(sqsResponse);

  const snsResponse = await sns.publish({
    Message: message,
    TopicArn: process.env.TOPIC_ARN
  }).promise();
  console.log(snsResponse);

  const kinesisResponse = await kinesis.putRecord({
    StreamName: process.env.STREAM_NAME,
    PartitionKey: '1',
    Data: message

  }).promise();
  console.log(kinesisResponse);

  return {};
};
