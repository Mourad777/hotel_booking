const moment = require('moment')
const AWS = require("aws-sdk");

const isAccommodationAvailableAtDate = (bookings, currentDate) => {
    const isAvailable = !((bookings.findIndex(booking => {
        return moment(currentDate).isBetween(moment(booking.bookingStart), moment(booking.bookingEnd),'day')
            ||
            moment(currentDate).isSame(booking.bookingStart,'day')
    }
    ) > -1)
        ||
        moment(currentDate).isBefore(moment().subtract(1, 'days'),'day'))

    return isAvailable;
}

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    signatureVersion: "v4",
    region: "ca-central-1",
  });

  const deleteFiles = async (files = []) => {
    const bucket = process.env.AWS_BUCKET;
    if (files.length === 0) return;
    const deleteParams = {
      Bucket: bucket,
      Delete: { Objects: [] },
    };
  
    files.forEach((Key) => {
      deleteParams.Delete.Objects.push({ Key });
    });
    const objectsDeleteResponse = await s3.deleteObjects(deleteParams).promise();
  };

exports.isAccommodationAvailableAtDate = isAccommodationAvailableAtDate;
exports.s3 = s3;
exports.deleteFiles = deleteFiles;