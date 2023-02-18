import * as cheerio from 'cheerio'
import { makeDir, write, print } from './file'
import Request from './request'

const request = new Request({
  cookie: 'Your Cookies'
})


/** 获取目录 */
type ScratchSections = (sectionDom: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI) => Promise<Array<{ link: string; title: string }>>
const scratchsections: ScratchSections = async (sectionDom, $) => {
  const sections = []
  for (const link of sectionDom) {
    sections.push({
      link: $(link).attr('href'),
      title: $(link).text()
    })
  }
  return sections
}

/** 获取章节内容 */
type ScratchSectionDetail = (sectionPath: string) => Promise<string>
const scratchSectionDetail: ScratchSectionDetail = async (sectionPath) => {
  const html = await request.get(sectionPath)
  const $ = cheerio.load(html)
  const content = $('textarea', '.cata-book-content')
  return content.attr('value')
}

/** 获取全书内容并生成文件 */
export type ScratchBook = (bookPath: string) => void
const scratchBook: ScratchBook = async (bookPath) => {
  print('开始爬取')
  const html = await request.get(`${bookPath}`)
  const $ = cheerio.load(html)
  const title = $('.title').eq(0).text()
  const links = $('ul.dot-list a.cap', '#a4')
  const outputPath = await makeDir(`../output/${title}`)
  print(`生成${title}目录`)
  const errorList = []

  const sections = await scratchsections(links, $)
  for (const section of sections) {
    const { link, title } = section

    const content = await scratchSectionDetail(link)
    const isDone = await write(`${outputPath}/${title}.md`, content.replaceAll('<br />', ''))
    if (isDone) {
      print(`完成：${title}`)
    } else {
      errorList.push(section)
      print(`爬取失败：${title}`)
    }
  }
  print(`爬取完成`)
  if (errorList.length) {
    print('除了：')
    errorList.forEach(({ title }) => {
      print(title)
    })
  }
}

export default scratchBook