import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Product } from '../product.model';
import { ProductReadFilter } from './product-read-filter';

/**
 * Data source for the ProductRead view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ProductReadDataSource extends DataSource<Product> {
  data: Product[] = [];
  paginator: MatPaginator;
  sort: MatSort;

  filteredData: Product[] = [];

  private filtro = {
    id: '', name: '', price: ''
  };

  constructor(
    private productReadFilter: ProductReadFilter
  ) {
    super();
    this.productReadFilter.filterSource.subscribe(filtro => (this.filtro = filtro));
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Product[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.productReadFilter.filterSource,
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => this.getUpdatedData()));
  }

  public getUpdatedData() {
    this.filteredData = this.getFilteredData(this.data);

    this.paginator.length = this.filteredData.length;
    var sortedFormularios = this.getPagedData(this.getSortedData(this.filteredData));   

    return sortedFormularios;
}

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  public getFilteredData(data: Product[]): Product[] {

    const { id, name, price } = this.filtro;

    let newData = data;

    if (id !== '') {
        newData = newData.filter(d =>
            d.id.toString().toUpperCase().includes(id.toString().toUpperCase())
        );
    }
    if (name !== '') {
        newData = newData.filter(d =>
            d.name.toUpperCase().includes(name.toUpperCase())
        );
    }
    if (price != null) {
        newData = newData.filter(d =>
            d.price.toString().replace(".", ",").toUpperCase().includes(price.toString().toUpperCase())
        );
    }

    return [...newData];
}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Product[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Product[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'name': return compare(a.name, b.name, isAsc);
        case 'price': return compare(a.price, b.price, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
