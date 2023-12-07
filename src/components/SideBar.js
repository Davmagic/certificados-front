import { Drawer, List, ListItem, Typography } from '@mui/material'
import Link from 'next/link'

const SideBar = ({ DRAWER_WIDTH = 0, options = [] }) => {
  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          top: ['48px', '56px', '64px'],
          height: 'auto',
          bottom: 0
        }
      }}
      variant='permanent'
      anchor='right'
    >
      <List sx={{ px: 2 }}>
        {options.map(option => (
          <ListItem disablePadding key={option.id}>
            <Typography variant='overline' sx={{ fontWeight: 500 }} component={option.link ? Link : null}>
              {option.label}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default SideBar
