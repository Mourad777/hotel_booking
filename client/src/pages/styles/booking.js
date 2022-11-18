import styled from "styled-components"

export const StyledMainContainer = styled.div`
max-width: 700px; margin: auto; padding: 30px;
`

export const StyledMainTitle = styled.h1`
text-align:center;
`

export const StyledMainImage = styled.img`
width: 100%;
`

export const StyledAccommodationPrice = styled.p`
font-size: 1.5em;
`

export const StyledFormWrapper = styled.div`
width:300px;
margin:auto;
@media (min-width: 500px) {
      width: 450px;
  }
`

export const StyledBookingMessageContainer = styled.div`
width:320px;
height: 320px;
position:absolute;
top:50%;
left:50%;
transform:translate(-50%,-50%);
`

export const StyledBookingMessage = styled.p`
font-size:1.2em;
color:rgb(110,110,110);
`

export const StyledDatePickerWrapper = styled.div`
width:100%;
display:flex;
justify-content:space-around;
`