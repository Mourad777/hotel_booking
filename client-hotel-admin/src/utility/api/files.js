import axios from "axios";
import { AppUrl } from "../utility";

export const uploadFile = async (file, key, token = "", fileType = 'NA') => {
    const fileInfo = new FormData();
    console.log('file key', file, key)
    fileInfo.append("key", key);
    fileInfo.append("fileType", fileType);//s3 object tag
    console.log('pre uploading file ', `${AppUrl}uploads`)
    const headers = {
        'content-type': 'multipart/form-data'
    }
    const uploadConfig = await axios.post(`${AppUrl}api/uploads`, { key, fileType });
    console.log("Get pre-signed url response: ", uploadConfig);
    try {
        let form = new FormData();
        Object.keys(uploadConfig.data.presignedUrl.fields).forEach((key) => {
            form.append(key, uploadConfig.data.presignedUrl.fields[key]);
        });

        form.append("file", file);

        const response = await axios.post( uploadConfig.data.presignedUrl.url, form );

        console.log("Upload file response: ", response);
    } catch (err) {
        console.log("Upload file error: ", err);
    }
    return uploadConfig;
};

