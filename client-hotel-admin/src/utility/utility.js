import Pusher from "pusher-js";
import { v1 } from "uuid";
import Compress from 'compress.js'
const compress = new Compress();

export const getFileName = (filename) => {

    const extension = filename.split('.').pop();

    const newFileName = v1() + Date.now() + '.' + extension;

    return newFileName;
}


export const getWindowSizeInteger = windowWidth => {
    let widthInteger;
    if (windowWidth > 0 && windowWidth < 600) widthInteger = 1; //mobile
    if (windowWidth >= 600 && windowWidth < 1200) widthInteger = 2; //tablet
    if (windowWidth >= 1200 && windowWidth < 2560) widthInteger = 3; //desktop 1080
    if (windowWidth >= 2560 && windowWidth < 3840) widthInteger = 4; //2k
    if (windowWidth >= 3840) widthInteger = 5; //4k
    return widthInteger;
};

export const resizeImageFn = async (file) => {

    const resizedImage = await compress.compress([file], {
        size: 8, // the max size in MB, defaults to 2MB
        quality: 1, // the quality of the image, max is 1,
        maxWidth: 800, // the max width of the output image, defaults to 1920px
        maxHeight: 600, // the max height of the output image, defaults to 1920px
        resize: true // defaults to true, set false if you do not want to resize the image width and height
    })
    const img = resizedImage[0];
    const base64str = img.data
    const imgExt = img.ext
    const resizedFiile = Compress.convertBase64ToFile(base64str, imgExt)
    return resizedFiile;
}




export const AppUrl = 'http://localhost:3001/';
// export let AppUrl = 'https://stormy-forest-71570.herokuapp.com/';
// if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
//     // AppUrl = 'http://localhost:8000/';
//     AppUrl = 'https://stormy-forest-71570.herokuapp.com/';
// }

export const getPusher = () => {
    const pusherKey = '540ea742ac9e8d6d5157';
    const pusherCluster = 'us2'

    const pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
    });
    return pusher;
}