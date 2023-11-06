import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CitiesComponent } from './cities.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from '../angular-material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CityService } from '../services/city.service';
import { of } from 'rxjs';
import { ApiResult } from '../models/api-result.interface';
import { City } from '../models/city.interface';

describe('CitiesComponent', () => {
  let fixture: ComponentFixture<CitiesComponent>;
  let component: CitiesComponent;

  beforeEach(waitForAsync(() => {
    // Create a mock cityService object with a mock 'getData' method
    const cityService =
      jasmine.createSpyObj<CityService>('CityService', ['getData']);

    // Configure the 'getData' spy method
    cityService.getData.and.returnValue(
      of<ApiResult<City>>({
        data: [
          <City>{
            name: 'TestCity1',
            id: 1, lat: 1, lon: 1,
            countryId: 1, countryName: 'TestCountry1'
          },
          <City>{
            name: 'TestCity2',
            id: 2, lat: 1, lon: 1,
            countryId: 1, countryName: 'TestCountry1'
          },
          <City>{
            name: 'TestCity3',
            id: 3, lat: 1, lon: 1,
            countryId: 1, countryName: 'TestCountry1'
          }
        ],
        pageIndex: 0,
        pageSize: 10,
        totalCount: 3,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false
      })
    );

    TestBed.configureTestingModule({
      declarations: [CitiesComponent],
      imports: [
        BrowserAnimationsModule,
        AngularMaterialModule,
        RouterTestingModule
      ],
      providers: [
        {provide: CityService, useValue: cityService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitiesComponent);
    component = fixture.componentInstance;
    component.paginator = jasmine.createSpyObj("MatPaginator", ["length", "pageIndex", "pageSize"]);
    fixture.detectChanges();
  });

  it('should display a "Cities" title', waitForAsync(() => {
    let title = fixture.nativeElement.querySelector('h1');
    expect(title.textContent).toEqual('Cities');
  }));

  it('should contain a table with a list of one or more cities', waitForAsync(() => {
    let table = fixture.nativeElement.querySelector('table.mat-table');
    let tableRows = table.querySelectorAll('tr.mat-row');
    expect(tableRows.length).toBeGreaterThan(0);
  }));

})
