import { useMutation, useQuery } from '@tanstack/react-query'
import { usersService } from '../services'
import type { User, CreateUserRequest, UpdateUserRequest } from '../services'

export const CURRENT_USER_QUERY_KEY = ['users', 'me'] as const
export const userByIdQueryKey = (userId: string) => ['users', userId] as const

export const useCreateUser = () => {
  const { mutateAsync, isPending, error } = useMutation<User, Error, CreateUserRequest>({
    mutationFn: (data) => usersService.createUser(data),
  })

  return {
    createUser: mutateAsync,
    loading: isPending,
    error,
  }
}

export const useCurrentUser = () => {
  const { data, isLoading, error, refetch } = useQuery<User>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: () => usersService.getCurrentUser(),
  })

  return {
    user: data ?? null,
    loading: isLoading,
    error,
    refetch,
  }
}

export const useGetUser = (userId: string) => {
  const { data, isLoading, error } = useQuery<User>({
    queryKey: userByIdQueryKey(userId),
    queryFn: () => usersService.getUserById(userId),
    enabled: Boolean(userId),
  })

  return {
    user: data ?? null,
    loading: isLoading,
    error,
  }
}

export const useUpdateUser = () => {
  const { mutateAsync, isPending, error } = useMutation<
    User,
    Error,
    { userId: string; data: UpdateUserRequest }
  >({
    mutationFn: ({ userId, data }) => usersService.updateUser(userId, data),
  })

  return {
    updateUser: (userId: string, data: UpdateUserRequest) => mutateAsync({ userId, data }),
    loading: isPending,
    error,
  }
}

export const useUsers = () => {
  const { createUser, loading: createLoading, error: createError } = useCreateUser()
  const { updateUser, loading: updateLoading, error: updateError } = useUpdateUser()

  return {
    loading: createLoading || updateLoading,
    error: createError ?? updateError ?? null,
    createUser,
    updateUser,
  }
}
