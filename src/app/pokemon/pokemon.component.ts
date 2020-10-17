import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { hs } from '../app.utility';

import { PokemonService } from '../service/pokemon.service';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss'],
})
export class PokemonComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private pokemon: PokemonService,
    private title: Title,
    private meta: Meta
  ) {}

  id: string;
  details: any = {};
  about: Array<string> = [];
  stat: any = {};
  shape = '';
  growthRate = '';

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      const { id } = params;

      this.id = id;
      this.fetch();
    });
  }

  private fetch() {
    this.pokemon.details(this.id).subscribe((res) => {
      this.details = res;

      const img: string =
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' +
        this.id +
        '.png';

      const url = window.location.href;

      // General meta tags
      this.title.setTitle(res.name);
      this.meta.updateTag({
        name: 'description',
        content: res.name + 'This is dynamic content.',
      });

      // Facebook tags
      this.meta.updateTag({ property: 'og:type', content: 'article' });
      this.meta.updateTag({ property: 'og:site_name', content: res.name });
      this.meta.updateTag({ property: 'og:title', content: res.name });
      this.meta.updateTag({ property: 'og:image', content: img });
      this.meta.updateTag({ property: 'og:url', content: url });
      this.meta.updateTag({
        property: 'og:description',
        content: res.name + ' article description',
      });
    });

    this.pokemon.about(this.id).subscribe((res) => {
      // tslint:disable-next-line:variable-name
      const _arr: Array<string> = [];
      this.shape = res.shape.name;
      this.growthRate = hs(res.growth_rate.name);

      const name = `${res.name.charAt(0).toUpperCase()}${res.name.slice(
        1,
        res.name.length
      )}`;

      res.flavor_text_entries.forEach((entry: any) => {
        if (entry.language.name === 'en') {
          _arr.push(
            entry.flavor_text
              .replace(/\./gi, '. ')
              .replace('\n', ' ')
              .replace(/\s\s+/g, ' ')
              .replace('POKéMON', 'Pokemon')
              .replace(new RegExp(name.toUpperCase(), 'g'), name)
          );
        }
      });

      this.about = [...new Set(_arr.slice(0, 5))];
    });
  }
}
