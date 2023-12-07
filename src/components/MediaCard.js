import * as React from 'react'
import Image from 'next/image'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { Button } from '@mui/material'

export default function MediaCard ({ heading, text, image, href }) {
  return (
    <Card sx={{ height: '100%' }}>
      {image && <Image
        alt='Random image'
        src={image}
        width={640}
        height={480}
        style={{
          maxWidth: '100%',
          height: '200px',
          objectFit: 'cover'
        }}
                />}
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {heading}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {text}
        </Typography>
      </CardContent>
      <CardActions>
        {href ? <Link href={href} passHref><Button>Ir a.</Button></Link> : null}
      </CardActions>
    </Card>
  )
}
