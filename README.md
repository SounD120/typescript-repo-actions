<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Repo issues counter

## Usage:
```yml
- uses: SounD120/typescript-repo-actions@v1.0
  with:
    action-mode: 'issues-all'
    owner: SounD120
    repo: typescript-repo-actions
```
### Variables:

- <b>action-mode</b>: Can be 'issues-all', 'issues-open', 'issues-closed', 'issues-opened-since-date'
- <b>'date'</b>: Used in case of 'issues-opened-since-date' mode, in such case returns amount of issues created from the date. This is a timestamp in ISO 8601 format
- <b>'repo'</b>: Name of the repository in which we count issues
- <b>'owner'</b>: User or the organization, the owner of the repository