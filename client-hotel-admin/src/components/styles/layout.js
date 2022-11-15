import styled from 'styled-components'
import ListItem from '@material-ui/core/ListItem';

export const StyledListItem = styled(ListItem)`
    background:${props => props.isDark ? 'rgb(240, 240, 240)' : ''} !important;
`