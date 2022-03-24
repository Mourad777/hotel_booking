const { s3 } = require("../../utils");

const router = require("express").Router();

router.post("/", async (req, res, next) => {
  console.log('req.body',req.body)
  const key = req.body.key;
  const fileType = req.body.fileType;
  const fileExtension =
    (key.substring(key.lastIndexOf(".") + 1, key.length) || key || "").toLowerCase();

  const acceptedExtensions = [
    "jpeg",
    "jfif",
    "jpg",
  ];

  if (!acceptedExtensions.includes(fileExtension)) {
    return res.status(401).json({ message: "File type not allowed" });
  }

  const maxFileSize = 25 * 1000000; // 25mb

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Fields: {
      key: key,
    },
    Expires: 300, //seconds
    Conditions: [
      ["content-length-range", 0, maxFileSize], //100mb
      ["starts-with", "$tagging", ""],
    ],
  };
  const tagKey = 'fileType';
  const tagValue = fileType;
  s3.createPresignedPost(params, (err, data) => {
    res.send({
      uploaded: 1, 
      presignedUrl: {
        ...data,
        fields: {
          ...data.fields,
          tagging: `<Tagging><TagSet><Tag><Key>${tagKey}</Key><Value>${tagValue}</Value></Tag></TagSet></Tagging>`,
        },
      },
    });
  });

});

module.exports = router;