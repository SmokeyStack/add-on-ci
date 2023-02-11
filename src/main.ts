import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as glob from '@actions/glob'
import { SummaryTableCell, SummaryTableRow } from '@actions/core/lib/summary'

import { promises } from 'fs'
import * as path from 'path'

import {
    BDS_PATH
} from './types/inputs'
import { readFile } from 'fs/promises'

async function run(): Promise<void> {
    try {
        switch (process.platform) {
            case 'win32': {
                throw new Error('Unsupported platform: ${process.platform}')
            }
            case 'darwin': {
                throw new Error('Unsupported platform: ${process.platform}')
            }
        }

        await core.group('Run bedrock server', async () => {
            await exec.exec(
                path.join(process.cwd(), BDS_PATH, 'bedrock_server'),
                [],
                {
                    cwd: path.join(process.cwd(),)
                }
            )
        })

        core.summary.addHeading('Test results')

        const globber = await glob.create(
            path.join(process.cwd(), BDS_PATH, 'ContentLog__*')
        )
        for await (const cl of globber.globGenerator()) {
            const flbuf = await readFile(cl, 'utf8')
            core.summary.addSeparator()
            core.summary.addHeading(cl)
            core.summary.addCodeBlock(flbuf)
        }

        core.summary.write()
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

run()