# ng-pagination 
Custom angular pagination component. Just plug and play into your existing component to show pagination where ever required.

## Usage:
```
<pagination 
  [totalRecords]=500" 
  [sizePerPage]="125" 
  (pageEvent)="makeApiCall($event)" 
  [goToPageBox]="true"  
  [perPageDropDown]="50">
</pagination>
```
```
/*
(pageEvent)   -> event fired when page is clicked                                                                                 
makeApiCall() -> Your method which makes api call
$event        -> Object containing page details e.g: { "offset": 5, "size": 125 }
[goToPageBox] -> to show hide the go to page input box
[perPageDropDown]="50" -> to show dropdown to change records per page, here 50 is multiple by which you want to changes records per page. Eg-> 50, 100, 150, 200, ...
*/
```
