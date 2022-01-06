import React, { createRef, useState, useEffect } from 'react'
import { Editor } from "@tinymce/tinymce-react";
import {
    StyledFormTextInput,
    StyledBlueButton,
    StyledRedButton,
    StyledSubmitButton,
    StyledThumbnailPreview,
} from '../../StyledComponents';
import { Checkbox, Segment, Dropdown, TextArea, Form } from 'semantic-ui-react'
import './editor.css'
import { useParams, useHistory } from 'react-router';
import { AppUrl, resizeImageFn } from '../../utility/utility';
import { countries } from '../../utility/countries-iso';
import TagInput from '../../components/TagInput/TagInput';
import { processCategories } from '../../utility/helper-functions';
import { editor_photo_upload_handler, getCategories, initializePostForm, submitNewCategory, updatePostForm } from '../../utility/api';
import Loader from '../../components/Loader/Loader';
import { DateInput } from 'semantic-ui-calendar-react';
import moment from 'moment'

const fontStyles =
    "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago;Merriweather=merriweather; Montserrat=montserrat; Quicksand=quicksand; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats";

const CreatePost = ({ isEditing }) => {
    const params = useParams();
    const history = useHistory();
    const [title, setTitle] = useState('');
    const [file, setFile] = useState('');
    const [country, setCountry] = useState('');
    const [author, setAuthor] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [tags, setTags] = useState([]);
    const [initialContent, setInitialContent] = useState('Write something...');
    const [isCommentsEnabled, setIsCommentsEnabled] = useState(true);
    const [isPublished, setIsPublished] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [dateWritten, setDateWritten] = useState('');
    const fileInputRef = createRef();

    const handleTitle = (e) => {
        setTitle(e.target.value)
    }

    const handleEditorContent = (e) => {
        setContent(e.target.getContent())
    }

    const handleFileChange = e => {
        e.preventDefault()
        setFile(e.target.files[0]);
    };

    const handleCountry = (e, { value }) => {
        e.preventDefault();
        setCountry(value);
    };

    const handleAuthor = e => {
        e.preventDefault()
        setAuthor(e.target.value);
    };

    const handleSummary = e => {
        e.preventDefault()
        setSummary(e.target.value);
    };

    const handleNewCategoryField = (e) => {
        setNewCategory(e.target.value);
    }

    const handleComments = () => {
        setIsCommentsEnabled(!isCommentsEnabled);
    }

    const handlePublished = () => {
        setIsPublished(!isPublished);
    }

    const handleDate = (event, { name, value }) => {
        setDateWritten(value);
    }

    const getInitialData = async () => {
        const categoriesResponse = await getCategories() || {};
        const processedCategories = processCategories(categoriesResponse.data) || [];
        setCategories(processedCategories);

        if (isEditing) {
            const id = params.id;
            const post = await initializePostForm(id, setIsLoading)
            setTitle(post.title || '');
            setAuthor(post.author || '');
            setSummary(post.summary || '');
            const timeStamp = new Date(post.created_at).getTime();
            console.log('timeStamp', timeStamp)
            const formattedDate = moment(timeStamp).format("YYYY-MM-DD")
            // moment(timeStamp).format("dddd, MMMM DD YYYY, HH:mm")

            setDateWritten(post.date_written || formattedDate)
            setIsPublished(!!parseInt(post.is_published));
            setIsCommentsEnabled(!!parseInt(post.is_comments_enabled));
            setSelectedCategories(post.categories.map(cat => cat.name));

            setCountry(post.country);
            if (post.tags) setTags(JSON.parse(post.tags));
            setInitialContent(post.content);
            setContent(post.content);
            setFile(post.aws_url);
        }
    }

    const handleNewCategorySubmit = async () => {
        await submitNewCategory(newCategory, setIsLoading)

        const categoriesResponse = await getCategories();
        const processedCategories = processCategories(categoriesResponse.data);
        setCategories(processedCategories);
        setNewCategory('')
    }

    const handleTags = async (value) => {

        setTags(value);
    }


    const handleForm = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        if (file && !isEditing) {
            // const file = await resizeImageFn(e.target.files[0]);
            const compressedFile = await resizeImageFn(file);
            formData.append('image', compressedFile);
        }
        if (file && isEditing) {
            if (file instanceof File) {
                //this will be an updated image
                const compressedFile = await resizeImageFn(file);
                formData.append('image', compressedFile);
            } else {
                //this will be the unchanged image
                formData.append('image', 'sameImage');
            }
        }

        const selectedCategoriesIds = categories.filter(cat => selectedCategories.includes(cat.text)).map(cat => cat._id);
        formData.append('title', title || '');
        formData.append('author', author || '');
        formData.append('summary', summary || '');
        formData.append('date_written', dateWritten || '');
        formData.append('content', content || 'Write something...');
        formData.append('selected_categories', JSON.stringify(selectedCategoriesIds));
        formData.append('tags', JSON.stringify(tags));
        formData.append('country', country || '');
        formData.append('is_published', isPublished ? 1 : 0);
        formData.append('is_comments_enabled', isCommentsEnabled ? 1 : 0);
        let url = `${AppUrl}api/posts/save`;
        if (isEditing) url = `${AppUrl}api/posts/update/${params.id}`;
        await updatePostForm(url, formData, setIsLoading)
        history.push('/posts');
    }


    useEffect(() => {
        getInitialData()
    }, [])
    const handleSelectedCategories = (e, { label, checked }) => {
        if (checked) {
            setSelectedCategories([...selectedCategories, label]);
        } else {
            setSelectedCategories(selectedCategories.filter(el => el !== label));
        }
    };

    return (
        <div style={{ margin: 'auto', maxWidth: 800 }}>
            {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}

            <h1>{isEditing ? 'Edit Post' : 'New Post'}</h1>

            <div>
                <label style={{ fontSize: '1.2em' }}>Title</label>
                <StyledFormTextInput value={title} onChange={handleTitle} placeholder='Title' />
            </div>
            <div style={{ marginTop: 20 }}>
                <label style={{ fontSize: '1.2em' }}>Author</label>
                <StyledFormTextInput value={author} onChange={handleAuthor} placeholder='Author' />
            </div>
            <div style={{ marginTop: 20 }}>
                <StyledThumbnailPreview file={file instanceof File ? URL.createObjectURL(file) : file} />
            </div>
            <div style={{ marginTop: 20 }}>
                <StyledBlueButton onClick={() => fileInputRef.current.click()} icon="image"
                >
                    Upload Thumbnail
                </StyledBlueButton>
                <StyledRedButton onClick={() => setFile(null)}
                >
                    <i className="trash icon"></i>
                </StyledRedButton>
                <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={handleFileChange}
                />
            </div>
            <div style={{ marginTop: 20 }}>
                <label style={{ fontSize: '1.2em' }}>Country</label>
                <Dropdown
                    clearable
                    placeholder='Select Country'
                    fluid
                    search
                    selection
                    options={countries}
                    onChange={handleCountry}
                    value={country}
                >

                </Dropdown>
            </div>
            <div style={{ marginTop: 20 }}>
                <label style={{ fontSize: '1.2em' }}>Create a new category</label>
                <StyledFormTextInput value={newCategory} onChange={handleNewCategoryField} placeholder='New Category' />
                <div style={{ marginTop: 10 }}>
                    <StyledBlueButton onClick={handleNewCategorySubmit} icon="image"
                    >
                        Create Category
                    </StyledBlueButton>
                </div>
            </div>
            <Segment basic>
                <p>Categories: {selectedCategories.length > 0 ? selectedCategories.join(", ") : "empty"}</p>

                <Dropdown item simple text="Select categories">
                    <Dropdown.Menu>
                        {categories.map(cat => {

                            return (
                                <Dropdown.Item key={cat._id}>
                                    <Checkbox label={cat.text} checked={selectedCategories.includes(cat.text)} onChange={handleSelectedCategories} />
                                </Dropdown.Item>
                            )
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            </Segment>
            <div style={{ marginTop: 20 }}>
                <label style={{ fontSize: '1.2em' }}>Date Written</label>
                <div>
                    <DateInput
                        name="date"
                        placeholder="Date Written"
                        value={dateWritten}
                        iconPosition="left"
                        onChange={handleDate}
                        dateFormat="YYYY-MM-DD"
                    />
                </div>
            </div>
            <div style={{ marginTop: 20 }}>
                <label style={{ fontSize: '1.2em' }}>Tags</label>
                <TagInput values={tags} onChange={handleTags} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: 200, padding: 20, fontSize: '1.2em' }}><span style={{ marginRight: 10 }}>Published</span>
                <Checkbox checked={!!isPublished} onChange={() => handlePublished()} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: 200, padding: 20, fontSize: '1.2em' }}><span style={{ marginRight: 10 }}>Comments Enabled</span>
                <Checkbox checked={!!isCommentsEnabled} onChange={() => handleComments()} /></div>
            <div style={{ marginTop: 20 }}>
                <label style={{ fontSize: '1.2em' }}>Summary</label>
                <Form><TextArea value={summary} onChange={handleSummary} style={{ minHeight: 100, width: '100%' }} /></Form>
            </div>
            <div style={{ marginTop: 20 }}>
                <Editor
                    initialValue={initialContent}
                    apiKey="lmbdxengrz1nuue2c1bunerjwmcqgvzoptjjdr3w0o1imj5n"
                    init={{

                        plugins: 'link image code autoresize',
                        toolbar: 'insert undo redo | bold italic | alignleft aligncenter alignright | code',
                        images_upload_handler: editor_photo_upload_handler,
                        content_style:
                            `@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap');
                             @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300&display=swap');
                             @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap');
                             img {
                                 max-width:100%;
                                 object-fit:cover;
                             }
                            `,
                        font_formats: fontStyles,

                    }}

                    onChange={handleEditorContent}
                />
            </div>

            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <StyledSubmitButton onClick={handleForm} >{isEditing ? 'Update' : 'Post'}</StyledSubmitButton>
            </div>
        </div>
    )
}

export default CreatePost
