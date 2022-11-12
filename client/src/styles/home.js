import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const StyledRangePickerContainer = styled.div`
  @media (max-width: 790px) {
    .ant-picker-panels {
      flex-direction: column !important;
    }
  }
`;

export const StyledLink = styled(Link)`
color: #626262;
text-decoration: none;
margin: 1rem;
position: relative;
border:1px solid #e2e2e2;
border-radius:10%;
padding: 10px;
`;

export const Grid = styled.div`
position:absolute;
top:70%;
left:50%;
transform:translate(-50%,-50%);
`;

export const Row = styled.div`
display:flex;
`;

export const Column = styled.div`
flex:${props => props.size};
background:white;
width:300px;
height:450px;
padding:20px;
margin:10px;
`

export const CardImage = styled.img`
width:255px;
src:${props => props.src};
`

export const StyledRoomDescriptionContainer = styled.div`
height:300px;
background:#fbfbfb;
width:100%;
padding:20px;
`

export const StyledRoomThumbnail = styled.img`
width: 100%;
height:300px;
object-fit: cover;
@media (min-width: 700px) {
    width:500px;
  }
`

export const StyledRoomListItem = styled.div`
height:300px;
margin:10px;
display:flex;
@media (max-width: 750px) {
    flex-direction:column;
  }
`

export const StyledHeaderWrapper = styled.div`
height: 100vh; 
background: blue; 
width: 100%; 
position: relative;
`

export const StyledHeaderBackground = styled.div`
height: 100vh;
background: url('/images/pexels-cottonbro-5599611.jpg') bottom center no-repeat;
background-size: cover;
`

export const StyledDatePickerContainer = styled.div`
position: absolute;
top: 35%;
left: 50%;
transform: translate(-50%,-50%);
min-width: 360px;
`

export const StyledAccommodationDetails = styled.h3`
margin-left:16px;
`

export const StyledButtonsWrapper = styled.div`
display:flex;
justify-content:space-between;
width:120px;
`