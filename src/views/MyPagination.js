import Pagination from "react-bootstrap/Pagination";
import { usePagination, DOTS } from "../services/hooks/usePagination";

const MyPagination = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 2,
    currentPage,
    pageSize,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <nav aria-label="Page navigation example">
      <Pagination>
        <Pagination.Item disabled={currentPage === 1} onClick={onPrevious}>
          <div className="arrow left">&laquo;</div>
        </Pagination.Item>

        {paginationRange.map((pageNumber) => {
          if (pageNumber === DOTS) {
            return (
              <Pagination.Item className="page-item">&#8230;</Pagination.Item>
            );
          }

          return (
            <Pagination.Item
              className={
                pageNumber === currentPage ? "page-item active" : "page-item"
              }
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Pagination.Item>
          );
        })}

        <Pagination.Item disabled={currentPage === lastPage} onClick={onNext}>
          <div className="arrow right">&raquo;</div>
        </Pagination.Item>
      </Pagination>
    </nav>
  );
};

export default MyPagination;
