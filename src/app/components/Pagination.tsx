interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <nav aria-label="Paginação" className="mt-8 flex justify-center">
      <ul className="flex gap-2 flex-wrap justify-center">
        {/* Previous Button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className={`px-3 py-2 rounded border transition-colors ${
              currentPage === 1 || loading
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground border-border'
            }`}
            aria-label="Página anterior"
          >
            ← Anterior
          </button>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <li key={`dots-${index}`} className="px-2 py-2">
                <span className="text-muted-foreground">...</span>
              </li>
            );
          }

          return (
            <li key={page}>
              <button
                onClick={() => onPageChange(page as number)}
                disabled={loading}
                className={`px-3 py-2 rounded border transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-primary-foreground border-primary font-bold'
                    : 'bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground border-border'
                }`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {String(page).padStart(2, '0')}
              </button>
            </li>
          );
        })}

        {/* Next Button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className={`px-3 py-2 rounded border transition-colors ${
              currentPage === totalPages || loading
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground border-border'
            }`}
            aria-label="Próxima página"
          >
            Próxima →
          </button>
        </li>
      </ul>
    </nav>
  );
}
