import styled from "styled-components";
import { Select } from "semantic-ui-react";

export const StyledMainWrapper = styled.div`
margin: auto; maxWidth: 800px;
`

export const StyledContentWrapper = styled.div`
display:flex;justify-content:center;
`

export const StyledTitle = styled.h1`text-align:center;`

export const StyledSelect = styled(Select)`
width: 320px;
`

export const StyledSelectsWrapper = styled.div`
display: flex; 
justify-content: space-around; 
margin-bottom: 20px; 
flex-direction: ${props => props.windowSize[0] > 700 ? 'row' : 'column'};
`

export const StyledSelectContainer = styled.div`
margin: 20px auto;
`

export const StyledSubmitButtonContainer = styled.div`
margin: 20px;display:flex;justify-content:center;
`