import * as React from 'react';
import { QueryClientProvider as QueryProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

const QueryClientProvider = ({ children }: Props) => {
  return <QueryProvider client={queryClient}>{children}</QueryProvider>;
};

export default QueryClientProvider