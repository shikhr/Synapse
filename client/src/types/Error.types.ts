import { UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface ErrorWithRefetchProps {
  refetch: (options: {
    throwOnError: boolean;
    cancelRefetch: boolean;
  }) => Promise<UseQueryResult>;
}
interface DisplayErrorProps {
  refetch: (options: {
    throwOnError: boolean;
    cancelRefetch: boolean;
  }) => Promise<UseQueryResult>;
  error?: any;
}

export type { ErrorWithRefetchProps, DisplayErrorProps };
