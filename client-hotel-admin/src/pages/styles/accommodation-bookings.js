import { Select } from "semantic-ui-react"
import styled from "styled-components"
import {Button} from "semantic-ui-react"

export const StyledMainContainer = styled.div`
margin: auto; max-width: 800px;
`

export const StyledMainContentWrapper = styled.div`
margin-top:30px;
`

export const StyledTable = styled.table`
margin: auto; width: 100%;
`

export const StyledTableHead = styled.th`
font-size: 1.2em;
`

export const StyledTableRow = styled.tr`
height:100px;
`

export const StyledTableData = styled.td`
font-size: 1.2em; text-align: center;
`

export const StyledTableImageWrapper = styled.div`
flex-direction:column;
display:flex;
`

export const StyledTableImage = styled.img`
width: 200px;
cursor: pointer;
`

export const StyledMobileDetail = styled.p`
font-size: 1.2em;
`

export const StyledMobileImage = styled.img`
width: 100%;
cursor: pointer;
`

export const StyledTitle = styled.h1`
text-align:center;
`

export const StyledSelectsWrapper = styled.div`
display: flex; 
justify-content: space-around; 
margin-bottom: 20px; 
flex-direction: ${props => props.windowSize[0] > 700 ? 'row' : 'column'};
`

export const StyledSelectContainer = styled.div`
margin: 20px auto; width: 300px;
`
export const StyledSelect = styled(Select)`width:100%;`

export const StyledFilterButtonContainer = styled.div`
width: 300px; margin: auto;
`

export const StyledFilterButton = styled(Button)`
width:100%;
`

export const StyledDeleteButton = styled(Button)`
width: 100%;
`