import styled from "styled-components";
import { Button } from 'semantic-ui-react';

export const StyledMainContainer = styled.div`
margin: auto; max-width: 800px;
`
export const StyledMainTitle = styled.h1`
text-align:center;
`

export const StyledMobileAccommodationTitle = styled.h2`
text-align:center;
`

export const StyledTable = styled.table`
text-align:center;
width:100%;
`

export const StyledTableHead = styled.th`
text-align:left;
font-size:1.2em;
`

export const StyledTableRow = styled.tr`
height:100px;
`

export const StyledTableData = styled.td`
text-align:left;
font-size:1.2em;
`

export const StyledAccommodationImage = styled.img`
width:200px;
cursor:pointer;
`

export const StyledMobileAccommodationImage = styled.img`
width: 100%; cursor: pointer;
`

export const StyledDeleteButton = styled(Button)`
width: 100%;
`
