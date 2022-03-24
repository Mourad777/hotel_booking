import axios from 'axios'
import { AppUrl } from './utility'
import { processComments } from './helper-functions'

const getDefaultHeader = (token) => {
    console.log('token..', token)
    return {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer " + token,
        }
    }
}

export const getComments = async (docId, docType, setComments, setIsLoading) => {
    const token = localStorage.getItem('token');
    setIsLoading(true)
    let res;
    try {
        res = await axios.get(`${AppUrl}api/comments/${docType}/${docId}`, getDefaultHeader(token));
    } catch (e) {
        setIsLoading(false)
        console.log('Fetch comments response error', res);
    }
    console.log('Fetch comments response', res)
    const comments = res.data;
    setComments(processComments(comments));
    setIsLoading(false)
}

export const deleteComment = async (id, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res;
    setIsLoading(true)
    try {
        res = await axios.delete(`${AppUrl}api/comments/delete/${id}`, getDefaultHeader(token));

    } catch (e) {
        console.log('Delete comment error', e)
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Delete comment response', res)
}

export const getDocument = async (docId, docType, setDocument, setIsLoading) => {
    const token = localStorage.getItem('token');
    setIsLoading(true)
    let res;
    try {
        res = await axios.get(`${AppUrl}api/${docType}s/${docId}`, getDefaultHeader(token));
    } catch (e) {
        console.log('Respost fetch post or video', res)
        setIsLoading(false)
    }
    console.log('Respost fetch post or video', res)
    const doc = res.data;
    setDocument(doc);
    setIsLoading(false)

}

export const toggleCommentApproval = async (id, setIsLoading) => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    const formData = new FormData();
    formData.append('comment_id', id)
    let toggleCommentAprrovalResponse;
    try {
        toggleCommentAprrovalResponse = await axios.post(`${AppUrl}api/comments/approve-comment`, formData, getDefaultHeader(token))

    } catch (e) {
        console.log('Toggle Comment Aprroval Response Error', e)
        setIsLoading(false)
    }
    console.log('Toggle Comment Aprroval Response', toggleCommentAprrovalResponse)
    setIsLoading(false);
}

//countries api

export const getCountryThumbnails = async (setCountryThumbnails, setIsLoading) => {
    setIsLoading(true)
    let fetchCountryThumbnailsResponse = {};
    try {
        fetchCountryThumbnailsResponse = await axios.get(`${AppUrl}api/countries`);
    } catch (e) {
        console.log('Fetch Country Thumbnails Error', e);
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Fetch Country Thumbnails Response', fetchCountryThumbnailsResponse);
    setCountryThumbnails(fetchCountryThumbnailsResponse.data || []);
}

export const uploadCountryThumbnail = async (formData, setIsLoading) => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    let uploadThumbnailResponse;
    try {
        uploadThumbnailResponse = await axios.post(
            `${AppUrl}api/countries/save`,
            formData,
            getDefaultHeader(token)
        );
    } catch (e) {
        console.log('Upload Country Thumbnail Error', e);
        setIsLoading(false);
    }
    console.log('Upload Country Thumbnail Response', uploadThumbnailResponse);
    setIsLoading(false);
}

export const updateCountryThumbnail = async (id, formData, setIsLoading) => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    let updateThumbnailResponse;
    try {
        updateThumbnailResponse = await axios.post(
            `${AppUrl}api/countries/update/${id}`,
            formData,
            getDefaultHeader(token)
        );
    } catch (e) {
        console.log('Update Country Thumbnail Error', e);
        setIsLoading(false);
    }
    console.log('Update Country Thumbnail Response', updateThumbnailResponse);
    setIsLoading(false);
}

export const deleteCountryThumbnail = async (id, setIsLoading) => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    let deleteCountryThumbnailsResponse;
    try {
        deleteCountryThumbnailsResponse = await axios.delete(`${AppUrl}api/countries/delete/${id}`, getDefaultHeader(token));
        console.log('Delete Country Thumbnails Response', deleteCountryThumbnailsResponse)
    } catch (e) {
        console.log('Delete Country Thumbnail Error', e);
        setIsLoading(false);
    }
    console.log('Delete Country Thumbnail Response', deleteCountryThumbnailsResponse);
    setIsLoading(false);
}

//categories api
export const getCategories = async () => {
    let categoriesResponse;
    try {
        categoriesResponse = await axios.get(`${AppUrl}api/categories`);
    } catch (e) {
        console.log('Fetch categories response error', e)
    }
    console.log('Fetch categories response', categoriesResponse)
    return categoriesResponse;
}

export const submitNewCategory = async (newCategory, setIsLoading) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', newCategory);
    let newCategoryResponse;
    setIsLoading(true)
    console.log('new category token', token)
    try {
        newCategoryResponse = await axios.post(
            `${AppUrl}api/categories/save`,
            formData,
            getDefaultHeader(token)
        )
    } catch (e) {
        setIsLoading(false)
        console.log('New category response error: ', e)
    }
    setIsLoading(false)
    console.log('New category response: ', newCategoryResponse)
}

export const updateCategory = async (category, id, setIsLoading) => {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('name', category);
    let updateCategoryResponse;
    setIsLoading(true);
    try {
        updateCategoryResponse = await axios.post(
            `${AppUrl}api/categories/update/${id}`,
            formData,
            getDefaultHeader(token));
    } catch (e) {
        console.log('Update category response error', e);
        setIsLoading(false);
    }
    console.log('Update category response', updateCategoryResponse)
    setIsLoading(false);
}

export const getCategoryContent = async (countryIso, selectedCategory, setPosts, setPhotos, setVideos) => {
    let url;
    if (countryIso) {
        url = `${AppUrl}api/countries/${countryIso}`;
    }
    if (selectedCategory) {
        url = `${AppUrl}api/categories/${selectedCategory}`
    }
    let contentResponse;
    try {
        contentResponse = await axios.get(url);
    } catch (e) {
        console.log('Content response error', e)
    }
    console.log('content response', contentResponse)
    setPosts(contentResponse.data.posts || []);
    setPhotos(contentResponse.data.photos || []);
    setVideos(contentResponse.data.videos || []);
}

//updates the order of photos or videos in a gallery after
//dragging and dropping
export const updateOrder = async (items, galleryType) => {
    const token = localStorage.getItem('token');
    const updateOrderUrl = `${AppUrl}api/configurations/update`;
    const order = items.map(item => item.id);
    const configFormData = new FormData();
    configFormData.append(galleryType, JSON.stringify(order));
    let resUpdateOrder;
    try {
        resUpdateOrder = await axios.post(
            updateOrderUrl,
            configFormData,
            getDefaultHeader(token)
        );
    } catch (e) {
        console.log('Update photo order response error: ', e)

    }
    console.log('Update photo order response: ', resUpdateOrder)
}

export const getPhotos = async (setItems, setIsLoading) => {
    const fetchPhotosUrl = `${AppUrl}api/photos`;
    let resFetchPhotos = {};
    setIsLoading(true);
    try {
        resFetchPhotos = await axios.get(fetchPhotosUrl);

    } catch (e) {
        console.log('Fetch photos response error', e);

        setIsLoading(false)
    }

    console.log('Fetch photos response', resFetchPhotos);

    const fetchConfigUrl = `${AppUrl}api/configurations`;
    let resFetchConfigurations = {};
    try {
        resFetchConfigurations = await axios.get(fetchConfigUrl);

    } catch (e) {
        console.log('Fetch configuration response error', e);

        setIsLoading(false)
    }

    console.log('Fetch config response', resFetchConfigurations);

    setIsLoading(false)
    const formattedPhotos = (resFetchPhotos.data || []).map(item => {
        return {
            ...item,
            src: item.src,
            height: 1,
            width: 1.5,
            id: item.id,
        }
    });

    if (resFetchConfigurations.data !== 'no_config' && !!resFetchConfigurations.data) {
        const order = JSON.parse(resFetchConfigurations.data.photo_gallery_order) || [];
        const orderedFormattedPhotos = [];
        order.forEach(number => {
            formattedPhotos.forEach(photo => {
                if (photo.id === number) {
                    orderedFormattedPhotos.push(photo);
                }
            })
        });
        setItems(orderedFormattedPhotos)
    } else {
        setItems(formattedPhotos)
    }
}

export const updatePhotoDetails = async (id, formData, setIsLoading) => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    let updatePhotoDetailsResponse;
    try {
        updatePhotoDetailsResponse = await axios.post(
            `${AppUrl}api/photos/update/${id}`,
            formData,
            getDefaultHeader(token));
    } catch (e) {
        setIsLoading(false);
        console.log('Update photo details response error', e)
    }
    console.log('Update photo details response', updatePhotoDetailsResponse)

    setIsLoading(false);
}

export const updateVideoDetails = async (id, formData, setIsLoading) => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    let updateVideoDetailsResponse;
    try {
        updateVideoDetailsResponse = await axios.post(
            `${AppUrl}api/videos/update/${id}`,
            formData,
            getDefaultHeader(token)
        );
    } catch (e) {
        setIsLoading(false);
        console.log('Update Video Details Error', e)
    }
    setIsLoading(false);
    console.log('Update Video Details Response', updateVideoDetailsResponse);
}

export const getVideos = async (setItems, setIsLoading) => {
    const fetchVideosUrl = `${AppUrl}api/videos`;
    setIsLoading(true);
    let resFetchVideos = {};
    try {
        resFetchVideos = await axios.get(fetchVideosUrl);
    } catch (e) {
        console.log('Fetch videos response error', e);
        setIsLoading(false)
    }

    console.log('Fetch videos response', resFetchVideos);

    const fetchConfigUrl = `${AppUrl}api/configurations`;
    let resFetchConfigurations = {};
    try {
        resFetchConfigurations = await axios.get(fetchConfigUrl);
    } catch (e) {
        console.log('Fetch configuration response error', e);
        setIsLoading(false)
    }
    console.log('Fetch config response', resFetchConfigurations);

    setIsLoading(false)
    const formattedVideos = (resFetchVideos.data || []).map((item, index) => {
        return {
            ...item,
            src: item.thumbnail || Math.random(),
            height: 1,
            width: 1.5,
            commentCount: item.comment_count,
            id: item.id,
            videoUrl: item.src
        }
    });

    if (resFetchConfigurations.data !== 'no_config' && !!resFetchConfigurations.data) {
        const order = JSON.parse(resFetchConfigurations.data.video_gallery_order) || [];
        const orderedFormattedVideos = [];
        order.forEach(number => {
            formattedVideos.forEach(video => {
                if (video.id === number) {
                    orderedFormattedVideos.push(video);
                }
            })
        });
        setItems(orderedFormattedVideos)
    } else {
        setItems(formattedVideos)
    }
}

export const getVideo = async (id, setVideo, setIsLoading) => {
    setIsLoading(true);
    let videoResponse;
    try {
        videoResponse = await axios.get(`${AppUrl}api/videos/${id}`);
    } catch (e) {
        console.log('Fetch Video Error', e)
        setIsLoading(false)
    }
    console.log('Fetch Video Response', videoResponse);
    setVideo(videoResponse.data);
    setIsLoading(false);
}

export const deleteVideo = async (id, setIsLoading) => {
    const token = localStorage.getItem('token');
    let deleteVideoResponse;
    setIsLoading(true);
    try {
        deleteVideoResponse = await axios.delete(`${AppUrl}api/videos/delete/${id}`, getDefaultHeader(token))
    } catch (e) {
        setIsLoading(false);
        console.log('Delete video response error', e)
    }
    setIsLoading(false);
    console.log('Delete video response', deleteVideoResponse)
}

export const deletePhoto = async (id, setIsLoading) => {
    const token = localStorage.getItem('token');
    let deletePhotoResponse;
    setIsLoading(true);
    try {
        deletePhotoResponse = await axios.delete(`${AppUrl}api/photos/delete/${id}`, getDefaultHeader(token))
    } catch (e) {
        setIsLoading(false);
        console.log('Delete photo response error', e)
    }
    setIsLoading(false);
    console.log('Delete photo response', deletePhotoResponse)
}

export const uploadPhoto = async (formData, items, setIsLoading) => {
    const token = localStorage.getItem('token');

    const savePhotoUrl = `${AppUrl}api/photos/save`;
    setIsLoading(true)
    let resUploadPhoto = {};
    try {
        resUploadPhoto = await axios.post(
            savePhotoUrl,
            formData,
            getDefaultHeader(token)
        );
    } catch (e) {
        setIsLoading(false)
        console.log('Upload photo response error', e)
    }
    console.log('Upload photo response', resUploadPhoto)

    setIsLoading(false)
    return [{ ...resUploadPhoto.data, src: resUploadPhoto.data.src, height: 1, width: 1.5, id: resUploadPhoto.data.id }, ...items];
}

export const presignedUrlFileUpload = async (filename, directory, file, saveModelUrl, modelData) => {
    const token = localStorage.getItem('token');
    //step 1 get presigned url
    const presignedUrlEndpoint = `${AppUrl}api/upload/store`;
    const fileInfo = new FormData();
    fileInfo.append('filename', filename);
    fileInfo.append('directory', directory);

    const resPresignedUrl = await axios.post(
        presignedUrlEndpoint,
        fileInfo,
        getDefaultHeader(token)
    );
    console.log('Presigned url response', resPresignedUrl);

    //step 2 send file to presigned url
    const fileData = new FormData();
    const inputs = resPresignedUrl.data.inputs;
    Object.keys(inputs).forEach(key => {
        fileData.append(key, inputs[key]);
    });

    fileData.append('file', file);

    const fileUploadUrl =
        resPresignedUrl.data.attributes.action;
    //this request goes to aws directly from front-end
    const response = await axios.post(
        fileUploadUrl,
        fileData,
    );
    console.log('file upload response', response);

    //step 3 save key and any additional data in appropriate model
    const newModelFormData = new FormData();
    modelData.forEach(item => {
        newModelFormData.append(item.key, item.value)
    });

    const saveModelResponse = await axios.post(
        saveModelUrl, newModelFormData,
        getDefaultHeader(token)
    );
    console.log('Save model response', saveModelResponse)
    return { videoUrl: resPresignedUrl.data.url, videoId: saveModelResponse.data.id }
}

export const deleteCategory = async (id, setIsLoading) => {
    const token = localStorage.getItem('token');
    let deleteResponse;
    setIsLoading(true);
    try {
        deleteResponse = await axios.delete(`${AppUrl}api/categories/delete/${id}`, getDefaultHeader(token));
    } catch (e) {
        console.log('Delete Error Response', e)
        setIsLoading(false);
    }
    console.log('Delete Response', deleteResponse);
}

//accommodations api
export const getAccommodations = async (setAccommodations, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {
        res = await axios.get(`${AppUrl}api/accommodations/all/all`, getDefaultHeader(token));

    } catch (e) {
        console.log('Fetch accommodations error', e)
        setIsLoading(false)
    }
    console.log('Fetch accommodations response', res)
    const accommodations = res.data || [];
    setAccommodations(accommodations);
    setIsLoading(false)
}

export const getAccommodation = async (setAccommodation, accommodationId, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {
        res = await axios.get(`${AppUrl}api/accommodations/${accommodationId}`, getDefaultHeader(token));

    } catch (e) {
        console.log('Fetch accommodation error', e)
        setIsLoading(false)
    }
    console.log('Fetch accommodation response', res)
    const accommodation = res.data || [];
    setAccommodation(accommodation);
    setIsLoading(false)
}

//users api
export const getUsers = async (setUsers, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {
        res = await axios.get(`${AppUrl}api/users`, getDefaultHeader(token));

    } catch (e) {
        console.log('Fetch users error', e)
        setIsLoading(false)
    }
    console.log('Fetch users response', res)
    const users = res.data || [];
    setUsers(users.map(user => ({ key: user.id, value: user.id, text: user.firstName + ' ' + `(${user.email})` })));
    setIsLoading(false)
}

//bookings api
export const getBookings = async (setBookings, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {
        res = await axios.get(`${AppUrl}api/bookings`, getDefaultHeader(token));

    } catch (e) {
        console.log('Fetch bookings error', e)
        setIsLoading(false)
    }
    console.log('Fetch bookings response', res)
    const bookings = res.data || [];
    setBookings(bookings);
    setIsLoading(false)
}

export const createBooking = async (values, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {

        const response = await axios.post('http://localhost:3001/api/bookings', values);

        console.log('response', response)

        return response.data

    } catch (e) {
        console.log('Create bookings error', e)
        setIsLoading(false)
    }
    console.log('Create bookings response', res)
    setIsLoading(false)
    return res.data
}

export const initializePostForm = async (id, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res;
    setIsLoading(true)
    try {
        res = await axios.get(`${AppUrl}api/posts/edit/${id}`, getDefaultHeader(token));

    } catch (e) {
        console.log('Fetch post error', e)
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Fetch post response', res)
    return res.data;
}

export const updatePostForm = async (url, formData, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res;
    setIsLoading(true)
    try {
        res = await axios.post(
            url,
            formData,
            getDefaultHeader(token)
        );

    } catch (e) {
        console.log('Update post error', e)
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Update post response', res)
}

export const deleteAccommodation = async (id, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res;
    setIsLoading(true)
    try {
        res = await axios.delete(`${AppUrl}api/posts/delete/${id}`, getDefaultHeader(token));

    } catch (e) {
        console.log('Fetch posts error', e)
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Fetch posts response', res)
}

//subscribers api

export const getSubscribers = async (setSubscribers, setIsLoading) => {
    const token = localStorage.getItem('token');
    setIsLoading(true)
    let res = {};
    try {
        res = await axios.get(`${AppUrl}api/subscribers`, getDefaultHeader(token));
    } catch (e) {
        console.log('Subscribers response error: ', e);
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Fetch subscribers response', res)
    const subscribers = res.data || [];
    setSubscribers(subscribers);
}


//messages api

export const getMessages = async (setMessages, setIsLoading) => {
    const token = localStorage.getItem('token');
    setIsLoading(true)
    let res = {};
    try {
        res = await axios.get(`${AppUrl}api/messages`, getDefaultHeader(token));
    } catch (e) {
        console.log('Messages response error: ', e);
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Fetch messages response', res)
    const messages = res.data || [];
    setMessages(messages);
}


export const getMessage = async (messageId, setMessage, setIsLoading) => {
    setIsLoading(true)
    let res;
    try {
        res = await axios.get(`${AppUrl}api/message/${messageId}`);
    } catch (e) {
        console.log('Message response error: ', e);
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Fetch message response', res)
    const message = res.data;
    setMessage(message);
}

export const getConfiguration = async (setIsLoading) => {
    const url = `${AppUrl}api/configurations`;
    let configResponse = {};
    setIsLoading(true);
    try {
        configResponse = await axios.get(url);
    } catch (e) {
        setIsLoading(false)
        console.log('Fetch configuration response error: ', e)
    }

    setIsLoading(false)
    console.log('Fetch configuration response: ', configResponse);
    return configResponse.data || {};
}

export const updateConfiguration = async (formData, setIsLoading) => {
    const token = localStorage.getItem('token');
    const url = `${AppUrl}api/configurations/update`;
    let configResponse;
    setIsLoading(true);
    try {
        configResponse = await axios.post(
            url,
            formData,
            getDefaultHeader(token)
        );
    } catch (e) {
        setIsLoading(false)
        console.log('Update configuration response error: ', e)
    }
    setIsLoading(false)
    console.log('Update configuration response: ', configResponse)
}


//tinymce editor
// export const editor_photo_upload_handler = async (blobInfo, success, failure, progress) => {
//     const token = localStorage.getItem('token');
//     const formData = new FormData();
//     const compressedFile = await resizeImageFn(blobInfo.blob());
//     formData.append('image', compressedFile);
//     const res = await axios.post(
//         `${AppUrl}api/tinymce/upload`,
//         formData,
//         getDefaultHeader(token)
//     );

//     console.log('res.data', res.data)
//     success(res.data.location)
//     return res.data.location;
// };

export const registerUser = async (url, formData, setIsLoading) => {
    let registrationResponse;
    setIsLoading(true)
    try {
        registrationResponse = await axios.post(
            url,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        )
    } catch (e) {
        setIsLoading(false)
        console.log('User registration response error: ', e)
    }
    setIsLoading(false)
    console.log('User registration response: ', registrationResponse)

    const token = registrationResponse.data.token;
    localStorage.setItem('token', token)
}

export const login = async (url, formData, setIsLoading) => {
    let loginResponse;
    setIsLoading(true);
    try {
        loginResponse = await axios.post(
            url,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        )
    } catch (e) {
        setIsLoading(false)
        console.log('User login response error: ', e)
    }
    setIsLoading(false)
    console.log('User login response: ', loginResponse)

    const token = loginResponse.data.token;
    localStorage.setItem('token', token)
}

export const logout = async (setIsLoading) => {
    const url = `${AppUrl}api/logout`;
    const token = localStorage.getItem('token');
    let logoutResponse;
    setIsLoading(true);
    try {
        logoutResponse = await axios.post(
            url,
            {},
            getDefaultHeader(token),
        )
    } catch (e) {
        setIsLoading(false)
        console.log('User logout response error: ', e)
    }
    setIsLoading(false)
    console.log('User logout response: ', logoutResponse)
}

export const uploadFile = async (file, key, token = "", fileType = 'NA') => {
    const fileInfo = new FormData();
    console.log('file key', file, key)
    fileInfo.append("key", key);
    fileInfo.append("fileType", fileType);//s3 object tag
    console.log('pre uploading file ', `${AppUrl}uploads`)
    const headers = {
        'content-type': 'multipart/form-data'
    }
    const uploadConfig = await axios.post(`${AppUrl}api/uploads`, 
        {
            key,
            fileType
        }
        // fileInfo, headers

    );
    // const uploadConfig = await axios({
    //   url: `${AppUrl}api/uploads`,
    //   method: "POST",
    //   headers: {
    //     Authorization: "Bearer " + token,
    //   },
    //   data: fileInfo,
    // });
    console.log("Get pre-signed url response: ", uploadConfig);
    try {
        let form = new FormData();
        Object.keys(uploadConfig.data.presignedUrl.fields).forEach((key) => {
            form.append(key, uploadConfig.data.presignedUrl.fields[key]);
        });

        form.append("file", file);

        const response = await axios.post(
            uploadConfig.data.presignedUrl.url,
            form,
        );

        console.log("Upload file response: ", response);
    } catch (err) {
        console.log("Upload file error: ", err);
    }
    return uploadConfig;
};

