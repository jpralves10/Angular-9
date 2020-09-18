import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ProductReadDataSource } from './product-read-datasource';
import { ProductService } from '../product.service';
import { Product } from '../product.model';
import { ProductReadFilter } from './product-read-filter';

@Component({
  selector: 'app-product-read',
  templateUrl: './product-read.component.html',
  styleUrls: ['./product-read.component.css']
})
export class ProductReadComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Product>;
  dataSource: ProductReadDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'price', 'action'];

  private filtroValue = {
    id: '', name: '', price: ''
  };

  constructor(
    private productService: ProductService,
    private productReadFilter: ProductReadFilter
  ) {
    productReadFilter.filter.subscribe(f => (this.filtroValue = f));
  }

  ngOnInit() {
    this.dataSource = new ProductReadDataSource(
      this.productReadFilter,
    );

    this.productReadFilter.clearFilter();
  }

  ngAfterViewInit() {
    this.initTableDataSource()
    
    this.productReadFilter.whenUpdatedSource.next([
      ...this.productReadFilter.whenUpdated,
      this.paginator
    ]);
  }

  initTableDataSource(){
    this.productService.read().subscribe(products => {
      this.dataSource.data = [...products]
      
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = undefined;
      this.table.dataSource = this.dataSource;
    })
  }

  updateFiltro() {
    this.productReadFilter.changeFilter(this.filtroValue);
  }

  deleteProduct(id: string){
    this.productService.delete(id).subscribe(() => {
      this.productService.showMessage("Produto excluido com sucesso!")
      this.initTableDataSource()
    })
  }
}
