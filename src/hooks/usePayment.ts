import { useMutation } from '@tanstack/react-query'
import { paymentService } from '../services'
import type { StkPushRequest, StkPushResponse } from '../services'

export const useSTKPush = () => {
  const { mutateAsync, isPending, error, data, reset } = useMutation<
    StkPushResponse,
    Error,
    StkPushRequest
  >({
    mutationFn: (request) => paymentService.initiateSTKPush(request),
  })

  return {
    initiateSTKPush: mutateAsync,
    loading: isPending,
    error,
    response: data ?? null,
    reset,
  }
}
