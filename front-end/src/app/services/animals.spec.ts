import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AnimalsService } from './animals.service';

describe('AnimalsService', () => {
  let service: AnimalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(AnimalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
