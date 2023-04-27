import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const mode = core.getInput('action-mode')

    let headersConfig = {}

    switch (mode) {
      case 'issues': {
        headersConfig = {state: 'all'}
        break
      }
      case 'issues-open': {
        headersConfig = {state: 'open'}
        break
      }
      case 'issues-closed': {
        headersConfig = {state: 'closed'}
        break
      }
      case 'issues-opened-since-date': {
        const date = core.getInput('issues-from-date')
        const dateParsed = Date.parse(date)
        const dateNow = new Date()
        const formattedDate = dateParsed
          ? new Date(dateParsed)
          : new Date(dateNow.getFullYear(), dateNow.getMonth(), 1)

        headersConfig = {state: 'all', since: formattedDate.toISOString()}
        break
      }
    }

    const octokit = github.getOctokit(process.env.TOKEN || '')
    const result = await octokit.request('GET /issues', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        filter: 'all',
        ...headersConfig
      }
    })

    core.setOutput('response', result.data.length || 0)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
