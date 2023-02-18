import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Buffer } from 'node:buffer'

export type MakeDir = (dirName: string) => Promise<string>
export const makeDir: MakeDir = async (dirName) => {
  const dirPath = resolve(__dirname, dirName)
  await mkdir(dirPath, { recursive: true })
  return dirPath
}

export type Write = (filepath: string, text: string) => Promise<boolean>
export const write = async (filepath, text) => {
  try {
    const data = new Uint8Array(Buffer.from(text))
    await writeFile(resolve(__dirname, filepath), data)
    return true
  } catch (e) {
    return false
  }
}

export type Print = (text: string) => void
export const print: Print = (text) => {
  console.log(text)
}