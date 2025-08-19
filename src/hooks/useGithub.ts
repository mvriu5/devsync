import { useQuery } from '@tanstack/react-query'
import { Octokit } from '@octokit/rest'

async function fetchGitHubRepos(accessToken: string) {
    if (!accessToken) throw new Error('No access token')

    const octokit = new Octokit({ auth: accessToken })

    const repos = []
    let page = 1
    let hasMore = true

    while (hasMore) {
        const { data } = await octokit.rest.repos.listForAuthenticatedUser({
            per_page: 100,
            sort: 'updated',
            page
        })

        repos.push(...data)
        hasMore = data.length === 100
        page++
    }

    return repos
}

export const useGitHubRepos = (accessToken: string) => {
    return useQuery({
        queryKey: ['github-repos', 'authenticated'],
        queryFn: () => fetchGitHubRepos(accessToken),
        enabled: !!accessToken,
        staleTime: 1000 * 60 * 5
    })
}