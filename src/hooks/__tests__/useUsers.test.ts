/**
 * useUsers Hook Tests
 */

import { renderHook, waitFor } from '@testing-library/react'
import { act } from 'react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useCreateUser,
  useCurrentUser,
  useGetUser,
  useUpdateUser,
  useUsers,
} from '../useUsers'
import { usersService } from '../../services'
import type { User, CreateUserRequest, UpdateUserRequest } from '../../services'

vi.mock('../../services', () => ({
  usersService: {
    createUser: vi.fn(),
    getCurrentUser: vi.fn(),
    getUserById: vi.fn(),
    updateUser: vi.fn(),
  },
}))

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
  return Wrapper
}

describe('useUsers Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockUser: User = {
    id: 'user123',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone_number: '+1234567890',
    id_type: 'passport',
    role: 'user',
  }

  describe('useCreateUser', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useCreateUser(), { wrapper: makeWrapper() })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(typeof result.current.createUser).toBe('function')
    })

    it('should successfully create a user', async () => {
      const mockRequest: CreateUserRequest = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
        password: 'securePassword123',
      }

      ;(usersService.createUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)

      const { result } = renderHook(() => useCreateUser(), { wrapper: makeWrapper() })

      let returnedUser: User | undefined

      await act(async () => {
        returnedUser = await result.current.createUser(mockRequest)
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(usersService.createUser).toHaveBeenCalledWith(mockRequest)
      expect(returnedUser).toEqual(mockUser)
      expect(result.current.error).toBeNull()
    })

    it('should set loading state during user creation', async () => {
      const mockRequest: CreateUserRequest = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
        password: 'securePassword123',
      }

      ;(usersService.createUser as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockUser), 100))
      )

      const { result } = renderHook(() => useCreateUser(), { wrapper: makeWrapper() })

      act(() => {
        result.current.createUser(mockRequest)
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(true)
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })

    it('should handle errors during user creation', async () => {
      const mockRequest: CreateUserRequest = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
        password: 'securePassword123',
      }

      const err = new Error('API Error')
      ;(usersService.createUser as ReturnType<typeof vi.fn>).mockRejectedValue(err)

      const { result } = renderHook(() => useCreateUser(), { wrapper: makeWrapper() })

      await act(async () => {
        try {
          await result.current.createUser(mockRequest)
        } catch {
          // expected
        }
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toEqual(err)
      })
    })

    it('should clear error on subsequent successful call', async () => {
      const mockRequest: CreateUserRequest = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
        password: 'securePassword123',
      }

      const err = new Error('API Error')
      ;(usersService.createUser as ReturnType<typeof vi.fn>)
        .mockRejectedValueOnce(err)
        .mockResolvedValueOnce(mockUser)

      const { result } = renderHook(() => useCreateUser(), { wrapper: makeWrapper() })

      await act(async () => {
        try {
          await result.current.createUser(mockRequest)
        } catch {
          // expected
        }
      })

      await waitFor(() => {
        expect(result.current.error).toEqual(err)
      })

      await act(async () => {
        await result.current.createUser(mockRequest)
      })

      await waitFor(() => {
        expect(result.current.error).toBeNull()
      })
    })
  })

  describe('useCurrentUser', () => {
    it('should initialize with loading state while fetching', () => {
      ;(usersService.getCurrentUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)
      const { result } = renderHook(() => useCurrentUser(), { wrapper: makeWrapper() })

      // On mount it fires the query
      expect(result.current.loading).toBe(true)
      expect(result.current.user).toBeNull()
    })

    it('should expose user data after successful fetch', async () => {
      ;(usersService.getCurrentUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)

      const { result } = renderHook(() => useCurrentUser(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(usersService.getCurrentUser).toHaveBeenCalled()
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.error).toBeNull()
    })

    it('should expose error when fetch fails', async () => {
      const err = new Error('Unauthorized')
      ;(usersService.getCurrentUser as ReturnType<typeof vi.fn>).mockRejectedValue(err)

      const { result } = renderHook(() => useCurrentUser(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toBeNull()
      expect(result.current.error).toEqual(err)
    })
  })

  describe('useGetUser', () => {
    it('should not fetch when userId is empty', () => {
      const { result } = renderHook(() => useGetUser(''), { wrapper: makeWrapper() })

      expect(result.current.loading).toBe(false)
      expect(usersService.getUserById).not.toHaveBeenCalled()
    })

    it('should fetch and return user by ID', async () => {
      const userId = 'user123'
      ;(usersService.getUserById as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)

      const { result } = renderHook(() => useGetUser(userId), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(usersService.getUserById).toHaveBeenCalledWith(userId)
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.error).toBeNull()
    })

    it('should handle user not found errors', async () => {
      const userId = 'nonexistent'
      const err = new Error('User not found')
      ;(usersService.getUserById as ReturnType<typeof vi.fn>).mockRejectedValue(err)

      const { result } = renderHook(() => useGetUser(userId), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toBeNull()
      expect(result.current.error).toEqual(err)
    })
  })

  describe('useUpdateUser', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useUpdateUser(), { wrapper: makeWrapper() })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(typeof result.current.updateUser).toBe('function')
    })

    it('should successfully update user', async () => {
      const userId = 'user123'
      const updateRequest: UpdateUserRequest = {
        first_name: 'Jane',
        last_name: 'Smith',
      }

      const updatedUser: User = { ...mockUser, first_name: 'Jane', last_name: 'Smith' }
      ;(usersService.updateUser as ReturnType<typeof vi.fn>).mockResolvedValue(updatedUser)

      const { result } = renderHook(() => useUpdateUser(), { wrapper: makeWrapper() })

      let returnedUser: User | undefined

      await act(async () => {
        returnedUser = await result.current.updateUser(userId, updateRequest)
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(usersService.updateUser).toHaveBeenCalledWith(userId, updateRequest)
      expect(returnedUser).toEqual(updatedUser)
      expect(result.current.error).toBeNull()
    })

    it('should handle validation errors', async () => {
      const userId = 'user123'
      const updateRequest: UpdateUserRequest = { email: 'invalid-email' }
      const err = new Error('Invalid email format')
      ;(usersService.updateUser as ReturnType<typeof vi.fn>).mockRejectedValue(err)

      const { result } = renderHook(() => useUpdateUser(), { wrapper: makeWrapper() })

      await act(async () => {
        try {
          await result.current.updateUser(userId, updateRequest)
        } catch {
          // expected
        }
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toEqual(err)
      })
    })
  })

  describe('useUsers (combined hook)', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useUsers(), { wrapper: makeWrapper() })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(typeof result.current.createUser).toBe('function')
      expect(typeof result.current.updateUser).toBe('function')
    })

    it('should successfully create user using combined hook', async () => {
      const mockRequest: CreateUserRequest = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
        password: 'securePassword123',
      }

      ;(usersService.createUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)

      const { result } = renderHook(() => useUsers(), { wrapper: makeWrapper() })

      await act(async () => {
        await result.current.createUser(mockRequest)
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(usersService.createUser).toHaveBeenCalledWith(mockRequest)
      expect(result.current.error).toBeNull()
    })

    it('should successfully update user using combined hook', async () => {
      const userId = 'user123'
      const updateRequest: UpdateUserRequest = { first_name: 'Jane' }
      const updatedUser: User = { ...mockUser, first_name: 'Jane' }
      ;(usersService.updateUser as ReturnType<typeof vi.fn>).mockResolvedValue(updatedUser)

      const { result } = renderHook(() => useUsers(), { wrapper: makeWrapper() })

      await act(async () => {
        await result.current.updateUser(userId, updateRequest)
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(usersService.updateUser).toHaveBeenCalledWith(userId, updateRequest)
      expect(result.current.error).toBeNull()
    })

    it('should set error when createUser fails', async () => {
      const err = new Error('API Error')
      ;(usersService.createUser as ReturnType<typeof vi.fn>).mockRejectedValue(err)

      const { result } = renderHook(() => useUsers(), { wrapper: makeWrapper() })

      const mockRequest: CreateUserRequest = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
        password: 'securePassword123',
      }

      await act(async () => {
        try {
          await result.current.createUser(mockRequest)
        } catch {
          // expected
        }
      })

      await waitFor(() => {
        expect(result.current.error).toEqual(err)
      })
    })

    it('should handle sequential create then update operations', async () => {
      const userId = 'user123'
      const updateRequest: UpdateUserRequest = { first_name: 'Jane' }

      ;(usersService.createUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)
      ;(usersService.updateUser as ReturnType<typeof vi.fn>).mockResolvedValue({ ...mockUser, first_name: 'Jane' })

      const { result } = renderHook(() => useUsers(), { wrapper: makeWrapper() })

      const mockRequest: CreateUserRequest = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
        password: 'securePassword123',
      }

      await act(async () => {
        await result.current.createUser(mockRequest)
      })

      await act(async () => {
        await result.current.updateUser(userId, updateRequest)
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(usersService.createUser).toHaveBeenCalled()
      expect(usersService.updateUser).toHaveBeenCalledWith(userId, updateRequest)
      expect(result.current.error).toBeNull()
    })
  })
})
