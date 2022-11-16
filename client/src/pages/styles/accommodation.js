import styled  from "styled-components";
import { Link } from 'react-router-dom';

export const StyledRangePickerContainer = styled.div`
  @media (max-width: 790px) {
    .ant-picker-panels {
      flex-direction: column !important;
    }
  }
`;

export const StyledLink = styled(Link)`
  color:rgb(0,0,0);
  font-size:1.2em;
  &:hover {
    color:rgb(203,200,193);
  };
`;

export const StyledBookLinkContainer = styled.div`
padding: 10px; width: 100%; border: none; display:flex; justify-content:center;
`

export const StyledMainContainer = styled.div`
display: flex; margin: auto; justify-content: center; flex-direction: column; max-width: 500px;
`

export const StyledMainTitle = styled.h1`
text-align: center;
`

export const StyledAccommodationType = styled.p`
font-family: sans-serif; font-size: 1.2em; color: rgb(142,142,142); margin: 15px 0 15px 30px;
`

export const StyledMainImage = styled.img`
width: 100%;
`

export const StyledDescriptionWrapper = styled.div`
margin: 10px 0;
`
export const StyledDescription = styled.p`
font-size: 1.1em; color: rgb(150,150,150);
`

export const StyledAmenitiesList = styled.ul`
list-style-type: none;
`

export const StyledAmenitiesListItem = styled.li`

`

export const StyledDatePickerWrapper = styled.div`
width:100%;
`

export const StyledDateError = styled.p`
color:red;
`

export const StyledAmenitiesHeader = styled.h2`
margin-left:30px;
`