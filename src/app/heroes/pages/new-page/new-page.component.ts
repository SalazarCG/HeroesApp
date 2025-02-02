import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``,
})
export class NewPageComponent implements OnInit {
  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  constructor(
    private router: Router,
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesService.getHeroById(id)))
      .subscribe((hero) => {
        if (!hero) return this.router.navigateByUrl('/');
        this.heroForm.reset(hero);
        return;
      });
  }

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  goBack(): void {
    this.router.navigateByUrl('/heroes/list');
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit():void {

    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
      .subscribe( hero => {
        this.showSnackbar(`${hero.superhero} actualizado`);
      });
      return;
    }

    this.heroesService.addHero(this.currentHero)
    .subscribe( hero => {
      this.router.navigate(['/heroes/edit', hero.id]);
      this.showSnackbar(`${hero.superhero} creado`);
    });
  }

  onDeleteHero() {
    if (!this.currentHero.id)
      throw Error('No se puede eliminar un heroe sin id');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed()
    .pipe(
      filter( (result: boolean) => result ),
      switchMap( () => this.heroesService.deleteHero(this.currentHero.id) ),
      filter( (wasDeleted: boolean) => wasDeleted),
    )
    .subscribe((hero) => {
      this.router.navigateByUrl('/heroes/list');
      this.showSnackbar(`${this.currentHero.superhero} eliminado`);
    })
  }

  showSnackbar(message: string): void {
    this.snackbar.open(message, 'ok!', {
      duration: 2500,
    });
  }
}
