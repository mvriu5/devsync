import {Octokit} from "@octokit/rest"
import {useQuery} from "@tanstack/react-query"

export async function fetchGitHubCommits(accessToken: string, owner: string, repo: string) {
    if (!accessToken) throw new Error('No access token')

    const octokit = new Octokit({ auth: accessToken })

    const commits = []
    let page = 1
    let hasMore = true

    while (hasMore) {
        const { data } = await octokit.rest.repos.listCommits({
            owner,
            repo,
        })

        commits.push(...data)
        hasMore = data.length === 100
        page++
    }

    return commits
}

export const useGitHubCommits = (accessToken: string, owner: string, repo: string) => {
    return useQuery({
        queryKey: ['github-commits', owner, repo],
        queryFn: () => fetchGitHubCommits(accessToken, owner, repo),
        enabled: !!accessToken && !!owner && !!repo,
        staleTime: 1000 * 60 * 5,
    })
}