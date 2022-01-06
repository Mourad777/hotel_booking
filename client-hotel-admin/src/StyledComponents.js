import styled from "styled-components";

export const StyledFormTextInput = styled.input`
    font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
    margin: 0;
    outline: 0;
    -webkit-appearance: none;
    tap-highlight-color: rgba(255,255,255,0);
    line-height: 1.21428571em;
    padding: .67857143em 1em;
    font-size: 1em;
    background: #fff;
    border: 1px solid rgba(34,36,38,.15);
    color: rgba(0,0,0,.87);
    border-radius: .28571429rem;
    box-shadow: 0 0 0 0 transparent inset;
    transition: color .1s ease,border-color .1s ease;
    width:100%;
    &:focus {
        color: rgba(0,0,0,.95);
        border-color: #85b7d9;
        border-radius: .28571429rem;
        background: #fff;
        box-shadow: 0 0 0 0 rgb(34 36 38 / 35%) inset;
    }
`



export const StyledBlueButton = styled.button`
    width:${props => props.maxWidth ? '100%' : ''};
    background-color: #2185d0;
    cursor: pointer;
    display: inline-block;
    min-height: 1em;
    outline: 0;
    border: none;
    vertical-align: baseline;
    font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
    margin: 0 .25em 0 0;
    padding: .78571429em 1.5em .78571429em;
    text-transform: none;
    text-shadow: none;
    font-weight: 700;
    line-height: 1em;
    font-style: normal;
    text-align: center;
    text-decoration: none;
    border-radius: .28571429rem;
    font-size: 1rem;
    color: #fff;
    &:hover {
        background-color: #1678c2;
        color: #fff;
        text-shadow: none;
    }
`

export const StyledRedButton = styled.button`
    width:${props => props.maxWidth ? '100%' : ''};
    background-color: #c62828;
    cursor: pointer;
    display: inline-block;
    min-height: 0.8em;
    outline: 0;
    border: none;
    vertical-align: baseline;
    font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
    margin: 0 .25em 0 0;
    padding: .78571429em 1.5em .78571429em;
    text-transform: none;
    text-shadow: none;
    font-weight: 700;
    line-height: 1em;
    font-style: normal;
    text-align: center;
    text-decoration: none;
    border-radius: .28571429rem;
    font-size: 1rem;
    color: #fff;
    &:hover {
        background-color: #b71c1c;
        color: #fff;
        text-shadow: none;
    }
`

export const StyledSubmitButton = styled.button`
    width:100%;
    background-color: #2185d0;
    cursor: pointer;
    display: inline-block;
    min-height: 1.5em;
    outline: 0;
    border: none;
    vertical-align: baseline;
    font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
    margin: 0 .25em 0 0;
    padding: .78571429em 1.5em .78571429em;
    text-transform: none;
    text-shadow: none;
    font-weight: 700;
    line-height: 1em;
    font-style: normal;
    text-align: center;
    text-decoration: none;
    border-radius: .28571429rem;
    font-size: 1rem;
    color: #fff;
    background-color: #21ba45;
    &:hover {
        background-color: #16ab39;
        color: #fff;
        text-shadow: none;
    }
`

export const StyledThumbnailPreview = styled.div`
height:${props => props.small ? '70px' : '250px'};
background-color:#e2e2e2;
background-image:${props => props.file ? `url("${props.file}")` : '#e2e2e2'}; 
width: ${props => props.small ? '100px' : '100%'};
max-width:500px;
margin-bottom: 20px; 
border-radius: 10px;
background-position: center;
background-size: cover;
background-repeat: no-repeat;
`

