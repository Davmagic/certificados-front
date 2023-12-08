/* eslint-disable no-unreachable */
import moment from 'moment'
import {
  PdfMakeWrapper,
  Columns,
  QR,
  Stack,
  Txt,
  Img,
  Line,
  Canvas
} from 'pdfmake-wrapper'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'

PdfMakeWrapper.setFonts(pdfFonts)

const imageTop = 'https://dluxapp.s3.amazonaws.com/media/notifications_images/centro-header.png'
const imageLogo = 'https://dluxapp.s3.amazonaws.com/media/notifications_images/centro-logo.png'
const imageFooter = 'https://dluxapp.s3.amazonaws.com/media/notifications_images/centro-footer.png'
const providerEntity = 'CÁMARA ARTESANAL POPULAR DE CAPACITACIÓN ARTEC S.A.S. B.L.C.'
const QR_BASE = `${process.env.NEXT_PUBLIC_API_URL}/enrolls`

const largeSize = 15
const mediumSize = 12
const smallSize = 10

export default async function createPDF ({ student, course, ...enroll }) {
  const pdf = new PdfMakeWrapper()
  pdf.pageSize('A4')

  pdf.header(
    await new Img(imageTop).width(650).alignment('center').relativePosition(0, -30).build()
  )

  pdf.add(
    new Stack([
      await new Img(imageLogo).width(100).alignment('center').margin([0, 10]).build(),
      new Txt(providerEntity).alignment('center').fontSize(largeSize).margin(20).bold().end,
      new Txt('NÚMERO DE INSCRIPCIÓN EN EL REGISTRO SOCIETARIO: 110437').alignment('center').italics().fontSize(mediumSize).margin([0, 0, 0, 20]).end,
      new Txt('OTORGA A:').alignment('center').fontSize(largeSize).margin([0, 0, 0, 15]).bold().end,
      new Txt(`${student.user.name} ${student.user.lastname} - ${student.user.dni}`).alignment('center').fontSize(largeSize).margin([0, 0, 0, 15]).bold().end,
      new Canvas([
        new Line([0, 0], [350, 0]).lineWidth(10).color('black').end
      ]).alignment('center').end,
      new Txt(`CERTIFICADO DE ${enroll.title || 'MAESTRO DE TALLER'}`).alignment('center').fontSize(largeSize).margin([0, 20, 0, 15]).end,
      new Txt(`CURSO: ${course.name}`).alignment('center').fontSize(mediumSize).margin([0, 0, 0, 15]).bold().end,
      new Txt(`CON UNA DURACIÓN DE ${course.hours} HORAS TEÓRICAS Y PRÁCTICAS`).alignment('center').fontSize(smallSize).end,
      new Txt('MODALIDAD PRESENCIAL').alignment('center').fontSize(smallSize).end,
      new Txt(`Fecha de emisión del certificado: ${moment(enroll.emittedAt).format('MMMM DD, YYYY')}.`).alignment('center').italics().fontSize(smallSize).margin([0, 20, 0, 15]).end,
      new Columns([
        new Stack([
          await new Img(imageLogo).width(100).alignment('center').margin([0, 10]).build(),
          new Txt('Firma autorizada').alignment('center').fontSize(smallSize).end
        ]).end,
        new QR(`${QR_BASE}?dni=${student.user.dni}`).fit(75).eccLevel('L').end,
        new Stack([
          await new Img(imageLogo).width(100).alignment('center').margin([0, 10]).build(),
          new Txt('Second authorized sign').alignment('center').fontSize(smallSize).end
        ]).end
      ]).alignment('center').margin(20).end
    ]).width('100%').alignment('center').end
  )

  pdf.footer(
    await new Img(imageFooter).width(650).alignment('center').relativePosition(0, -30).build()
  )

  pdf.create(`Certificado - ${student.user.dni}`).open()
}
