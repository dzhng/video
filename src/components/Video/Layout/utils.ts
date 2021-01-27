// find the right gridItem size to fit in all item given container area
// Took algorithm from: https://math.stackexchange.com/a/2570649
export function sizeForSquareThatFitInRect(width: number, height: number, n: number): number {
  const x = width;
  const y = height;

  // catch invalid values to avoid NaN output
  if (n <= 0 || x <= 0 || y <= 0) {
    return 0;
  }

  const ratio = x / y;
  const ncols_float = Math.sqrt(n * ratio);
  const nrows_float = n / ncols_float;

  // Find best option filling the whole height
  let nrows1 = Math.ceil(nrows_float);
  let ncols1 = Math.ceil(n / nrows1);
  while (nrows1 * ratio < ncols1) {
    nrows1++;
    ncols1 = Math.ceil(n / nrows1);
  }
  const cell_size1 = y / nrows1;

  // Find best option filling the whole width
  let ncols2 = Math.ceil(ncols_float);
  let nrows2 = Math.ceil(n / ncols2);
  while (ncols2 < nrows2 * ratio) {
    ncols2++;
    nrows2 = Math.ceil(n / ncols2);
  }
  const cell_size2 = x / ncols2;

  // Find the best values
  if (cell_size1 < cell_size2) {
    return cell_size2;
  } else {
    return cell_size1;
  }
}
