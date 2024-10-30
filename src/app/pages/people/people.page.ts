import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AnimationController, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { PersonModalComponent } from 'src/app/components/person-modal/person-modal.component';
import { Group } from 'src/app/core/models/group.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { Person } from 'src/app/core/models/person.model';
import { GroupsService } from 'src/app/core/services/impl/groups.service';
import { PeopleService } from 'src/app/core/services/impl/people.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  _people:BehaviorSubject<Person[]> = new BehaviorSubject<Person[]>([]);
  people$:Observable<Person[]> = this._people.asObservable();
  public alertYesNoButtons = [
    {
      text: 'No',
      role: 'no'
    },
    {
      text: 'Yes',
      role: 'yes'
    },
  ];
  constructor(
    private peopleSvc:PeopleService,
    private groupSvc:GroupsService,
    private modalCtrl:ModalController
  ) {}

  ngOnInit(): void {
    this.getMorePeople();
  }

  selectedPerson: any = null;
  isAnimating = false;
  page:number = 1;
  pageSize:number = 25;

  refresh(){
    this.page=1;
    this.peopleSvc.getAll(this.page, this.pageSize).subscribe({
      next:(response:Paginated<Person>)=>{
        this._people.next([...response.data]);
        this.page++;
      }
    });
  }
  getMorePeople(notify:HTMLIonInfiniteScrollElement | null = null) {
    this.peopleSvc.getAll(this.page, this.pageSize).subscribe({
      next:(response:Paginated<Person>)=>{
        this._people.next([...this._people.value, ...response.data]);
        this.page++;
        notify?.complete();
      }
    });
  }

  async openPersonDetail(person: any, index: number) {
    await this.presentModalPerson('edit', person);
    this.selectedPerson = person;
  }

  onIonInfinite(ev:InfiniteScrollCustomEvent) {
    this.getMorePeople(ev.target);
  }

  private async presentModalPerson(mode:'new'|'edit', person:Person|undefined=undefined){
    let _groups:Group[] = await lastValueFrom(this.groupSvc.getAll())
    const modal = await this.modalCtrl.create({
      component:PersonModalComponent,
      componentProps:(mode=='edit'?{
        person: person,
        groups: _groups
      }:{
        groups: _groups
      })
    });
    modal.onDidDismiss().then((response:any)=>{
      switch (response.role) {
        case 'new':
          this.peopleSvc.add(response.data).subscribe({
            next:res=>{
              this.refresh();
            },
            error:err=>{}
          });
          break;
        case 'edit':
          this.peopleSvc.update(person!.id, response.data).subscribe({
            next:res=>{
              this.refresh();
            },
            error:err=>{}
          });
          break;
        default:
          break;
      }
    });
    await modal.present();
  }

  async onAddPerson(){
    await this.presentModalPerson('new');
  }

  onDeletePerson(evt:CustomEvent, person:Person){
    
    if(evt.detail.role=='yes')
      this.peopleSvc.delete(person.id).subscribe({
        next:response=>{
          this.refresh();
        },
        error:err=>{}
      });
  }

  

}
