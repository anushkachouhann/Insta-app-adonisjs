import type { HttpContext } from '@adonisjs/core/http'
import ExcelJS from 'exceljs'
import PDFDocument from 'pdfkit'
import { PassThrough } from 'node:stream'

import { ReportService } from '#services/report_service'
import { downloadReportValidator } from '#validators/reports/download_report_validator'
import { handleError } from '#utils/response'

type PdfTableColumn<T> = {
  header: string
  width: number
  get: (row: T) => string
}

export default class ReportsController {
  private reportService = new ReportService()

  public async likes(ctx: HttpContext) {
    try {
      const { format } = await ctx.request.validateUsing(downloadReportValidator, {
        data: ctx.request.qs(),
      })
      const rows = await this.reportService.likesReport()

      if (format === 'excel') return this.streamLikesExcel(ctx, rows)
      return this.streamLikesPdf(ctx, rows)
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async comments(ctx: HttpContext) {
    try {
      const { format } = await ctx.request.validateUsing(downloadReportValidator, {
        data: ctx.request.qs(),
      })
      const rows = await this.reportService.commentsReport()

      if (format === 'excel') return this.streamCommentsExcel(ctx, rows)
      return this.streamCommentsPdf(ctx, rows)
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  private async streamLikesExcel(
    ctx: HttpContext,
    rows: Awaited<ReturnType<ReportService['likesReport']>>
  ) {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Likes')

    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'User ID', key: 'userId', width: 10 },
      { header: 'Username', key: 'username', width: 20 },
      { header: 'Post ID', key: 'postId', width: 10 },
      { header: 'Post Type', key: 'postType', width: 10 },
      { header: 'Caption', key: 'caption', width: 40 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ]

    rows.forEach((r) => sheet.addRow(r))
    this.styleExcelSheet(sheet, { lastColumn: 'G' })

    ctx.response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    ctx.response.header('Content-Disposition', 'attachment; filename="likes-report.xlsx"')

    const stream = new PassThrough()
    void workbook.xlsx.write(stream).then(() => stream.end())
    return ctx.response.stream(stream)
  }

  private streamLikesPdf(
    ctx: HttpContext,
    rows: Awaited<ReturnType<ReportService['likesReport']>>
  ) {
    ctx.response.header('Content-Type', 'application/pdf')
    ctx.response.header('Content-Disposition', 'attachment; filename="likes-report.pdf"')

    const doc = new PDFDocument({ margin: 30 })
    const stream = new PassThrough()
    doc.pipe(stream)

    doc.fontSize(18).fillColor('#0f172a').text('Likes Report')
    doc.moveDown(0.25)
    doc
      .fontSize(10)
      .fillColor('#475569')
      .text(`Generated at: ${new Date().toISOString()}   •   Total rows: ${rows.length}`)
    doc.moveDown(0.75)

    const columns: PdfTableColumn<(typeof rows)[number]>[] = [
      { header: 'ID', width: 34, get: (r) => String(r.id) },
      { header: 'User', width: 120, get: (r) => `${r.username} (${r.userId})` },
      { header: 'Post', width: 70, get: (r) => `${r.postId}` },
      { header: 'Type', width: 48, get: (r) => r.postType },
      { header: 'Caption', width: 170, get: (r) => r.caption ?? '' },
      { header: 'Created', width: 95, get: (r) => r.createdAt },
    ]

    this.drawPdfTable(doc, rows, columns)

    doc.end()
    return ctx.response.stream(stream)
  }

  private async streamCommentsExcel(
    ctx: HttpContext,
    rows: Awaited<ReturnType<ReportService['commentsReport']>>
  ) {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Comments')

    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'User ID', key: 'userId', width: 10 },
      { header: 'Username', key: 'username', width: 20 },
      { header: 'Post ID', key: 'postId', width: 10 },
      { header: 'Parent ID', key: 'parentId', width: 10 },
      { header: 'Content', key: 'content', width: 40 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ]

    rows.forEach((r) => sheet.addRow(r))
    this.styleExcelSheet(sheet, { lastColumn: 'G' })

    ctx.response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    ctx.response.header('Content-Disposition', 'attachment; filename="comments-report.xlsx"')

    const stream = new PassThrough()
    void workbook.xlsx.write(stream).then(() => stream.end())
    return ctx.response.stream(stream)
  }

  private streamCommentsPdf(
    ctx: HttpContext,
    rows: Awaited<ReturnType<ReportService['commentsReport']>>
  ) {
    ctx.response.header('Content-Type', 'application/pdf')
    ctx.response.header('Content-Disposition', 'attachment; filename="comments-report.pdf"')

    const doc = new PDFDocument({ margin: 30 })
    const stream = new PassThrough()
    doc.pipe(stream)

    doc.fontSize(18).fillColor('#0f172a').text('Comments Report')
    doc.moveDown(0.25)
    doc
      .fontSize(10)
      .fillColor('#475569')
      .text(`Generated at: ${new Date().toISOString()}   •   Total rows: ${rows.length}`)
    doc.moveDown(0.75)

    const columns: PdfTableColumn<(typeof rows)[number]>[] = [
      { header: 'ID', width: 34, get: (r) => String(r.id) },
      { header: 'User', width: 120, get: (r) => `${r.username} (${r.userId})` },
      { header: 'Post', width: 54, get: (r) => `${r.postId}` },
      { header: 'Parent', width: 46, get: (r) => (r.parentId ? String(r.parentId) : '') },
      { header: 'Content', width: 221, get: (r) => r.content },
      { header: 'Created', width: 95, get: (r) => r.createdAt },
    ]

    this.drawPdfTable(doc, rows, columns)

    doc.end()
    return ctx.response.stream(stream)
  }

  private styleExcelSheet(sheet: ExcelJS.Worksheet, opts: { lastColumn: string }) {
    sheet.views = [{ state: 'frozen', ySplit: 1 }]
    sheet.autoFilter = { from: 'A1', to: `${opts.lastColumn}1` }

    const headerRow = sheet.getRow(1)
    headerRow.height = 20

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E293B' }, // slate-800
      }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      }
    })

    // Borders + wrapping for body
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true }
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        }
      })
    })
  }

  private drawPdfTable<T>(doc: PDFKit.PDFDocument, rows: T[], columns: PdfTableColumn<T>[]) {
    const left = doc.page.margins.left
    const right = doc.page.width - doc.page.margins.right
    const topLimit = doc.page.margins.top
    const bottomLimit = doc.page.height - doc.page.margins.bottom

    const tableWidth = right - left
    const requestedWidth = columns.reduce((sum, c) => sum + c.width, 0)
    const scale = requestedWidth > 0 ? tableWidth / requestedWidth : 1
    const cols = columns.map((c) => ({ ...c, width: Math.floor(c.width * scale) }))

    const paddingX = 4
    const paddingY = 4
    const borderColor = '#cbd5e1'
    const headerFill = '#0f172a'
    const headerText = '#ffffff'
    const textColor = '#0f172a'

    let y = doc.y

    const drawHeader = () => {
      const headerHeight = 22
      if (y + headerHeight > bottomLimit) {
        doc.addPage()
        y = topLimit
      }

      let x = left
      doc.save()
      doc.rect(left, y, tableWidth, headerHeight).fill(headerFill)
      doc.restore()

      doc.fontSize(10).fillColor(headerText)
      for (const c of cols) {
        doc.rect(x, y, c.width, headerHeight).stroke(borderColor)
        doc.text(c.header, x + paddingX, y + 6, {
          width: c.width - paddingX * 2,
          align: 'left',
          lineBreak: false,
        })
        x += c.width
      }

      y += headerHeight
    }

    const drawRow = (row: T) => {
      const fontSize = 9
      doc.fontSize(fontSize).fillColor(textColor)

      // measure row height by max wrapped cell height
      let rowHeight = 0
      for (const c of cols) {
        const text = c.get(row) ?? ''
        const h = doc.heightOfString(text, { width: c.width - paddingX * 2 })
        rowHeight = Math.max(rowHeight, h + paddingY * 2)
      }
      rowHeight = Math.max(18, rowHeight)

      if (y + rowHeight > bottomLimit) {
        doc.addPage()
        y = topLimit
        drawHeader()
      }

      let x = left
      for (const c of cols) {
        doc.rect(x, y, c.width, rowHeight).stroke(borderColor)
        doc.text(c.get(row) ?? '', x + paddingX, y + paddingY, {
          width: c.width - paddingX * 2,
          align: 'left',
        })
        x += c.width
      }
      y += rowHeight
    }

    drawHeader()
    for (const r of rows) drawRow(r)

    doc.moveDown(0.5)
    doc.y = y + 10
  }
}
