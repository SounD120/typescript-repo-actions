import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const mode = core.getInput('action-mode')

    const owner = core.getInput('owner')
    const repo = core.getInput('repo')

    let query: { state: string, since?: string } = { state: 'all' }

    switch (mode) {
      case 'issues-all': {
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

        let dateParsed
        if (date) {
          dateParsed = Date.parse(date)
          if (!dateParsed) {
            throw new Error('Incorrect Date')
          }

          // Convert timestamp to ISO8601 string
          dateParsed = new Date(dateParsed).toISOString()
        } else {
          const dateNow = new Date()

          // Get the first day of the previous month and convert to ISO8601
          dateParsed = new Date(dateNow.getFullYear(), dateNow.getMonth() - 1, 1).toISOString()
        }

        query = { state: 'all', since: dateParsed }
        break
      }
      default: {
        throw new Error('action-mode value is not issues-all, issues-open, issues-closed or issues-opened-since-date')
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

    core.setOutput('response', result.data.length || 0)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('Unknown error')
    }
  }
}

run()
