import StudentCard from './StudentCard'
import TableEnrolls from './TableEnrolls'

const StudentDetail = ({ params }) => {
  const { id } = params

  return (
    <div>
      <StudentCard id={id} />
      <TableEnrolls id={id} />
    </div>
  )
}

export default StudentDetail
