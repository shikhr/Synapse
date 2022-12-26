import { UseQueryResult } from '@tanstack/react-query';
import { type } from 'os';

interface ErrorWithRefetchProps {
  refetch: (options: {
    throwOnError: boolean;
    cancelRefetch: boolean;
  }) => Promise<UseQueryResult>;
}

export type { ErrorWithRefetchProps };
