import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonInput, IonPopover } from '@ionic/angular';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { Group } from 'src/app/core/models/group.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { GroupsService } from 'src/app/core/services/impl/groups.service';

@Component({
  selector: 'app-group-selectable2',
  templateUrl: './group-selectable2.component.html',
  styleUrls: ['./group-selectable2.component.scss'],
  providers:[{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GroupSelectable2Component),
    multi: true
  }]
})
export class GroupSelectable2Component  implements OnInit, ControlValueAccessor {

  private _groups:BehaviorSubject<Group[]> = new BehaviorSubject<Group[]>([]);
  public groups$:Observable<Group[]> = this._groups.asObservable();

  groupSelected:Group | undefined;
  disabled:boolean = true;
  page:number = 1;
  pageSize:number = 10;
  totalPages!: number;
  alreadyLoadedGroups: boolean = false;

  propagateChange = (obj: any) => {}

  constructor(
    public groupsSvc:GroupsService
  ) {
    this.groupsSvc.getAll(this.page, this.pageSize).subscribe({
      next:(response:Paginated<Group>)=>{
        this.totalPages = response.pages;
        this._groups.next([...this._groups.value, ...response.data]);
        this.page++;
      }
    });
  }
  
  async onLoadGroups(){
    this.getMoreGroups()
  }

  getMoreGroups(filter: string = "", notify:HTMLIonInfiniteScrollElement | null = null) {
    if (filter == "") {
      if (this.page <= this.totalPages) {
        this.groupsSvc.getAll(this.page, this.pageSize).subscribe({
          next:(response:Paginated<Group>)=>{
            this.totalPages = response.pages;
            this._groups.next([...this._groups.value, ...response.data]);
            this.page++;
            notify?.complete();
          }
        });
      } else {
        this.groupsSvc.getAll(1, this.pageSize * this.totalPages).subscribe({
          next:(response:Paginated<Group>)=>{
            this._groups.next(response.data);
            notify?.complete();
          }
        });
      }
    } else {
      this.groupsSvc.query(filter).subscribe({
        next: (groupsFiltered: Group[]) => {
          this._groups.next(groupsFiltered);
        }
      });
    }
  }

  private async selectGroup(id: string | undefined, propagate: boolean = false){
    if(id)
      this.groupSelected  = await lastValueFrom(this.groupsSvc.getById(id));
    else
      this.groupSelected = undefined;
    if(propagate && this.groupSelected)
      this.propagateChange(this.groupSelected.id);
  }
  
  writeValue(obj: any): void {
    this.selectGroup(obj);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    // TODO
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit() {}

  private async filter(filtering:string){
    this.getMoreGroups(filtering);
  }

  onFilter(evt:any){
    this.filter(evt.detail.value);
  }

  onGroupClicked(popover:IonPopover, group:Group){
    this.selectGroup(group.id, true);
    popover.dismiss();
  }

  clearSearch(input:IonInput){
    input.value = "";
    this.filter("");
  }

  deselect(popover:IonPopover|null=null){
    this.selectGroup(undefined, true);
    if(popover) popover.dismiss();
  }
}
