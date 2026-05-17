import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  itemLabel?: string;
  onPrev: () => void;
  onNext: () => void;
}

// Shows the current page inside a table + prev/next ctrls
const Pagination: React.FC<PaginationProps> = ({ page, totalPages, total, itemLabel = 'item', onPrev, onNext }) => (
  <div className="flex items-center justify-between mt-4">
    <span className="text-xs text-gray-500">
      {total} {itemLabel}{total !== 1 ? 's' : ''}
    </span>
    <div className="flex items-center gap-2">
      <button onClick={onPrev} disabled={page === 0} className="p-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50">
        <ChevronLeft size={14} />
      </button>
      <span className="text-xs text-gray-600 px-1">Page {page + 1} / {totalPages}</span>
      <button onClick={onNext} disabled={page >= totalPages - 1} className="p-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50">
        <ChevronRight size={14} />
      </button>
    </div>
  </div>
);

export default Pagination;

