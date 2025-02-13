import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Person } from "../../models/person.model";

interface PersonRaw{
    id:string,
    name:{
        title:string;
        first:string;
        last:string;
    },
    age:number,
    genero:string,
    picture:{
        large:string
        thumbnail:string
    }
}

@Injectable({
    providedIn: 'root'
  })
  export class PeopleLocalStorageMapping implements IBaseMapping<Person> {
    getFiltered(data: any[], filterData: string): Person[] {
        throw new Error("Method not implemented.");
    }
    getAll(data: any[]): Person[] {
        throw new Error("Method not implemented.");
    }
    setAdd(data: Person) {
        throw new Error("Method not implemented.");
    }
    setUpdate(data: any) {
        throw new Error("Method not implemented.");
    }
    getPaginated(page:number, pageSize:number, pages:number, data: PersonRaw[]): Paginated<Person> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Person>((d:PersonRaw)=>{
            return this.getOne(d);
        })};
    }
    getOne(data: PersonRaw):Person {
        return {
            id:data.id, 
            name:data.name.first, 
            surname:data.name.last, 
            age:data.age,
            gender:data.genero,
            picture:{
                large:data.picture.large, 
                thumbnail:data.picture.thumbnail
            }};
    }
    getAdded(data: PersonRaw):Person {
        return this.getOne(data);
    }
    getUpdated(data: PersonRaw):Person {
        return this.getOne(data);
    }
    getDeleted(data: PersonRaw):Person {
        return this.getOne(data);
    }
  }
  