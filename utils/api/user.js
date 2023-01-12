import useSWR from 'swr'
import { fetcher } from './base'

// NOTE(alishaevn): this path is likely to change as a of result of next week's tech meeting, but this sets the foundation
export const useCurrentUser = () => {
  const { data, error } = useSWR(`/users/profile.json`, fetcher)

  return {
    user: data?.user,
    userLoading: !error && !data,
    userError: error,
  }
}
