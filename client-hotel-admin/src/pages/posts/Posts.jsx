import React, { useState, useEffect, Fragment } from 'react'
import { StyledBlueButton, StyledRedButton, StyledThumbnailPreview } from '../../StyledComponents';
import { useHistory } from 'react-router';
import { Checkbox, Icon } from 'semantic-ui-react'
import { deletePost, getPosts } from '../../utility/api';
import Loader from '../../components/Loader/Loader';
import { getPusher } from '../../utility/utility';

const Posts = ({ winSize }) => {

    const history = useHistory();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState([]);

    const getInitialData = async () => {
        await getPosts(setPosts, setIsLoading)
    }

    useEffect(() => {
        getInitialData()
    }, []);

    const handleDeletePost = async (id) => {
        await deletePost(id, setIsLoading)
        await getPosts(setPosts, setIsLoading)
    }

    const channel = getPusher().subscribe("my-channel");
    channel.bind("CommentsUpdated", async (data) => {
        console.log('data', data)
        getInitialData()
    });

    const handlePublished = () => {

    }
    const labelStyle = { fontSize: '1.4em', display: 'block' };
    const titleStyle = { fontSize: '1.9em', display: 'block', fontStyle: 'bold' };
    return (
        <div style={{ margin: 'auto', maxWidth: 800 }}>
            {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}

            <h1>Posts</h1>
            <table style={{ margin: 'auto', width: '100%' }}>
                <tbody>

                    {winSize > 1 && (<tr><th style={{ fontSize: '1.2em' }}></th><th style={{ fontSize: '1.2em',textAlign:'left' }}>Title</th><th style={{ fontSize: '1.2em' }}>Author</th><th style={{ fontSize: '1.2em' }}>Published</th></tr>)}
       
                    {posts.map(p => (
                        <Fragment key={p.id}>
                            <tr>
                                {winSize > 1 && (
                                    <Fragment>
                                        <td><StyledThumbnailPreview small file={p.image} /></td>
                                        <td>{p.title}</td><td>{p.author}</td>
                                        <td><div style={{ display: 'flex', justifyContent: 'space-around' }}><Checkbox disabled checked={!!p.is_published} onChange={handlePublished} /></div></td>
                                        <td><StyledBlueButton onClick={() => history.push(`/post/${p.id}/comments`)}>Comments {p.comment_count}</StyledBlueButton> </td>
                                        <td><StyledBlueButton onClick={() => history.push(`/edit-post/${p.id}`)}>Edit</StyledBlueButton> </td>
                                        <td><StyledRedButton onClick={() => handleDeletePost(p.id)}> Delete</StyledRedButton> </td>
                                    </Fragment>
                                )}
                            </tr>
                            {winSize === 1 && (
                                <div style={{ marginBottom: 20 }}>
                                    <StyledThumbnailPreview file={p.image} />
                                    <span style={titleStyle}>{p.title}</span>
                                    <p style={{ margin: '5px 0', fontSize: '1.3em' }}>{`Posted on ${new Date(p.created_at).toLocaleDateString()} ${!!p.author ? 'by ' + p.author : ''}`}</p>
                                    <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}><span style={{ ...labelStyle, marginRight: 10 }}>Published: </span><Checkbox disabled checked={!!p.is_published} onChange={handlePublished} /></div>


                                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                        <StyledBlueButton maxWidth onClick={() => history.push(`/post/${p.id}/comments`)}><Icon name='comment outline' size='large' /> {p.comment_count}</StyledBlueButton>
                                        <StyledBlueButton maxWidth onClick={() => history.push(`/edit-post/${p.id}`)}><Icon name='edit outline' size='large' /></StyledBlueButton>
                                        <StyledRedButton maxWidth onClick={() => handleDeletePost(p.id)}> <Icon name='trash alternate outline' size='large' /></StyledRedButton>
                                    </div>
                                </div>
                            )}
                        </Fragment>
                    ))}

                </tbody>
            </table>
        </div >
    )
}

export default Posts
