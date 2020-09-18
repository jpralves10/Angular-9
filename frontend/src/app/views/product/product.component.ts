import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { ProductReadFilter } from 'src/app/components/product/product-read/product-read-filter';
import { HeaderService } from 'src/app/components/template/header/header.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  current_filtro = {
    id: '',
    name: '',
    price: ''
  }

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private productReadFilter: ProductReadFilter
  ) {
    this.headerService.headerData = {
      title: 'Cadastro de Produtos',
      icon: 'storefront',
      routeUrl: '/products'
    }
  }

  ngOnInit(): void {
  }

  navigateToProductCreate(): void {
    this.router.navigate(['/products/create'])
  }

  updateFiltro() {
    this.productReadFilter.changeFilter(this.current_filtro);
  }

}
