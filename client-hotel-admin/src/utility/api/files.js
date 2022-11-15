import axios from "axios";

const { REACT_APP_API_URL } = process.env;

export const uploadFile = async (file, key, token = "", fileType = 'NA',setIsLoading) => {
    setIsLoading(true)
    const fileInfo = new FormData();
    fileInfo.append("key", key);
    fileInfo.append("fileType", fileType);//s3 object tag

    const uploadConfig = await axios.post(`${REACT_APP_API_URL}/uploads`, { key, fileType });
    console.log("Get pre-signed url response: ", uploadConfig);
    try {
        let form = new FormData();
        Object.keys(uploadConfig.data.presignedUrl.fields).forEach((key) => {
            form.append(key, uploadConfig.data.presignedUrl.fields[key]);
        });

        form.append("file", file);

        const response = await axios.post( uploadConfig.data.presignedUrl.url, form );

        console.log("Upload file response: ", response);
        setIsLoading(false)
    } catch (err) {
        console.log("Upload file error: ", err);
        setIsLoading(false)
    }
    return uploadConfig;
};

