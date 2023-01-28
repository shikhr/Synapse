import {
  ReactNode,
  MutableRefObject,
  useMemo,
  forwardRef,
  ForwardedRef,
} from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';

interface InfiniteScrollListProps {
  isLoadingError: boolean;
  isLoading: boolean;
  LoadingSkeleton: JSX.Element;
  LoadingErrorComponent: JSX.Element;
  FeedErrorComponent: JSX.Element;
  data: any;
  hasNextPage: boolean | undefined;
  ListItemComponent: any;
  ListItemProps?: any;
  NoContentElement?: ReactNode;
  isFetchingNextPage: boolean;
  isError: boolean;
}
interface feedPage {
  data: string[];
  meta: {
    currentPage: number;
    hasMorePages: boolean;
    totalPages: number;
  };
}

const InfiniteScrollList = forwardRef(
  (
    {
      isLoading,
      isLoadingError,
      LoadingSkeleton,
      LoadingErrorComponent,
      FeedErrorComponent,
      data,
      hasNextPage,
      ListItemComponent,
      NoContentElement,
      ListItemProps,
      isError,
      isFetchingNextPage,
    }: InfiniteScrollListProps,
    ref: ForwardedRef<HTMLDivElement | null>
  ) => {
    if (isLoadingError) {
      return LoadingErrorComponent;
    }

    const content = useMemo(
      () =>
        data?.pages.flatMap((page: feedPage) =>
          page.data.map((id: string) => (
            <ListItemComponent key={id} id={id} {...ListItemProps} />
          ))
        ),
      [data]
    );

    return (
      <div className="text-text-primary-dark">
        {isLoading && (
          <>
            {LoadingSkeleton}
            {LoadingSkeleton}
            {LoadingSkeleton}
            {LoadingSkeleton}
          </>
        )}
        <div className="flex flex-col">{data && data.pages && content}</div>
        {content?.length === 0 && !hasNextPage && NoContentElement && (
          <div className="px-4 py-8 flex flex-col justify-center items-center text-center gap-6 text-text-secondary-dark">
            {NoContentElement}
          </div>
        )}
        {isError && !isFetchingNextPage && FeedErrorComponent}
        <div ref={ref}>
          {isFetchingNextPage && hasNextPage && LoadingSkeleton}
        </div>
        <div>
          {content?.length !== 0 && !isFetchingNextPage && !hasNextPage && (
            <div className="w-full text-center px-2 py-8 text-text-secondary-dark">
              You have reached the end
            </div>
          )}
        </div>
      </div>
    );
  }
);
export default InfiniteScrollList;
