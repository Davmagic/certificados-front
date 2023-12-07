import TableEnrolls from '@/app/students/[id]/TableEnrolls'
import PageHeader from './PageHeader'

export default function Course ({ params: { id } }) {
  return (
    <div>
      <PageHeader id={id} />
      <TableEnrolls id={id} type='courses' />
    </div>
  )
}
