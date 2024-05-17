'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { EVENT_PAGE_LIMIT } from '@/config';
import React from 'react';

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  total: number;
  limit?: number;
};

// Pagination client component. might need a server component in the future/
const PaginationClient = ({
  page,
  setPage,
  total,
  limit = EVENT_PAGE_LIMIT,
}: Props) => {
  const totalPages = Math.ceil(total / limit);

  // below is the logic to generate pages with ellipsis.
  // always show first page, last page, current page and its neibours. the rest is ellipsis.
  // not the most elegant solution, i know... it will do for now

  // generate pages array from 1 to totalPages
  const pagesArray = new Array(totalPages).fill(0).map((_, i) => i + 1);
  // keep current page, left of current page and right of current page.
  // set the rest to -1 (left side) or -2 (right side)
  // negative number means ellipsis
  for (let i = 1; i < page; i++) {
    if (pagesArray[i] !== page - 1 && pagesArray[i] !== page) {
      pagesArray[i] = -1;
    }
  }
  for (let i = page + 1; i < pagesArray.length - 1; i++) {
    if (pagesArray[i] !== page + 1 && pagesArray[i] !== page) {
      pagesArray[i] = -2;
    }
  }
  // generate a new array with unique page numbers with help from Set
  const pages = Array.from(new Set(pagesArray));
  // final touch up. replace the ellipsis with actual page number if it's between page 1 and 3 or totalPages - 2 and totalPages
  for (let i = 1; i < pages.length - 1; i++) {
    if (pages[i] < 0 && pages[i - 1] === i && pages[i + 1] === i + 2) {
      pages[i] = i + 1;
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
          />
        </PaginationItem>

        {pages.map((pg, index) => (
          <PaginationItem key={index}>
            {pg < 0 ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={page === pg}
                onClick={() => setPage(pg)}
              >
                {pg}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationClient;
