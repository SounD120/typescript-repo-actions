import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const mode = core.getInput('action-mode')

    const owner = core.getInput('owner')
    const repo = core.getInput('repo')

    let query = {}

    switch (mode) {
      case 'issues-all': {
        query = { state: 'all' }
        break
      }
      case 'issues-open': {
        query = { state: 'open' }
        break
      }
      case 'issues-closed': {
        query = { state: 'closed' }
        break
      }
      case 'issues-opened-since-date': {
        const date = core.getInput('issues-from-date')
        const dateParsed = Date.parse(date)
        const dateNow = new Date()
        const formattedDate = dateParsed
          ? new Date(dateParsed)
          : new Date(dateNow.getFullYear(), dateNow.getMonth(), 1)

        query = { state: 'all', since: formattedDate.toISOString() }
        break
      }
    }

    const octokit = github.getOctokit(process.env.TOKEN || '')
    const result = await octokit.request('GET /repos/{owner}/{repo}/issues', {
      owner,
      repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        accept: 'application/vnd.github+json',
      },
      query
    })

    console.log(`response = ${result.data.length || 0}`)
    core.setOutput('response', result.data.length || 0)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
