/* 
Pagination component to show custom page counts
Usage:
__________________________________________________________________________________________________
<pagination [totalRecords]=500" [sizePerPage]="125" (pageEvent)="makeApiCall($event)" [goToPageBox]="true"  [perPageDropDown]="50"></pagination>
__________________________________________________________________________________________________
## (pageEvent)   -> event fired when page is clicked
## makeApiCall() -> Your method which makes api call
## $event        -> Object containing page details e.g: { "offset": 5, "size": 125 }
## [goToPageBox] -> to show hide the go to page input box
## [perPageDropDown]="50" -> to show dropdown to change records per page, here 50 is multiple by which you want to changes records per page. Eg-> 50, 100, 150, 200, ...
*/
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, SimpleChange, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnDestroy {
  pages: any = [];
  pageNumbers: number;
  currentPage: number = 1;
  totalNumberButtons: number = 7;
  perPageOption: any;
  defaultSizePerPage: number;
  output: any;
  @Input() sizePerPage: number;
  @Input() totalRecords: number;
  @Input() goToPageBox?: boolean = false;
  @Input() perPageDropDown?: number;

  @Output() pageEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("gotoPageInput") gotoPageInput: ElementRef;

  constructor() {

  }

  ngOnInit() {
    this.defaultSizePerPage = this.sizePerPage;
    if (this.perPageDropDown) {
      this.generateDropDown();
    }
    this.initPagination();
  }

  public ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['totalRecords'] && changes['totalRecords'].currentValue) {
      this.totalRecords = changes['totalRecords'].currentValue;
      if (this.perPageDropDown) {
        this.generateDropDown();
      }
      this.initPagination();
    }
  }

  generateDropDown() {
    this.perPageOption = [];
    let loopCount = Math.ceil(this.totalRecords / this.perPageDropDown);

    for (let i = 1; i <= loopCount; i++) {
      this.perPageOption.push(i * this.perPageDropDown);
    }
  }

  initPagination() {
    let pages = this.pageNumbers = Math.ceil(this.totalRecords / this.sizePerPage);
    if (pages > this.totalNumberButtons) {
      for (let i = 1, l = pages; i <= l; i++) {
        this.createPagination(this.currentPage, pages);
      }
    } else {
      let range = [];
      for (let i = 1; i <= pages; i++) {
        range.push(i)
      }
      this.createRangeWithDots(range);
    }
  }

  createPagination(current, pages) {
    let totalNumberButtons = this.totalNumberButtons,
      left = Number(current) - 1,
      right = Number(current) + 1,
      range = []

    if (current < pages - (pages - (totalNumberButtons - 2))) { //current page is among first 5
      for (let i = 1; i <= totalNumberButtons - 2; i++) {
        range.push(i)
      }
      range.push(pages);
    }
    else if (current > pages - (totalNumberButtons - 3)) { //current page is among last 5
      range.push(1);
      for (let i = pages - (totalNumberButtons - 3); i <= pages; i++) {
        range.push(i)
      }
    } else { //else for all middle current pages
      range.push(1);
      for (let i = 2; i < pages; i++) {
        if (i == left || i == current || i == right) {
          range.push(i)
        }
      }
      range.push(pages);
    }

    this.createRangeWithDots(range);
  }

  createRangeWithDots(range) {
    let l, rangeWithDots = [];

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    this.pages = rangeWithDots;
  }

  showPage(page, event?) {
    if (page != this.currentPage && page != "...") {
      this.currentPage = page;
      this.output = {
        "offset": page,
        "size": this.sizePerPage
      }
      this.pageEvent.emit(this.output);
      this.initPagination();
      if (event && this.gotoPageInput) //event exists when user clicks on page number
        this.gotoPageInput.nativeElement.value = null;
    }
  }

  gotoPage(key, value) {
    if (key.keyCode == 13 && value <= this.pageNumbers) {
      this.showPage(value);
    }
  }

  showPerPage(value) {
    if (value) {
      this.sizePerPage = Number(value);
    } else {
      this.sizePerPage = this.defaultSizePerPage;
    }
    this.initPagination();
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {

  }

}
